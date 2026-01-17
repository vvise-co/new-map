package com.vvise.new_map.entity

import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes

@Entity
@Table(
    name = "compositions",
    indexes = [
        Index(name = "idx_compositions_project", columnList = "project_id")
    ]
)
class Composition(
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false, unique = true)
    var project: Project? = null,

    @Column(name = "name", nullable = false)
    var name: String,

    @Column(name = "duration", nullable = false)
    var duration: Double = 60.0,

    @Column(name = "frame_rate", nullable = false)
    var frameRate: Int = 30,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "map_config", nullable = false, columnDefinition = "jsonb")
    var mapConfig: Map<String, Any> = emptyMap()
) : BaseEntity()
