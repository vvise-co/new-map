package com.vvise.new_map.repository

import com.vvise.new_map.entity.BaseEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.data.repository.NoRepositoryBean
import java.util.UUID

@NoRepositoryBean
interface BaseRepository<T : BaseEntity> : JpaRepository<T, UUID>, JpaSpecificationExecutor<T> {

    fun findByIdAndDeletedFalse(id: UUID): T?

    fun findAllByDeletedFalse(): List<T>
}
