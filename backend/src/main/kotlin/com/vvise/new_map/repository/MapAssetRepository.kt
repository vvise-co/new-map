package com.vvise.new_map.repository

import com.vvise.new_map.entity.MapAsset
import com.vvise.new_map.entity.MapAssetType
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface MapAssetRepository : BaseRepository<MapAsset> {

    fun findByTeamIdAndDeletedFalse(teamId: UUID): List<MapAsset>

    fun findByIdAndTeamIdAndDeletedFalse(id: UUID, teamId: UUID): MapAsset?

    fun findByTeamIdAndTypeAndDeletedFalse(teamId: UUID, type: MapAssetType): List<MapAsset>

    fun findByTeamIdAndCategoryIdAndDeletedFalse(teamId: UUID, categoryId: UUID): List<MapAsset>

    fun findByTeamIdAndCategoryIsNullAndDeletedFalse(teamId: UUID): List<MapAsset>

    fun findByTeamIdAndTagsContainingIgnoreCaseAndDeletedFalse(teamId: UUID, tag: String): List<MapAsset>
}
