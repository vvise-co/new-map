package com.vvise.new_map.repository

import com.vvise.new_map.entity.AnimatableProperty
import com.vvise.new_map.entity.SegmentKeyframe
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface SegmentKeyframeRepository : BaseRepository<SegmentKeyframe> {

    fun findByLayerIdAndDeletedFalseOrderByTimeOffset(layerId: UUID): List<SegmentKeyframe>

    fun findByIdAndLayerIdAndDeletedFalse(id: UUID, layerId: UUID): SegmentKeyframe?

    fun findByLayerIdAndPropertyAndDeletedFalse(layerId: UUID, property: AnimatableProperty): List<SegmentKeyframe>
}
