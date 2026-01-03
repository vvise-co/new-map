package com.vvise.new_map.repository

import com.vvise.new_map.entity.Team
import com.vvise.new_map.entity.TeamOwnedEntity
import org.springframework.data.repository.NoRepositoryBean
import java.util.UUID

@NoRepositoryBean
interface TeamOwnedRepository<T : TeamOwnedEntity> : BaseRepository<T> {

    fun findByTeamAndDeletedFalse(team: Team): List<T>

    fun findByTeamIdAndDeletedFalse(teamId: UUID): List<T>

    fun findByIdAndTeamAndDeletedFalse(id: UUID, team: Team): T?

    fun findByIdAndTeamIdAndDeletedFalse(id: UUID, teamId: UUID): T?

    fun findByCreatedByAndDeletedFalse(createdBy: String): List<T>

    fun findByUpdatedByAndDeletedFalse(updatedBy: String): List<T>
}
