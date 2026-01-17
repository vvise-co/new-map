package com.vvise.new_map.repository

import com.vvise.new_map.entity.OverlayLayer
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface OverlayLayerRepository : BaseRepository<OverlayLayer> {

    fun findByCompositionIdAndDeletedFalseOrderByOrder(compositionId: UUID): List<OverlayLayer>

    fun findByIdAndCompositionIdAndDeletedFalse(id: UUID, compositionId: UUID): OverlayLayer?

    fun findByMapAssetIdAndDeletedFalse(mapAssetId: UUID): List<OverlayLayer>
}
