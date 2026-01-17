package com.vvise.new_map.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.vvise.new_map.entity.AssetCategory
import java.time.Instant
import java.util.UUID

data class CreateCategoryRequest(
    val name: String,
    @JsonProperty("parent_category_id")
    val parentCategoryId: UUID? = null,
    val order: Int? = null,
    val color: String? = null
)

data class UpdateCategoryRequest(
    val name: String? = null,
    @JsonProperty("parent_category_id")
    val parentCategoryId: UUID? = null,
    val order: Int? = null,
    val color: String? = null
)

data class ReorderCategoriesRequest(
    @JsonProperty("category_ids")
    val categoryIds: List<UUID>
)

data class AssetCategoryDto(
    val id: UUID,
    @JsonProperty("team_id")
    val teamId: UUID,
    @JsonProperty("parent_category_id")
    val parentCategoryId: UUID?,
    val name: String,
    val order: Int,
    val color: String?,
    @JsonProperty("created_at")
    val createdAt: Instant?,
    @JsonProperty("updated_at")
    val updatedAt: Instant?
) {
    companion object {
        fun from(category: AssetCategory): AssetCategoryDto {
            return AssetCategoryDto(
                id = category.id!!,
                teamId = category.team!!.id!!,
                parentCategoryId = category.parentCategory?.id,
                name = category.name,
                order = category.order,
                color = category.color,
                createdAt = category.createdAt,
                updatedAt = category.updatedAt
            )
        }
    }
}

data class AssetCategoryTreeDto(
    val id: UUID,
    val name: String,
    val order: Int,
    val color: String?,
    val children: List<AssetCategoryTreeDto>
) {
    companion object {
        fun from(category: AssetCategory, children: List<AssetCategoryTreeDto>): AssetCategoryTreeDto {
            return AssetCategoryTreeDto(
                id = category.id!!,
                name = category.name,
                order = category.order,
                color = category.color,
                children = children
            )
        }
    }
}
