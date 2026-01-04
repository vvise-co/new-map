package com.vvise.new_map.repository

import com.vvise.new_map.entity.Project
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface ProjectRepository : TeamOwnedRepository<Project> {

    @Query("SELECT p FROM Project p WHERE p.team.id = :teamId AND p.deleted = false ORDER BY p.updatedAt DESC")
    fun findRecentByTeamId(teamId: UUID, pageable: Pageable): List<Project>

    @Query("SELECT p FROM Project p WHERE p.team.id = :teamId AND p.starred = true AND p.deleted = false ORDER BY p.updatedAt DESC")
    fun findStarredByTeamId(teamId: UUID): List<Project>

    override fun findByIdAndTeamIdAndDeletedFalse(id: UUID, teamId: UUID): Project?
}
