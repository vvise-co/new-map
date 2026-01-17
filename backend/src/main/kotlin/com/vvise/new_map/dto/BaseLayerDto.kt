package com.vvise.new_map.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.vvise.new_map.entity.BaseLayer
import com.vvise.new_map.entity.BaseSegment
import java.time.Instant
import java.util.UUID

data class CreateBaseSegmentRequest(
    val name: String,
    @JsonProperty("start_time")
    val startTime: Double,
    @JsonProperty("end_time")
    val endTime: Double,
    @JsonProperty("camera_position")
    val cameraPosition: Map<String, Any>,
    @JsonProperty("transition_to_next")
    val transitionToNext: Map<String, Any>? = null
)

data class UpdateBaseSegmentRequest(
    val name: String? = null,
    @JsonProperty("start_time")
    val startTime: Double? = null,
    @JsonProperty("end_time")
    val endTime: Double? = null,
    @JsonProperty("camera_position")
    val cameraPosition: Map<String, Any>? = null,
    @JsonProperty("transition_to_next")
    val transitionToNext: Map<String, Any>? = null
)

data class ReorderBaseSegmentsRequest(
    @JsonProperty("segment_ids")
    val segmentIds: List<UUID>
)

data class BaseLayerDto(
    val id: UUID,
    @JsonProperty("composition_id")
    val compositionId: UUID,
    val name: String,
    val segments: List<BaseSegmentDto>,
    @JsonProperty("created_at")
    val createdAt: Instant?,
    @JsonProperty("updated_at")
    val updatedAt: Instant?
) {
    companion object {
        fun from(baseLayer: BaseLayer, segments: List<BaseSegmentDto>): BaseLayerDto {
            return BaseLayerDto(
                id = baseLayer.id!!,
                compositionId = baseLayer.composition!!.id!!,
                name = baseLayer.name,
                segments = segments,
                createdAt = baseLayer.createdAt,
                updatedAt = baseLayer.updatedAt
            )
        }
    }
}

data class BaseSegmentDto(
    val id: UUID,
    @JsonProperty("base_layer_id")
    val baseLayerId: UUID,
    val name: String,
    val order: Int,
    @JsonProperty("start_time")
    val startTime: Double,
    @JsonProperty("end_time")
    val endTime: Double,
    @JsonProperty("camera_position")
    val cameraPosition: Map<String, Any>,
    @JsonProperty("transition_to_next")
    val transitionToNext: Map<String, Any>?,
    @JsonProperty("created_at")
    val createdAt: Instant?,
    @JsonProperty("updated_at")
    val updatedAt: Instant?
) {
    companion object {
        fun from(segment: BaseSegment): BaseSegmentDto {
            return BaseSegmentDto(
                id = segment.id!!,
                baseLayerId = segment.baseLayer!!.id!!,
                name = segment.name,
                order = segment.order,
                startTime = segment.startTime,
                endTime = segment.endTime,
                cameraPosition = segment.cameraPosition,
                transitionToNext = segment.transitionToNext,
                createdAt = segment.createdAt,
                updatedAt = segment.updatedAt
            )
        }
    }
}
