package com.vvise.new_map.entity

import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.util.UUID

@Entity
@Table(
    name = "settings",
    uniqueConstraints = [
        UniqueConstraint(
            name = "uk_settings_scope_scope_id",
            columnNames = ["scope", "scope_id"]
        )
    ],
    indexes = [
        Index(name = "idx_settings_scope", columnList = "scope"),
        Index(name = "idx_settings_scope_id", columnList = "scope_id")
    ]
)
class Settings(
    @Enumerated(EnumType.STRING)
    @Column(name = "scope", nullable = false)
    var scope: SettingsScope,

    @Column(name = "scope_id", nullable = false)
    var scopeId: UUID,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "data", columnDefinition = "jsonb", nullable = false)
    var data: MutableMap<String, Any?> = mutableMapOf()
) : BaseEntity()
