package com.vvise.new_map.controller

import com.vvise.new_map.dto.CreateProjectRequest
import com.vvise.new_map.dto.UpdateProjectRequest
import com.vvise.new_map.security.AuthenticatedUser
import com.vvise.new_map.security.CurrentUser
import com.vvise.new_map.service.ProjectService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/teams/{teamId}/projects")
class ProjectController(
    private val projectService: ProjectService
) {

    @PostMapping
    fun createProject(
        @PathVariable teamId: UUID,
        @RequestBody request: CreateProjectRequest,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        return try {
            val project = projectService.createProject(teamId, request, user)
            ResponseEntity.status(HttpStatus.CREATED).body(
                mapOf(
                    "success" to true,
                    "data" to project
                )
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
    fun getTeamProjects(
        @PathVariable teamId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        return try {
            val projects = projectService.getTeamProjects(teamId, user)
            ResponseEntity.ok(
                mapOf(
                    "success" to true,
                    "data" to projects
                )
            )
        } catch (e: IllegalAccessException) {
            ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                mapOf("success" to false, "error" to "Access denied")
            )
        }
    }

    @GetMapping("/{projectId}")
    fun getProject(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val project = projectService.getProject(teamId, projectId, user)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Project not found or access denied")
            )

        return ResponseEntity.ok(
            mapOf(
                "success" to true,
                "data" to project
            )
        )
    }

    @PatchMapping("/{projectId}")
    fun updateProject(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @RequestBody request: UpdateProjectRequest,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val project = projectService.updateProject(teamId, projectId, request, user)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Project not found or access denied")
            )

        return ResponseEntity.ok(
            mapOf(
                "success" to true,
                "data" to project
            )
        )
    }

    @PostMapping("/{projectId}/toggle-star")
    fun toggleStarred(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val project = projectService.toggleStarred(teamId, projectId, user)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Project not found or access denied")
            )

        return ResponseEntity.ok(
            mapOf(
                "success" to true,
                "data" to project
            )
        )
    }

    @DeleteMapping("/{projectId}")
    fun deleteProject(
        @PathVariable teamId: UUID,
        @PathVariable projectId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val deleted = projectService.deleteProject(teamId, projectId, user)
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Project not found or access denied")
            )
        }

        return ResponseEntity.ok(
            mapOf("success" to true)
        )
    }
}
