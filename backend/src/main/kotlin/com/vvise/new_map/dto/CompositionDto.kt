package com.vvise.new_map.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.vvise.new_map.entity.Composition
import java.time.Instant
import java.util.UUID

data class CreateCompositionRequest(
    val name: String? = null,
    val duration: Double? = null,
    @JsonProperty("frame_rate")
    val frameRate: Int? = null,
    @JsonProperty("map_config")
    val mapConfig: Map<String, Any>? = null
)

data class UpdateCompositionRequest(
    val name: String? = null,
    val duration: Double? = null,
    @JsonProperty("frame_rate")
    val frameRate: Int? = null,
    @JsonProperty("map_config")
    val mapConfig: Map<String, Any>? = null
)

data class CompositionDto(
    val id: UUID,
    @JsonProperty("project_id")
    val projectId: UUID,
    val name: String,
    val duration: Double,
    @JsonProperty("frame_rate")
    val frameRate: Int,
    @JsonProperty("map_config")
    val mapConfig: Map<String, Any>,
    @JsonProperty("base_layer")
    val baseLayer: BaseLayerDto?,
    @JsonProperty("overlay_layers")
    val overlayLayers: List<OverlayLayerDto>,
    @JsonProperty("created_at")
    val createdAt: Instant?,
    @JsonProperty("updated_at")
    val updatedAt: Instant?
) {
    companion object {
        fun from(
            composition: Composition,
            baseLayer: BaseLayerDto?,
            overlayLayers: List<OverlayLayerDto>
        ): CompositionDto {
            return CompositionDto(
                id = composition.id!!,
                projectId = composition.project!!.id!!,
                name = composition.name,
                duration = composition.duration,
                frameRate = composition.frameRate,
                mapConfig = composition.mapConfig,
                baseLayer = baseLayer,
                overlayLayers = overlayLayers,
                createdAt = composition.createdAt,
                updatedAt = composition.updatedAt
            )
        }
    }
}

data class CompositionSummaryDto(
    val id: UUID,
    @JsonProperty("project_id")
    val projectId: UUID,
    val name: String,
    val duration: Double,
    @JsonProperty("frame_rate")
    val frameRate: Int,
    @JsonProperty("created_at")
    val createdAt: Instant?,
    @JsonProperty("updated_at")
    val updatedAt: Instant?
) {
    companion object {
        fun from(composition: Composition): CompositionSummaryDto {
            return CompositionSummaryDto(
                id = composition.id!!,
                projectId = composition.project!!.id!!,
                name = composition.name,
                duration = composition.duration,
                frameRate = composition.frameRate,
                createdAt = composition.createdAt,
                updatedAt = composition.updatedAt
            )
        }
    }
}
