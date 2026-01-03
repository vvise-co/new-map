package com.vvise.new_map.repository

import com.vvise.new_map.entity.Team
import com.vvise.new_map.entity.TeamInvitation
import org.springframework.stereotype.Repository
import java.time.Instant
import java.util.UUID

@Repository
interface TeamInvitationRepository : BaseRepository<TeamInvitation> {

    fun findByTokenAndDeletedFalse(token: String): TeamInvitation?

    fun findByTeamAndDeletedFalse(team: Team): List<TeamInvitation>

    fun findByTeamIdAndDeletedFalse(teamId: UUID): List<TeamInvitation>

    fun findByTeamAndUsedAtIsNullAndExpiresAtAfterAndDeletedFalse(
        team: Team,
        now: Instant
    ): List<TeamInvitation>

    fun findByTeamIdAndUsedAtIsNullAndExpiresAtAfterAndDeletedFalse(
        teamId: UUID,
        now: Instant
    ): List<TeamInvitation>
}
