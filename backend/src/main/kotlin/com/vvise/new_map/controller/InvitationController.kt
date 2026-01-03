package com.vvise.new_map.controller

import com.vvise.new_map.dto.CreateInvitationRequest
import com.vvise.new_map.security.AuthenticatedUser
import com.vvise.new_map.security.CurrentUser
import com.vvise.new_map.service.InvitationService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api")
class InvitationController(
    private val invitationService: InvitationService
) {

    @PostMapping("/invitations")
    fun createInvitation(
        @RequestBody request: CreateInvitationRequest,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any?>> {
        return try {
            val invitation = invitationService.createInvitation(request, user)
            ResponseEntity.status(HttpStatus.CREATED).body(
                mapOf(
                    "success" to true,
                    "data" to invitation
                )
            )
        } catch (e: IllegalAccessException) {
            ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                mapOf("success" to false, "error" to e.message)
            )
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                mapOf("success" to false, "error" to e.message)
            )
        }
    }

    @GetMapping("/teams/{teamId}/invitations")
    fun getTeamInvitations(
        @PathVariable teamId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any?>> {
        return try {
            val invitations = invitationService.getTeamInvitations(teamId, user)
            ResponseEntity.ok(
                mapOf(
                    "success" to true,
                    "data" to invitations
                )
            )
        } catch (e: IllegalAccessException) {
            ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                mapOf("success" to false, "error" to e.message)
            )
        }
    }

    @GetMapping("/teams/{teamId}/invitations/active")
    fun getActiveInvitations(
        @PathVariable teamId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any?>> {
        return try {
            val invitations = invitationService.getActiveInvitations(teamId, user)
            ResponseEntity.ok(
                mapOf(
                    "success" to true,
                    "data" to invitations
                )
            )
        } catch (e: IllegalAccessException) {
            ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                mapOf("success" to false, "error" to e.message)
            )
        }
    }

    @GetMapping("/public/invitations/{token}")
    fun getInvitationInfo(@PathVariable token: String): ResponseEntity<Map<String, Any?>> {
        val info = invitationService.getInvitationInfo(token)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to "Invitation not found")
            )

        return ResponseEntity.ok(
            mapOf(
                "success" to true,
                "data" to info
            )
        )
    }

    @PostMapping("/invitations/{token}/accept")
    fun acceptInvitation(
        @PathVariable token: String,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any?>> {
        return try {
            val response = invitationService.acceptInvitation(token, user)
            ResponseEntity.ok(
                mapOf(
                    "success" to true,
                    "data" to response
                )
            )
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to e.message)
            )
        } catch (e: IllegalStateException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                mapOf("success" to false, "error" to e.message)
            )
        }
    }

    @DeleteMapping("/invitations/{invitationId}")
    fun revokeInvitation(
        @PathVariable invitationId: UUID,
        @CurrentUser user: AuthenticatedUser
    ): ResponseEntity<Map<String, Any?>> {
        return try {
            invitationService.revokeInvitation(invitationId, user)
            ResponseEntity.ok(
                mapOf("success" to true)
            )
        } catch (e: IllegalAccessException) {
            ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                mapOf("success" to false, "error" to e.message)
            )
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                mapOf("success" to false, "error" to e.message)
            )
        }
    }
}
