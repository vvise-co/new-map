package com.vvise.new_map.controller

import com.vvise.new_map.dto.CreateTeamRequest
import com.vvise.new_map.security.AuthenticatedUser
import com.vvise.new_map.security.CurrentUser
import com.vvise.new_map.service.TeamService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/teams")
class TeamController(
    private val teamService: TeamService
) {

    @PostMapping
    fun createTeam(
        @RequestBody request: CreateTeamRequest,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val response = teamService.createTeam(request, user)
        return ResponseEntity.status(HttpStatus.CREATED).body(
            mapOf(
                "success" to true,
                "data" to response
            )
        )
    }

    @GetMapping
    fun getUserTeams(@CurrentUser user: AuthenticatedUser): Map<String, Any> {
        val teams = teamService.getUserTeams(user)
        return mapOf(
            "success" to true,
            "data" to teams
        )
    }

    @GetMapping("/{teamId}")
    fun getTeam(
        @PathVariable teamId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any>> {
        val team = teamService.getTeamById(teamId, user)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Team not found or access denied")
            )

        return ResponseEntity.ok(
            mapOf(
                "success" to true,
                "data" to team
            )
        )
    }

    @GetMapping("/has-team")
    fun hasTeam(@CurrentUser user: AuthenticatedUser): Map<String, Any> {
        val hasTeam = teamService.hasTeam(user)
        return mapOf(
            "success" to true,
            "has_team" to hasTeam
        )
    }
}
