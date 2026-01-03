package com.vvise.new_map.service

import com.vvise.new_map.dto.*
import com.vvise.new_map.entity.TeamInvitation
import com.vvise.new_map.entity.TeamRole
import com.vvise.new_map.repository.TeamInvitationRepository
import com.vvise.new_map.repository.TeamMemberRepository
import com.vvise.new_map.repository.TeamRepository
import com.vvise.new_map.security.AuthenticatedUser
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.security.SecureRandom
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.Base64
import java.util.UUID

@Service
class InvitationService(
    private val invitationRepository: TeamInvitationRepository,
    private val teamRepository: TeamRepository,
    private val teamMemberRepository: TeamMemberRepository,
    private val teamService: TeamService,
    @Value("\${app.base-url:http://localhost:5173}")
    private val baseUrl: String
) {

    private val secureRandom = SecureRandom()

    @Transactional
    fun createInvitation(request: CreateInvitationRequest, authenticatedUser: AuthenticatedUser): InvitationDto {
        if (!teamService.isTeamAdmin(request.teamId, authenticatedUser)) {
            throw IllegalAccessException("Only team admins can create invitations")
        }

        val team = teamRepository.findByIdAndDeletedFalse(request.teamId)
            ?: throw IllegalArgumentException("Team not found")

        val user = teamService.getOrCreateUser(authenticatedUser)

        val token = generateSecureToken()

        val expiresInDays = request.expiresInDays.coerceIn(1, 30)
        val expiresAt = Instant.now().plus(expiresInDays.toLong(), ChronoUnit.DAYS)

        val invitation = TeamInvitation(
            token = token,
            team = team,
            expiresAt = expiresAt,
            createdBy = user
        )

        val saved = invitationRepository.save(invitation)
        return InvitationDto.from(saved, baseUrl)
    }

    fun getTeamInvitations(teamId: UUID, authenticatedUser: AuthenticatedUser): List<InvitationDto> {
        if (!teamService.isTeamAdmin(teamId, authenticatedUser)) {
            throw IllegalAccessException("Only team admins can view invitations")
        }

        return invitationRepository.findByTeamIdAndDeletedFalse(teamId)
            .map { InvitationDto.from(it, baseUrl) }
    }

    fun getActiveInvitations(teamId: UUID, authenticatedUser: AuthenticatedUser): List<InvitationDto> {
        if (!teamService.isTeamAdmin(teamId, authenticatedUser)) {
            throw IllegalAccessException("Only team admins can view invitations")
        }

        return invitationRepository.findByTeamIdAndUsedAtIsNullAndExpiresAtAfterAndDeletedFalse(
            teamId, Instant.now()
        ).map { InvitationDto.from(it, baseUrl) }
    }

    fun getInvitationInfo(token: String): InvitationInfoDto? {
        val invitation = invitationRepository.findByTokenAndDeletedFalse(token) ?: return null

        return InvitationInfoDto(
            teamName = invitation.team.name,
            teamDescription = invitation.team.description,
            inviterName = invitation.createdBy.name,
            expiresAt = invitation.expiresAt,
            isValid = invitation.isValid()
        )
    }

    @Transactional
    fun acceptInvitation(token: String, authenticatedUser: AuthenticatedUser): AcceptInvitationResponse {
        val invitation = invitationRepository.findByTokenAndDeletedFalse(token)
            ?: throw IllegalArgumentException("Invitation not found")

        if (!invitation.isValid()) {
            throw IllegalStateException("Invitation is no longer valid")
        }

        val user = teamService.getOrCreateUser(authenticatedUser)

        // Check if user is already a member
        val existingMembership = teamMemberRepository.findByTeamAndUserAndDeletedFalse(invitation.team, user)
        if (existingMembership != null) {
            throw IllegalStateException("You are already a member of this team")
        }

        invitation.markAsUsed(user)
        invitationRepository.save(invitation)

        val membership = teamService.addMemberToTeam(invitation.team, user, TeamRole.MEMBER)

        val memberCount = teamMemberRepository.findByTeamAndDeletedFalse(invitation.team).size

        return AcceptInvitationResponse(
            success = true,
            team = TeamDto.from(invitation.team, memberCount, TeamRole.MEMBER),
            membership = TeamMemberDto.from(membership)
        )
    }

    @Transactional
    fun revokeInvitation(invitationId: UUID, authenticatedUser: AuthenticatedUser): Boolean {
        val invitation = invitationRepository.findByIdAndDeletedFalse(invitationId)
            ?: throw IllegalArgumentException("Invitation not found")

        if (!teamService.isTeamAdmin(invitation.team.id!!, authenticatedUser)) {
            throw IllegalAccessException("Only team admins can revoke invitations")
        }

        invitation.softDelete()
        invitationRepository.save(invitation)
        return true
    }

    private fun generateSecureToken(): String {
        val bytes = ByteArray(32)
        secureRandom.nextBytes(bytes)
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes)
    }
}
