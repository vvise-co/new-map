package com.vvise.new_map.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.vvise.new_map.entity.OverlayLayer
import java.time.Instant
import java.util.UUID

// Create request - includes geometry (each layer is one map element)
data class CreateOverlayLayerRequest(
    val name: String,
    @JsonProperty("map_asset_id")
    val mapAssetId: UUID? = null,
    @JsonProperty("start_time")
    val startTime: Double? = null,
    @JsonProperty("end_time")
    val endTime: Double,
    val visible: Boolean? = null,
    val locked: Boolean? = null,
    val opacity: Double? = null,
    val geometry: GeoJsonGeometry,
    @JsonProperty("style_overrides")
    val styleOverrides: Map<String, Any>? = null
)

// Update request
data class UpdateOverlayLayerRequest(
    val name: String? = null,
    @JsonProperty("map_asset_id")
    val mapAssetId: UUID? = null,
    @JsonProperty("start_time")
    val startTime: Double? = null,
    @JsonProperty("end_time")
    val endTime: Double? = null,
    val visible: Boolean? = null,
    val locked: Boolean? = null,
    val opacity: Double? = null,
    val geometry: GeoJsonGeometry? = null,
    @JsonProperty("style_overrides")
    val styleOverrides: Map<String, Any>? = null
)

data class ReorderLayersRequest(
    @JsonProperty("layer_ids")
    val layerIds: List<UUID>
)

// Full layer DTO with keyframes and transitions
data class OverlayLayerDto(
    val id: UUID,
    @JsonProperty("composition_id")
    val compositionId: UUID,
    @JsonProperty("map_asset_id")
    val mapAssetId: UUID?,
    @JsonProperty("map_asset")
    val mapAsset: MapAssetDto?,
    val name: String,
    val order: Int,
    @JsonProperty("start_time")
    val startTime: Double,
    @JsonProperty("end_time")
    val endTime: Double,
    val visible: Boolean,
    val locked: Boolean,
    val opacity: Double,
    val geometry: GeoJsonGeometry,
    @JsonProperty("style_overrides")
    val styleOverrides: Map<String, Any>?,
    val keyframes: List<LayerKeyframeDto>,
    val transition: LayerTransitionDto?,
    @JsonProperty("created_at")
    val createdAt: Instant?,
    @JsonProperty("updated_at")
    val updatedAt: Instant?
) {
    companion object {
        fun from(
            layer: OverlayLayer,
            mapAsset: MapAssetDto?,
            keyframes: List<LayerKeyframeDto>,
            transition: LayerTransitionDto?
        ): OverlayLayerDto {
            return OverlayLayerDto(
                id = layer.id!!,
                compositionId = layer.composition!!.id!!,
                mapAssetId = layer.mapAsset?.id,
                mapAsset = mapAsset,
                name = layer.name,
                order = layer.order,
                startTime = layer.startTime,
                endTime = layer.endTime,
                visible = layer.visible,
                locked = layer.locked,
                opacity = layer.opacity,
                geometry = GeoJsonGeometry.from(layer.geometry),
                styleOverrides = layer.styleOverrides,
                keyframes = keyframes,
                transition = transition,
                createdAt = layer.createdAt,
                updatedAt = layer.updatedAt
            )
        }
    }
}

// Summary DTO for lists (without keyframes/transitions)
data class OverlayLayerSummaryDto(
    val id: UUID,
    @JsonProperty("composition_id")
    val compositionId: UUID,
    @JsonProperty("map_asset_id")
    val mapAssetId: UUID?,
    val name: String,
    val order: Int,
    @JsonProperty("start_time")
    val startTime: Double,
    @JsonProperty("end_time")
    val endTime: Double,
    val visible: Boolean,
    val locked: Boolean,
    val opacity: Double,
    val geometry: GeoJsonGeometry,
    @JsonProperty("keyframe_count")
    val keyframeCount: Int,
    @JsonProperty("created_at")
    val createdAt: Instant?,
    @JsonProperty("updated_at")
    val updatedAt: Instant?
) {
    companion object {
        fun from(layer: OverlayLayer, keyframeCount: Int): OverlayLayerSummaryDto {
            return OverlayLayerSummaryDto(
                id = layer.id!!,
                compositionId = layer.composition!!.id!!,
                mapAssetId = layer.mapAsset?.id,
                name = layer.name,
                order = layer.order,
                startTime = layer.startTime,
                endTime = layer.endTime,
                visible = layer.visible,
                locked = layer.locked,
                opacity = layer.opacity,
                geometry = GeoJsonGeometry.from(layer.geometry),
                keyframeCount = keyframeCount,
                createdAt = layer.createdAt,
                updatedAt = layer.updatedAt
            )
        }
    }
}

