package com.vvise.new_map.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.vvise.new_map.entity.MapAsset
import com.vvise.new_map.entity.MapAssetType
import java.time.Instant
import java.util.UUID

data class CreateMapAssetRequest(
    val name: String,
    val description: String? = null,
    val type: MapAssetType,
    @JsonProperty("category_id")
    val categoryId: UUID? = null,
    @JsonProperty("style_data")
    val styleData: Map<String, Any> = emptyMap(),
    @JsonProperty("default_geometry")
    val defaultGeometry: GeoJsonGeometry? = null,
    @JsonProperty("preview_url")
    val previewUrl: String? = null,
    val tags: String? = null
)

data class UpdateMapAssetRequest(
    val name: String? = null,
    val description: String? = null,
    @JsonProperty("category_id")
    val categoryId: UUID? = null,
    @JsonProperty("style_data")
    val styleData: Map<String, Any>? = null,
    @JsonProperty("default_geometry")
    val defaultGeometry: GeoJsonGeometry? = null,
    @JsonProperty("preview_url")
    val previewUrl: String? = null,
    val tags: String? = null
)

data class MapAssetDto(
    val id: UUID,
    @JsonProperty("team_id")
    val teamId: UUID,
    @JsonProperty("category_id")
    val categoryId: UUID?,
    val name: String,
    val description: String?,
    val type: MapAssetType,
    @JsonProperty("style_data")
    val styleData: Map<String, Any>,
    @JsonProperty("default_geometry")
    val defaultGeometry: GeoJsonGeometry?,
    @JsonProperty("preview_url")
    val previewUrl: String?,
    val tags: String?,
    @JsonProperty("created_at")
    val createdAt: Instant?,
    @JsonProperty("updated_at")
    val updatedAt: Instant?
) {
    companion object {
        fun from(asset: MapAsset): MapAssetDto {
            return MapAssetDto(
                id = asset.id!!,
                teamId = asset.team!!.id!!,
                categoryId = asset.category?.id,
                name = asset.name,
                description = asset.description,
                type = asset.type,
                styleData = asset.styleData,
                defaultGeometry = asset.defaultGeometry?.let { GeoJsonGeometry.from(it) },
                previewUrl = asset.previewUrl,
                tags = asset.tags,
                createdAt = asset.createdAt,
                updatedAt = asset.updatedAt
            )
        }
    }
}

data class MapAssetListResponse(
    val assets: List<MapAssetDto>,
    val total: Int
)
