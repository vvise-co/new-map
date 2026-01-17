package com.vvise.new_map.controller

import com.vvise.new_map.dto.CreateBaseSegmentRequest
import com.vvise.new_map.dto.ReorderBaseSegmentsRequest
import com.vvise.new_map.dto.UpdateBaseSegmentRequest
import com.vvise.new_map.security.AuthenticatedUser
import com.vvise.new_map.security.CurrentUser
import com.vvise.new_map.service.BaseLayerService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/teams/{teamId}/projects/{projectId}/composition/base-layer")
class BaseLayerController(
    private val baseLayerService: BaseLayerService
) {

    @GetMapping
    fun getBaseLayer(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val baseLayer = baseLayerService.getBaseLayer(teamId, projectId, user)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Base layer not found or access denied")
            )
        return ResponseEntity.ok(mapOf("success" to true, "data" to baseLayer))
    }

    @GetMapping("/segments")
    fun getBaseSegments(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        return try {
            val segments = baseLayerService.getBaseSegments(teamId, projectId, user)
            ResponseEntity.ok(mapOf("success" to true, "data" to segments))
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

    @PostMapping("/segments")
    fun addBaseSegment(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @RequestBody request: CreateBaseSegmentRequest,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        return try {
            val segment = baseLayerService.addBaseSegment(teamId, projectId, request, user)
            ResponseEntity.status(HttpStatus.CREATED).body(
                mapOf("success" to true, "data" to segment)
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

    @PatchMapping("/segments/{segmentId}")
    fun updateBaseSegment(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @PathVariable segmentId: UUID,
        @RequestBody request: UpdateBaseSegmentRequest,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val segment = baseLayerService.updateBaseSegment(teamId, projectId, segmentId, request, user)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Segment not found or access denied")
            )
        return ResponseEntity.ok(mapOf("success" to true, "data" to segment))
    }

    @DeleteMapping("/segments/{segmentId}")
    fun deleteBaseSegment(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @PathVariable segmentId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val deleted = baseLayerService.deleteBaseSegment(teamId, projectId, segmentId, user)
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Segment not found or access denied")
            )
        }
        return ResponseEntity.ok(mapOf("success" to true))
    }

    @PostMapping("/segments/reorder")
    fun reorderBaseSegments(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @RequestBody request: ReorderBaseSegmentsRequest,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        return try {
            val segments = baseLayerService.reorderBaseSegments(teamId, projectId, request, user)
            ResponseEntity.ok(mapOf("success" to true, "data" to segments))
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
}
