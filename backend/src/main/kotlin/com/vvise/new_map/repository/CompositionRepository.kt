package com.vvise.new_map.repository

import com.vvise.new_map.entity.Composition
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface CompositionRepository : BaseRepository<Composition> {

    fun findByProjectIdAndDeletedFalse(projectId: UUID): Composition?

    fun existsByProjectIdAndDeletedFalse(projectId: UUID): Boolean
}
