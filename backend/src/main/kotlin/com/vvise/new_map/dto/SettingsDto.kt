package com.vvise.new_map.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.vvise.new_map.entity.Settings
import com.vvise.new_map.entity.SettingsScope
import java.time.Instant
import java.util.UUID

data class SettingsDto(
    val id: UUID,
    val scope: SettingsScope,
    @JsonProperty("scope_id")
    val scopeId: UUID,
    val data: Map<String, Any?>,
    @JsonProperty("created_at")
    val createdAt: Instant?,
    @JsonProperty("updated_at")
    val updatedAt: Instant?
) {
    companion object {
        fun from(settings: Settings): SettingsDto {
            return SettingsDto(
                id = settings.id!!,
                scope = settings.scope,
                scopeId = settings.scopeId,
                data = settings.data,
                createdAt = settings.createdAt,
                updatedAt = settings.updatedAt
            )
        }
    }
}

data class CreateSettingsRequest(
    val data: Map<String, Any?> = emptyMap()
)

data class UpdateSettingsRequest(
    val data: Map<String, Any?>
)

data class PatchSettingsRequest(
    val data: Map<String, Any?>
)

data class RemoveSettingsKeyRequest(
    val key: String
)
