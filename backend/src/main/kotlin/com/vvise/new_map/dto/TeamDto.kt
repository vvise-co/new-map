package com.vvise.new_map.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.vvise.new_map.entity.Team
import com.vvise.new_map.entity.TeamMember
import com.vvise.new_map.entity.TeamRole
import java.time.Instant
import java.util.UUID

data class CreateTeamRequest(
    val name: String,
    val description: String? = null
)

data class UpdateTeamRequest(
    val name: String? = null,
    val description: String? = null
)

data class TeamDto(
    val id: UUID,
    val name: String,
    val description: String?,
    @JsonProperty("created_at")
    val createdAt: Instant?,
    @JsonProperty("updated_at")
    val updatedAt: Instant?,
    @JsonProperty("member_count")
    val memberCount: Int? = null,
    @JsonProperty("current_user_role")
    val currentUserRole: TeamRole? = null
) {
    companion object {
        fun from(team: Team, memberCount: Int? = null, currentUserRole: TeamRole? = null): TeamDto {
            return TeamDto(
                id = team.id!!,
                name = team.name,
                description = team.description,
                createdAt = team.createdAt,
                updatedAt = team.updatedAt,
                memberCount = memberCount,
                currentUserRole = currentUserRole
            )
        }
    }
}

data class TeamMemberDto(
    val id: UUID,
    @JsonProperty("user_id")
    val userId: UUID,
    @JsonProperty("user_sub")
    val userSub: String,
    @JsonProperty("user_name")
    val userName: String,
    @JsonProperty("user_email")
    val userEmail: String,
    val role: TeamRole,
    @JsonProperty("joined_at")
    val joinedAt: Instant?
) {
    companion object {
        fun from(member: TeamMember): TeamMemberDto {
            return TeamMemberDto(
                id = member.id!!,
                userId = member.user.id!!,
                userSub = member.user.sub,
                userName = member.user.name,
                userEmail = member.user.email,
                role = member.role,
                joinedAt = member.createdAt
            )
        }
    }
}

data class TeamWithMembersDto(
    val team: TeamDto,
    val members: List<TeamMemberDto>
)

data class CreateTeamResponse(
    val team: TeamDto,
    val membership: TeamMemberDto
)
