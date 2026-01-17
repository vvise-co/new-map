package com.vvise.new_map.controller

import com.vvise.new_map.dto.CreateCategoryRequest
import com.vvise.new_map.dto.ReorderCategoriesRequest
import com.vvise.new_map.dto.UpdateCategoryRequest
import com.vvise.new_map.security.AuthenticatedUser
import com.vvise.new_map.security.CurrentUser
import com.vvise.new_map.service.AssetCategoryService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/teams/{teamId}/asset-categories")
class AssetCategoryController(
    private val assetCategoryService: AssetCategoryService
) {

    @PostMapping
    fun createCategory(
        @PathVariable teamId: UUID,
        @RequestBody request: CreateCategoryRequest,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        return try {
            val category = assetCategoryService.createCategory(teamId, request, user)
            ResponseEntity.status(HttpStatus.CREATED).body(
                mapOf("success" to true, "data" to category)
            )
        } catch (e: IllegalAccessException) {
            ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                mapOf("success" to false, "error" to "Access denied")
            )
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to (e.message ?: "Not found"))
            )
        }
    }

    @GetMapping
    fun getCategories(
        @PathVariable teamId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        return try {
            val categories = assetCategoryService.getCategories(teamId, user)
            ResponseEntity.ok(mapOf("success" to true, "data" to categories))
        } catch (e: IllegalAccessException) {
            ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                mapOf("success" to false, "error" to "Access denied")
            )
        }
    }

    @GetMapping("/tree")
    fun getCategoryTree(
        @PathVariable teamId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        return try {
            val tree = assetCategoryService.getCategoryTree(teamId, user)
            ResponseEntity.ok(mapOf("success" to true, "data" to tree))
        } catch (e: IllegalAccessException) {
            ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                mapOf("success" to false, "error" to "Access denied")
            )
        }
    }

    @GetMapping("/{categoryId}")
    fun getCategory(
        @PathVariable teamId: UUID,
        @PathVariable categoryId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val category = assetCategoryService.getCategory(teamId, categoryId, user)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Category not found or access denied")
            )
        return ResponseEntity.ok(mapOf("success" to true, "data" to category))
    }

    @PatchMapping("/{categoryId}")
    fun updateCategory(
        @PathVariable teamId: UUID,
        @PathVariable categoryId: UUID,
        @RequestBody request: UpdateCategoryRequest,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val category = assetCategoryService.updateCategory(teamId, categoryId, request, user)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Category not found or access denied")
            )
        return ResponseEntity.ok(mapOf("success" to true, "data" to category))
    }

    @DeleteMapping("/{categoryId}")
    fun deleteCategory(
        @PathVariable teamId: UUID,
        @PathVariable categoryId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val deleted = assetCategoryService.deleteCategory(teamId, categoryId, user)
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Category not found or access denied")
            )
        }
        return ResponseEntity.ok(mapOf("success" to true))
    }

    @PostMapping("/reorder")
    fun reorderCategories(
        @PathVariable teamId: UUID,
        @RequestBody request: ReorderCategoriesRequest,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        return try {
            val categories = assetCategoryService.reorderCategories(teamId, request, user)
            ResponseEntity.ok(mapOf("success" to true, "data" to categories))
        } catch (e: IllegalAccessException) {
            ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                mapOf("success" to false, "error" to "Access denied")
            )
        }
    }
}
