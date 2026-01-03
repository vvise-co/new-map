package com.vvise.new_map.service

import com.vvise.new_map.dto.*
import com.vvise.new_map.entity.Team
import com.vvise.new_map.entity.TeamMember
import com.vvise.new_map.entity.TeamRole
import com.vvise.new_map.entity.User
import com.vvise.new_map.repository.TeamMemberRepository
import com.vvise.new_map.repository.TeamRepository
import com.vvise.new_map.repository.UserRepository
import com.vvise.new_map.security.AuthenticatedUser
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class TeamService(
    private val teamRepository: TeamRepository,
    private val teamMemberRepository: TeamMemberRepository,
    private val userRepository: UserRepository
) {

    @Transactional
    fun createTeam(request: CreateTeamRequest, authenticatedUser: AuthenticatedUser): CreateTeamResponse {
        val user = getOrCreateUser(authenticatedUser)

        val team = Team(
            name = request.name,
            description = request.description
        )
        val savedTeam = teamRepository.save(team)

        val membership = TeamMember(
            team = savedTeam,
            user = user,
            role = TeamRole.OWNER
        )
        val savedMembership = teamMemberRepository.save(membership)

        return CreateTeamResponse(
            team = TeamDto.from(savedTeam, memberCount = 1, currentUserRole = TeamRole.OWNER),
            membership = TeamMemberDto.from(savedMembership)
        )
    }

    fun getUserTeams(authenticatedUser: AuthenticatedUser): List<TeamDto> {
        val memberships = teamMemberRepository.findByUserSubAndDeletedFalse(authenticatedUser.sub)
        return memberships.map { membership ->
            val memberCount = teamMemberRepository.findByTeamAndDeletedFalse(membership.team).size
            TeamDto.from(membership.team, memberCount, membership.role)
        }
    }

    fun getTeamById(teamId: UUID, authenticatedUser: AuthenticatedUser): TeamWithMembersDto? {
        val team = teamRepository.findByIdAndDeletedFalse(teamId) ?: return null

        val membership = teamMemberRepository.findByTeamIdAndUserSubAndDeletedFalse(teamId, authenticatedUser.sub)
            ?: return null

        val members = teamMemberRepository.findByTeamAndDeletedFalse(team)
            .map { TeamMemberDto.from(it) }

        return TeamWithMembersDto(
            team = TeamDto.from(team, members.size, membership.role),
            members = members
        )
    }

    fun hasTeam(authenticatedUser: AuthenticatedUser): Boolean {
        return teamMemberRepository.findByUserSubAndDeletedFalse(authenticatedUser.sub).isNotEmpty()
    }

    fun isTeamAdmin(teamId: UUID, authenticatedUser: AuthenticatedUser): Boolean {
        val membership = teamMemberRepository.findByTeamIdAndUserSubAndDeletedFalse(teamId, authenticatedUser.sub)
        return membership?.isAdmin() == true
    }

    fun isTeamMember(teamId: UUID, authenticatedUser: AuthenticatedUser): Boolean {
        return teamMemberRepository.existsByTeamIdAndUserSubAndDeletedFalse(teamId, authenticatedUser.sub)
    }

    @Transactional
    fun addMemberToTeam(team: Team, user: User, role: TeamRole): TeamMember {
        val existingMembership = teamMemberRepository.findByTeamAndUserAndDeletedFalse(team, user)
        if (existingMembership != null) {
            throw IllegalStateException("User is already a member of this team")
        }

        val membership = TeamMember(
            team = team,
            user = user,
            role = role
        )
        return teamMemberRepository.save(membership)
    }

    fun getOrCreateUser(authenticatedUser: AuthenticatedUser): User {
        val existingUser = userRepository.findBySubAndDeletedFalse(authenticatedUser.sub)
        if (existingUser != null) {
            if (existingUser.email != authenticatedUser.email || existingUser.name != authenticatedUser.name) {
                existingUser.email = authenticatedUser.email
                existingUser.name = authenticatedUser.name
                return userRepository.save(existingUser)
            }
            return existingUser
        }

        return userRepository.save(
            User(
                sub = authenticatedUser.sub,
                email = authenticatedUser.email,
                name = authenticatedUser.name
            )
        )
    }
}
