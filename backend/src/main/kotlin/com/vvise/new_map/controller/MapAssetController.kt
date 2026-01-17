package com.vvise.new_map.controller

import com.vvise.new_map.dto.CreateMapAssetRequest
import com.vvise.new_map.dto.UpdateMapAssetRequest
import com.vvise.new_map.entity.MapAssetType
import com.vvise.new_map.security.AuthenticatedUser
import com.vvise.new_map.security.CurrentUser
import com.vvise.new_map.service.MapAssetService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/teams/{teamId}/assets")
class MapAssetController(
    private val mapAssetService: MapAssetService
) {

    @PostMapping
    fun createAsset(
        @PathVariable teamId: UUID,
        @RequestBody request: CreateMapAssetRequest,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        return try {
            val asset = mapAssetService.createAsset(teamId, request, user)
            ResponseEntity.status(HttpStatus.CREATED).body(
                mapOf("success" to true, "data" to asset)
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
    fun getTeamAssets(
        @PathVariable teamId: UUID,
        @RequestParam(required = false) type: MapAssetType?,
        @RequestParam(required = false) categoryId: UUID?,
        @RequestParam(required = false) tag: String?,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        return try {
            val response = mapAssetService.getTeamAssets(teamId, user, type, categoryId, tag)
            ResponseEntity.ok(mapOf("success" to true, "data" to response))
        } catch (e: IllegalAccessException) {
            ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                mapOf("success" to false, "error" to "Access denied")
            )
        }
    }

    @GetMapping("/{assetId}")
    fun getAsset(
        @PathVariable teamId: UUID,
        @PathVariable assetId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val asset = mapAssetService.getAsset(teamId, assetId, user)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Asset not found or access denied")
            )
        return ResponseEntity.ok(mapOf("success" to true, "data" to asset))
    }

    @PatchMapping("/{assetId}")
    fun updateAsset(
        @PathVariable teamId: UUID,
        @PathVariable assetId: UUID,
        @RequestBody request: UpdateMapAssetRequest,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val asset = mapAssetService.updateAsset(teamId, assetId, request, user)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Asset not found or access denied")
            )
        return ResponseEntity.ok(mapOf("success" to true, "data" to asset))
    }

    @DeleteMapping("/{assetId}")
    fun deleteAsset(
        @PathVariable teamId: UUID,
        @PathVariable assetId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        return try {
            val deleted = mapAssetService.deleteAsset(teamId, assetId, user)
            if (!deleted) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    mapOf("success" to false, "error" to "Asset not found or access denied")
                )
            }
            ResponseEntity.ok(mapOf("success" to true))
        } catch (e: IllegalStateException) {
            ResponseEntity.status(HttpStatus.CONFLICT).body(
                mapOf("success" to false, "error" to (e.message ?: "Asset is in use"))
            )
        }
    }

    @PostMapping("/{assetId}/duplicate")
    fun duplicateAsset(
        @PathVariable teamId: UUID,
        @PathVariable assetId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val asset = mapAssetService.duplicateAsset(teamId, assetId, user)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Asset not found or access denied")
            )
        return ResponseEntity.status(HttpStatus.CREATED).body(
            mapOf("success" to true, "data" to asset)
        )
    }
}
