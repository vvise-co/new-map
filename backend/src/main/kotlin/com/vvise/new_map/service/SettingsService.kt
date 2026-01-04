package com.vvise.new_map.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.vvise.new_map.dto.*
import com.vvise.new_map.entity.Settings
import com.vvise.new_map.entity.SettingsScope
import com.vvise.new_map.repository.SettingsRepository
import com.vvise.new_map.security.AuthenticatedUser
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class SettingsService(
    private val settingsRepository: SettingsRepository,
    private val teamService: TeamService,
    private val objectMapper: ObjectMapper
) {

    fun getSettings(scope: SettingsScope, scopeId: UUID): SettingsDto? {
        return settingsRepository.findByScopeAndScopeIdAndDeletedFalse(scope, scopeId)
            ?.let { SettingsDto.from(it) }
    }

    fun getOrCreateSettings(scope: SettingsScope, scopeId: UUID): SettingsDto {
        val existing = settingsRepository.findByScopeAndScopeIdAndDeletedFalse(scope, scopeId)
        if (existing != null) {
            return SettingsDto.from(existing)
        }

        val settings = Settings(
            scope = scope,
            scopeId = scopeId,
            data = mutableMapOf()
        )
        return SettingsDto.from(settingsRepository.save(settings))
    }

    @Transactional
    fun createSettings(scope: SettingsScope, scopeId: UUID, request: CreateSettingsRequest): SettingsDto {
        val existing = settingsRepository.findByScopeAndScopeIdAndDeletedFalse(scope, scopeId)
        if (existing != null) {
            throw IllegalStateException("Settings already exist for this scope")
        }

        val settings = Settings(
            scope = scope,
            scopeId = scopeId,
            data = request.data.toMutableMap()
        )
        return SettingsDto.from(settingsRepository.save(settings))
    }

    @Transactional
    fun updateSettings(scope: SettingsScope, scopeId: UUID, request: UpdateSettingsRequest): SettingsDto {
        val settings = settingsRepository.findByScopeAndScopeIdAndDeletedFalse(scope, scopeId)
            ?: throw NoSuchElementException("Settings not found")

        settings.data = request.data.toMutableMap()
        return SettingsDto.from(settingsRepository.save(settings))
    }

    @Transactional
    fun patchSettings(scope: SettingsScope, scopeId: UUID, request: PatchSettingsRequest): SettingsDto {
        val exists = settingsRepository.existsByScopeAndScopeIdAndDeletedFalse(scope, scopeId)
        if (!exists) {
            val settings = Settings(
                scope = scope,
                scopeId = scopeId,
                data = request.data.toMutableMap()
            )
            return SettingsDto.from(settingsRepository.save(settings))
        }

        val jsonPatch = objectMapper.writeValueAsString(request.data)
        settingsRepository.patchSettings(scope.name, scopeId, jsonPatch)

        return settingsRepository.findByScopeAndScopeIdAndDeletedFalse(scope, scopeId)
            ?.let { SettingsDto.from(it) }
            ?: throw NoSuchElementException("Settings not found after patch")
    }

    @Transactional
    fun removeKey(scope: SettingsScope, scopeId: UUID, key: String): SettingsDto {
        val exists = settingsRepository.existsByScopeAndScopeIdAndDeletedFalse(scope, scopeId)
        if (!exists) {
            throw NoSuchElementException("Settings not found")
        }

        settingsRepository.removeSettingsKey(scope.name, scopeId, key)

        return settingsRepository.findByScopeAndScopeIdAndDeletedFalse(scope, scopeId)
            ?.let { SettingsDto.from(it) }
            ?: throw NoSuchElementException("Settings not found after remove")
    }

    @Transactional
    fun deleteSettings(scope: SettingsScope, scopeId: UUID) {
        val settings = settingsRepository.findByScopeAndScopeIdAndDeletedFalse(scope, scopeId)
            ?: throw NoSuchElementException("Settings not found")

        settings.softDelete()
        settingsRepository.save(settings)
    }

    // Authorization helpers
    fun canAccessTeamSettings(teamId: UUID, user: AuthenticatedUser): Boolean {
        return teamService.isTeamMember(teamId, user)
    }

    fun canModifyTeamSettings(teamId: UUID, user: AuthenticatedUser): Boolean {
        return teamService.isTeamAdmin(teamId, user)
    }

    fun getUserId(user: AuthenticatedUser): UUID {
        return teamService.getOrCreateUser(user).id!!
    }
}
