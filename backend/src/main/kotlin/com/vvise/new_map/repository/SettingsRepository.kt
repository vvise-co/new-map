package com.vvise.new_map.repository

import com.vvise.new_map.entity.Settings
import com.vvise.new_map.entity.SettingsScope
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface SettingsRepository : BaseRepository<Settings> {

    fun findByScopeAndScopeIdAndDeletedFalse(scope: SettingsScope, scopeId: UUID): Settings?

    fun findAllByScopeAndDeletedFalse(scope: SettingsScope): List<Settings>

    fun existsByScopeAndScopeIdAndDeletedFalse(scope: SettingsScope, scopeId: UUID): Boolean

    @Modifying
    @Query(
        value = """
            UPDATE settings
            SET data = data || CAST(:jsonPatch AS jsonb),
                updated_at = NOW()
            WHERE scope = :scope
            AND scope_id = :scopeId
            AND deleted = false
        """,
        nativeQuery = true
    )
    fun patchSettings(
        @Param("scope") scope: String,
        @Param("scopeId") scopeId: UUID,
        @Param("jsonPatch") jsonPatch: String
    ): Int

    @Modifying
    @Query(
        value = """
            UPDATE settings
            SET data = data - :key,
                updated_at = NOW()
            WHERE scope = :scope
            AND scope_id = :scopeId
            AND deleted = false
        """,
        nativeQuery = true
    )
    fun removeSettingsKey(
        @Param("scope") scope: String,
        @Param("scopeId") scopeId: UUID,
        @Param("key") key: String
    ): Int
}
