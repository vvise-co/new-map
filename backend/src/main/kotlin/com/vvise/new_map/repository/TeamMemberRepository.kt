package com.vvise.new_map.repository

import com.vvise.new_map.entity.Team
import com.vvise.new_map.entity.TeamMember
import com.vvise.new_map.entity.TeamRole
import com.vvise.new_map.entity.User
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface TeamMemberRepository : BaseRepository<TeamMember> {

    fun findByTeamAndDeletedFalse(team: Team): List<TeamMember>

    fun findByTeamIdAndDeletedFalse(teamId: UUID): List<TeamMember>

    fun findByUserAndDeletedFalse(user: User): List<TeamMember>

    fun findByUserIdAndDeletedFalse(userId: UUID): List<TeamMember>

    fun findByUserSubAndDeletedFalse(userSub: String): List<TeamMember>

    fun findByTeamAndUserAndDeletedFalse(team: Team, user: User): TeamMember?

    fun findByTeamIdAndUserIdAndDeletedFalse(teamId: UUID, userId: UUID): TeamMember?

    fun findByTeamIdAndUserSubAndDeletedFalse(teamId: UUID, userSub: String): TeamMember?

    fun findByTeamAndRoleAndDeletedFalse(team: Team, role: TeamRole): List<TeamMember>

    fun existsByTeamAndUserAndDeletedFalse(team: Team, user: User): Boolean

    fun existsByTeamIdAndUserSubAndDeletedFalse(teamId: UUID, userSub: String): Boolean
}
