package com.vvise.new_map.repository

import com.vvise.new_map.entity.BaseSegment
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface BaseSegmentRepository : BaseRepository<BaseSegment> {

    fun findByBaseLayerIdAndDeletedFalseOrderByOrder(baseLayerId: UUID): List<BaseSegment>

    fun findByIdAndBaseLayerIdAndDeletedFalse(id: UUID, baseLayerId: UUID): BaseSegment?
}