// Keyframe DTO (renamed from SegmentKeyframeDto)
data class LayerKeyframeDto(
    val id: UUID,
    @JsonProperty("layer_id")
    val layerId: UUID,
    @JsonProperty("time_offset")
    val timeOffset: Double,
    val property: com.vvise.new_map.entity.AnimatableProperty,
    val value: String,
    val easing: com.vvise.new_map.entity.EasingType,
    @JsonProperty("easing_params")
    val easingParams: Map<String, Any>?,
    @JsonProperty("created_at")
    val createdAt: Instant?,
    @JsonProperty("updated_at")
    val updatedAt: Instant?
) {
    companion object {
        fun from(keyframe: com.vvise.new_map.entity.SegmentKeyframe): LayerKeyframeDto {
            return LayerKeyframeDto(
                id = keyframe.id!!,
                layerId = keyframe.layer!!.id!!,
                timeOffset = keyframe.timeOffset,
                property = keyframe.property,
                value = keyframe.value,
                easing = keyframe.easing,
                easingParams = keyframe.easingParams,
                createdAt = keyframe.createdAt,
                updatedAt = keyframe.updatedAt
            )
        }
    }
}

// Transition DTO (renamed from SegmentTransitionDto)
data class LayerTransitionDto(
    val id: UUID,
    @JsonProperty("from_layer_id")
    val fromLayerId: UUID,
    @JsonProperty("to_layer_id")
    val toLayerId: UUID,
    val type: com.vvise.new_map.entity.TransitionType,
    val duration: Double,
    val easing: com.vvise.new_map.entity.EasingType,
    val config: Map<String, Any>?,
    @JsonProperty("created_at")
    val createdAt: Instant?,
    @JsonProperty("updated_at")
    val updatedAt: Instant?
) {
    companion object {
        fun from(transition: com.vvise.new_map.entity.SegmentTransition): LayerTransitionDto {
            return LayerTransitionDto(
                id = transition.id!!,
                fromLayerId = transition.fromLayer!!.id!!,
                toLayerId = transition.toLayer!!.id!!,
                type = transition.type,
                duration = transition.duration,
                easing = transition.easing,
                config = transition.config,
                createdAt = transition.createdAt,
                updatedAt = transition.updatedAt
            )
        }
    }
}

// Keyframe request DTOs
data class AddKeyframeRequest(
    @JsonProperty("time_offset")
    val timeOffset: Double,
    val property: com.vvise.new_map.entity.AnimatableProperty,
    val value: String,
    val easing: com.vvise.new_map.entity.EasingType? = null,
    @JsonProperty("easing_params")
    val easingParams: Map<String, Any>? = null
)

data class UpdateKeyframeRequest(
    @JsonProperty("time_offset")
    val timeOffset: Double? = null,
    val property: com.vvise.new_map.entity.AnimatableProperty? = null,
    val value: String? = null,
    val easing: com.vvise.new_map.entity.EasingType? = null,
    @JsonProperty("easing_params")
    val easingParams: Map<String, Any>? = null
)

// Transition request DTOs
data class SetTransitionRequest(
    val type: com.vvise.new_map.entity.TransitionType,
    val duration: Double? = null,
    val easing: com.vvise.new_map.entity.EasingType? = null,
    val config: Map<String, Any>? = null
)
