package com.vvise.new_map.controller

import com.vvise.new_map.dto.*
import com.vvise.new_map.security.AuthenticatedUser
import com.vvise.new_map.security.CurrentUser
import com.vvise.new_map.service.KeyframeService
import com.vvise.new_map.service.OverlayLayerService
import com.vvise.new_map.service.TransitionService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/teams/{teamId}/projects/{projectId}/composition/layers")
class OverlayLayerController(
    private val overlayLayerService: OverlayLayerService,
    private val keyframeService: KeyframeService,
    private val transitionService: TransitionService
) {

    @PostMapping
    fun addLayer(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @RequestBody request: CreateOverlayLayerRequest,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        return try {
            val layer = overlayLayerService.addLayer(teamId, projectId, request, user)
            ResponseEntity.status(HttpStatus.CREATED).body(
                mapOf("success" to true, "data" to layer)
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
    fun getLayers(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        return try {
            val layers = overlayLayerService.getLayers(teamId, projectId, user)
            ResponseEntity.ok(mapOf("success" to true, "data" to layers))
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

    @GetMapping("/{layerId}")
    fun getLayer(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @PathVariable layerId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val layer = overlayLayerService.getLayer(teamId, projectId, layerId, user)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Layer not found or access denied")
            )
        return ResponseEntity.ok(mapOf("success" to true, "data" to layer))
    }

    @PatchMapping("/{layerId}")
    fun updateLayer(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @PathVariable layerId: UUID,
        @RequestBody request: UpdateOverlayLayerRequest,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val layer = overlayLayerService.updateLayer(teamId, projectId, layerId, request, user)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Layer not found or access denied")
            )
        return ResponseEntity.ok(mapOf("success" to true, "data" to layer))
    }

    @DeleteMapping("/{layerId}")
    fun deleteLayer(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @PathVariable layerId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val deleted = overlayLayerService.deleteLayer(teamId, projectId, layerId, user)
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Layer not found or access denied")
            )
        }
        return ResponseEntity.ok(mapOf("success" to true))
    }

    @PostMapping("/reorder")
    fun reorderLayers(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @RequestBody request: ReorderLayersRequest,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        return try {
            val layers = overlayLayerService.reorderLayers(teamId, projectId, request, user)
            ResponseEntity.ok(mapOf("success" to true, "data" to layers))
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

    // Keyframe endpoints
    @PostMapping("/{layerId}/keyframes")
    fun addKeyframe(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @PathVariable layerId: UUID,
        @RequestBody request: AddKeyframeRequest,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        return try {
            val keyframe = keyframeService.addKeyframe(teamId, projectId, layerId, request, user)
            ResponseEntity.status(HttpStatus.CREATED).body(
                mapOf("success" to true, "data" to keyframe)
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

    @PatchMapping("/{layerId}/keyframes/{keyframeId}")
    fun updateKeyframe(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @PathVariable layerId: UUID,
        @PathVariable keyframeId: UUID,
        @RequestBody request: UpdateKeyframeRequest,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val keyframe = keyframeService.updateKeyframe(teamId, projectId, layerId, keyframeId, request, user)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Keyframe not found or access denied")
            )
        return ResponseEntity.ok(mapOf("success" to true, "data" to keyframe))
    }

    @DeleteMapping("/{layerId}/keyframes/{keyframeId}")
    fun deleteKeyframe(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @PathVariable layerId: UUID,
        @PathVariable keyframeId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val deleted = keyframeService.deleteKeyframe(teamId, projectId, layerId, keyframeId, user)
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Keyframe not found or access denied")
            )
        }
        return ResponseEntity.ok(mapOf("success" to true))
    }

    // Transition endpoints
    @PutMapping("/{layerId}/transition-to/{toLayerId}")
    fun setTransition(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @PathVariable layerId: UUID,
        @PathVariable toLayerId: UUID,
        @RequestBody request: SetTransitionRequest,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        return try {
            val transition = transitionService.setTransition(teamId, projectId, layerId, toLayerId, request, user)
            ResponseEntity.ok(mapOf("success" to true, "data" to transition))
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

    @DeleteMapping("/{layerId}/transition")
    fun removeTransition(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @PathVariable layerId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val deleted = transitionService.removeTransition(teamId, projectId, layerId, user)
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Transition not found or access denied")
            )
        }
        return ResponseEntity.ok(mapOf("success" to true))
    }
}
