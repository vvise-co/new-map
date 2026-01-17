package com.vvise.new_map.service

import com.vvise.new_map.dto.*
import com.vvise.new_map.entity.AssetCategory
import com.vvise.new_map.repository.AssetCategoryRepository
import com.vvise.new_map.repository.MapAssetRepository
import com.vvise.new_map.repository.TeamRepository
import com.vvise.new_map.security.AuthenticatedUser
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class AssetCategoryService(
    private val assetCategoryRepository: AssetCategoryRepository,
    private val mapAssetRepository: MapAssetRepository,
    private val teamRepository: TeamRepository,
    private val teamService: TeamService
) {

    @Transactional
    fun createCategory(
        teamId: UUID,
        request: CreateCategoryRequest,
        user: AuthenticatedUser
    ): AssetCategoryDto {
        if (!teamService.isTeamMember(teamId, user)) {
            throw IllegalAccessException("Not a member of this team")
        }

        val team = teamRepository.findByIdAndDeletedFalse(teamId)
            ?: throw IllegalArgumentException("Team not found")

        val parentCategory = request.parentCategoryId?.let {
            assetCategoryRepository.findByIdAndTeamIdAndDeletedFalse(it, teamId)
                ?: throw IllegalArgumentException("Parent category not found")
        }

        val maxOrder = assetCategoryRepository.findByTeamIdAndDeletedFalseOrderByOrder(teamId)
            .maxOfOrNull { it.order } ?: -1

        val category = AssetCategory(
            team = team,
            parentCategory = parentCategory,
            name = request.name,
            order = request.order ?: (maxOrder + 1),
            color = request.color
        )

        val saved = assetCategoryRepository.save(category)
        return AssetCategoryDto.from(saved)
    }

    fun getCategories(teamId: UUID, user: AuthenticatedUser): List<AssetCategoryDto> {
        if (!teamService.isTeamMember(teamId, user)) {
            throw IllegalAccessException("Not a member of this team")
        }

        return assetCategoryRepository.findByTeamIdAndDeletedFalseOrderByOrder(teamId)
            .map { AssetCategoryDto.from(it) }
    }

    fun getCategoryTree(teamId: UUID, user: AuthenticatedUser): List<AssetCategoryTreeDto> {
        if (!teamService.isTeamMember(teamId, user)) {
            throw IllegalAccessException("Not a member of this team")
        }

        val allCategories = assetCategoryRepository.findByTeamIdAndDeletedFalseOrderByOrder(teamId)
        val categoryMap = allCategories.groupBy { it.parentCategory?.id }

        fun buildTree(parentId: UUID?): List<AssetCategoryTreeDto> {
            return categoryMap[parentId]?.map { category ->
                AssetCategoryTreeDto.from(category, buildTree(category.id))
            } ?: emptyList()
        }

        return buildTree(null)
    }

    fun getCategory(teamId: UUID, categoryId: UUID, user: AuthenticatedUser): AssetCategoryDto? {
        if (!teamService.isTeamMember(teamId, user)) {
            return null
        }

        val category = assetCategoryRepository.findByIdAndTeamIdAndDeletedFalse(categoryId, teamId)
            ?: return null

        return AssetCategoryDto.from(category)
    }

    @Transactional
    fun updateCategory(
        teamId: UUID,
        categoryId: UUID,
        request: UpdateCategoryRequest,
        user: AuthenticatedUser
    ): AssetCategoryDto? {
        if (!teamService.isTeamMember(teamId, user)) {
            return null
        }

        val category = assetCategoryRepository.findByIdAndTeamIdAndDeletedFalse(categoryId, teamId)
            ?: return null

        request.name?.let { category.name = it }
        request.order?.let { category.order = it }
        request.color?.let { category.color = it }

        if (request.parentCategoryId != null) {
            val parentCategory = assetCategoryRepository.findByIdAndTeamIdAndDeletedFalse(request.parentCategoryId, teamId)
            category.parentCategory = parentCategory
        }

        val saved = assetCategoryRepository.save(category)
        return AssetCategoryDto.from(saved)
    }

    @Transactional
    fun deleteCategory(teamId: UUID, categoryId: UUID, user: AuthenticatedUser): Boolean {
        if (!teamService.isTeamAdmin(teamId, user)) {
            return false
        }

        val category = assetCategoryRepository.findByIdAndTeamIdAndDeletedFalse(categoryId, teamId)
            ?: return false

        // Move assets in this category to uncategorized
        mapAssetRepository.findByTeamIdAndCategoryIdAndDeletedFalse(teamId, categoryId).forEach { asset ->
            asset.category = null
            mapAssetRepository.save(asset)
        }

        // Move child categories to parent
        assetCategoryRepository.findByTeamIdAndParentCategoryIdAndDeletedFalse(teamId, categoryId).forEach { child ->
            child.parentCategory = category.parentCategory
            assetCategoryRepository.save(child)
        }

        category.softDelete()
        assetCategoryRepository.save(category)
        return true
    }

    @Transactional
    fun reorderCategories(
        teamId: UUID,
        request: ReorderCategoriesRequest,
        user: AuthenticatedUser
    ): List<AssetCategoryDto> {
        if (!teamService.isTeamMember(teamId, user)) {
            throw IllegalAccessException("Not a member of this team")
        }

        request.categoryIds.forEachIndexed { index, categoryId ->
            val category = assetCategoryRepository.findByIdAndTeamIdAndDeletedFalse(categoryId, teamId)
            category?.let {
                it.order = index
                assetCategoryRepository.save(it)
            }
        }

        return getCategories(teamId, user)
    }
}
