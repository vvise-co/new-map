package com.vvise.new_map.controller

import com.vvise.new_map.dto.*
import com.vvise.new_map.entity.SettingsScope
import com.vvise.new_map.security.AuthenticatedUser
import com.vvise.new_map.security.CurrentUser
import com.vvise.new_map.service.SettingsService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api")
class SettingsController(
    private val settingsService: SettingsService
) {

    // ==================== User Settings ====================

    @GetMapping("/settings/user")
    fun getUserSettings(@CurrentUser user: AuthenticatedUser): ResponseEntity<Map<String, Any?>> {
        val userId = settingsService.getUserId(user)
        val settings = settingsService.getOrCreateSettings(SettingsScope.USER, userId)
        return ResponseEntity.ok(mapOf("success" to true, "data" to settings))
    }

    @PatchMapping("/settings/user")
    fun patchUserSettings(
        @CurrentUser user: AuthenticatedUser,
        @RequestBody request: PatchSettingsRequest
    ): ResponseEntity<Map<String, Any?>> {
        val userId = settingsService.getUserId(user)
        val settings = settingsService.patchSettings(SettingsScope.USER, userId, request)
        return ResponseEntity.ok(mapOf("success" to true, "data" to settings))
    }

    @DeleteMapping("/settings/user/{key}")
    fun removeUserSettingsKey(
        @CurrentUser user: AuthenticatedUser,
        @PathVariable key: String
    ): ResponseEntity<Map<String, Any?>> {
        val userId = settingsService.getUserId(user)
        val settings = settingsService.removeKey(SettingsScope.USER, userId, key)
        return ResponseEntity.ok(mapOf("success" to true, "data" to settings))
    }

    // ==================== Team Settings ====================

    @GetMapping("/teams/{teamId}/settings")
    fun getTeamSettings(
        @PathVariable teamId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any?>> {
        if (!settingsService.canAccessTeamSettings(teamId, user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(mapOf("success" to false, "error" to "Access denied"))
        }

        val settings = settingsService.getOrCreateSettings(SettingsScope.TEAM, teamId)
        return ResponseEntity.ok(mapOf("success" to true, "data" to settings))
    }

    @PatchMapping("/teams/{teamId}/settings")
    fun patchTeamSettings(
        @PathVariable teamId: UUID,
        @CurrentUser user: AuthenticatedUser,
        @RequestBody request: PatchSettingsRequest
    ): ResponseEntity<Map<String, Any?>> {
        if (!settingsService.canModifyTeamSettings(teamId, user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(mapOf("success" to false, "error" to "Only admins can modify team settings"))
        }

        val settings = settingsService.patchSettings(SettingsScope.TEAM, teamId, request)
        return ResponseEntity.ok(mapOf("success" to true, "data" to settings))
    }

    @DeleteMapping("/teams/{teamId}/settings/{key}")
    fun removeTeamSettingsKey(
        @PathVariable teamId: UUID,
        @PathVariable key: String,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any?>> {
        if (!settingsService.canModifyTeamSettings(teamId, user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(mapOf("success" to false, "error" to "Only admins can modify team settings"))
        }

        val settings = settingsService.removeKey(SettingsScope.TEAM, teamId, key)
        return ResponseEntity.ok(mapOf("success" to true, "data" to settings))
    }

    // ==================== Project Settings ====================

    @GetMapping("/teams/{teamId}/projects/{projectId}/settings")
    fun getProjectSettings(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any?>> {
        if (!settingsService.canAccessTeamSettings(teamId, user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(mapOf("success" to false, "error" to "Access denied"))
        }

        val settings = settingsService.getOrCreateSettings(SettingsScope.PROJECT, projectId)
        return ResponseEntity.ok(mapOf("success" to true, "data" to settings))
    }

    @PatchMapping("/teams/{teamId}/projects/{projectId}/settings")
    fun patchProjectSettings(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @CurrentUser user: AuthenticatedUser,
        @RequestBody request: PatchSettingsRequest
    ): ResponseEntity<Map<String, Any?>> {
        if (!settingsService.canModifyTeamSettings(teamId, user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(mapOf("success" to false, "error" to "Only admins can modify project settings"))
        }

        val settings = settingsService.patchSettings(SettingsScope.PROJECT, projectId, request)
        return ResponseEntity.ok(mapOf("success" to true, "data" to settings))
    }

    @DeleteMapping("/teams/{teamId}/projects/{projectId}/settings/{key}")
    fun removeProjectSettingsKey(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @PathVariable key: String,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any?>> {
        if (!settingsService.canModifyTeamSettings(teamId, user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(mapOf("success" to false, "error" to "Only admins can modify project settings"))
        }

        val settings = settingsService.removeKey(SettingsScope.PROJECT, projectId, key)
        return ResponseEntity.ok(mapOf("success" to true, "data" to settings))
    }
}
