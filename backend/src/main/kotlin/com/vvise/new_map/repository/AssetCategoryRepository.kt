package com.vvise.new_map.repository

import com.vvise.new_map.entity.AssetCategory
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface AssetCategoryRepository : BaseRepository<AssetCategory> {

    fun findByTeamIdAndDeletedFalse(teamId: UUID): List<AssetCategory>

    fun findByTeamIdAndParentCategoryIdAndDeletedFalse(teamId: UUID, parentCategoryId: UUID): List<AssetCategory>

    fun findByTeamIdAndParentCategoryIsNullAndDeletedFalse(teamId: UUID): List<AssetCategory>

    fun findByIdAndTeamIdAndDeletedFalse(id: UUID, teamId: UUID): AssetCategory?

    fun findByTeamIdAndDeletedFalseOrderByOrder(teamId: UUID): List<AssetCategory>
}
