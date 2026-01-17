package com.vvise.new_map.repository

import com.vvise.new_map.entity.BaseLayer
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface BaseLayerRepository : BaseRepository<BaseLayer> {

    fun findByCompositionIdAndDeletedFalse(compositionId: UUID): BaseLayer?
}
