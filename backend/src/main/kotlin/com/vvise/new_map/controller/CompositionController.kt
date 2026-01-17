package com.vvise.new_map.controller

import com.vvise.new_map.dto.CreateCompositionRequest
import com.vvise.new_map.dto.UpdateCompositionRequest
import com.vvise.new_map.security.AuthenticatedUser
import com.vvise.new_map.security.CurrentUser
import com.vvise.new_map.service.CompositionService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/teams/{teamId}/projects/{projectId}/composition")
class CompositionController(
    private val compositionService: CompositionService
) {

    @PostMapping
    fun createComposition(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @RequestBody(required = false) request: CreateCompositionRequest?,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        return try {
            val composition = compositionService.createComposition(teamId, projectId, request, user)
            ResponseEntity.status(HttpStatus.CREATED).body(
                mapOf("success" to true, "data" to composition)
            )
        } catch (e: IllegalAccessException) {
            ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                mapOf("success" to false, "error" to "Access denied")
            )
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to (e.message ?: "Not found"))
            )
        } catch (e: IllegalStateException) {
            ResponseEntity.status(HttpStatus.CONFLICT).body(
                mapOf("success" to false, "error" to (e.message ?: "Composition already exists"))
            )
        }
    }

    @GetMapping
    fun getComposition(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val composition = compositionService.getComposition(teamId, projectId, user)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Composition not found or access denied")
            )
        return ResponseEntity.ok(mapOf("success" to true, "data" to composition))
    }

    @PatchMapping
    fun updateComposition(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @RequestBody request: UpdateCompositionRequest,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val composition = compositionService.updateComposition(teamId, projectId, request, user)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Composition not found or access denied")
            )
        return ResponseEntity.ok(mapOf("success" to true, "data" to composition))
    }

    @DeleteMapping
    fun deleteComposition(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val deleted = compositionService.deleteComposition(teamId, projectId, user)
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Composition not found or access denied")
            )
        }
        return ResponseEntity.ok(mapOf("success" to true))
    }
}
