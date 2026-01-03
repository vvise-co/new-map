package com.vvise.new_map.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.vvise.new_map.entity.TeamInvitation
import java.time.Instant
import java.util.UUID

data class CreateInvitationRequest(
    @JsonProperty("team_id")
    val teamId: UUID,
    @JsonProperty("expires_in_days")
    val expiresInDays: Int = 7
)

data class InvitationDto(
    val id: UUID,
    val token: String,
    @JsonProperty("team_id")
    val teamId: UUID,
    @JsonProperty("team_name")
    val teamName: String,
    @JsonProperty("invite_link")
    val inviteLink: String,
    @JsonProperty("expires_at")
    val expiresAt: Instant,
    @JsonProperty("created_at")
    val createdAt: Instant?,
    @JsonProperty("created_by_name")
    val createdByName: String,
    @JsonProperty("is_expired")
    val isExpired: Boolean,
    @JsonProperty("is_used")
    val isUsed: Boolean,
    @JsonProperty("used_at")
    val usedAt: Instant?,
    @JsonProperty("used_by_name")
    val usedByName: String?
) {
    companion object {
        fun from(invitation: TeamInvitation, baseUrl: String): InvitationDto {
            return InvitationDto(
                id = invitation.id!!,
                token = invitation.token,
                teamId = invitation.team.id!!,
                teamName = invitation.team.name,
                inviteLink = "$baseUrl/invite/${invitation.token}",
                expiresAt = invitation.expiresAt,
                createdAt = invitation.createdAt,
                createdByName = invitation.createdBy.name,
                isExpired = invitation.isExpired(),
                isUsed = invitation.isUsed(),
                usedAt = invitation.usedAt,
                usedByName = invitation.usedBy?.name
            )
        }
    }
}

data class InvitationInfoDto(
    @JsonProperty("team_name")
    val teamName: String,
    @JsonProperty("team_description")
    val teamDescription: String?,
    @JsonProperty("inviter_name")
    val inviterName: String,
    @JsonProperty("expires_at")
    val expiresAt: Instant,
    @JsonProperty("is_valid")
    val isValid: Boolean
)

data class AcceptInvitationResponse(
    val success: Boolean,
    val team: TeamDto,
    val membership: TeamMemberDto
)
