package com.vvise.new_map.repository

import com.vvise.new_map.entity.SegmentTransition
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface SegmentTransitionRepository : BaseRepository<SegmentTransition> {

    fun findByFromLayerIdAndDeletedFalse(fromLayerId: UUID): SegmentTransition?

    fun findByToLayerIdAndDeletedFalse(toLayerId: UUID): SegmentTransition?

    fun findByFromLayerIdAndToLayerIdAndDeletedFalse(fromLayerId: UUID, toLayerId: UUID): SegmentTransition?
}
