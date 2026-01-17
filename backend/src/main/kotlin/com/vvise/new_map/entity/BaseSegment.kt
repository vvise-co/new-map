package com.vvise.new_map.entity

import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes

@Entity
@Table(
    name = "base_segments",
    indexes = [
        Index(name = "idx_base_segments_layer", columnList = "base_layer_id"),
        Index(name = "idx_base_segments_order", columnList = "base_layer_id, \"order\"")
    ]
)
class BaseSegment(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "base_layer_id", nullable = false)
    var baseLayer: BaseLayer? = null,

    @Column(name = "name", nullable = false)
    var name: String,

    @Column(name = "\"order\"", nullable = false)
    var order: Int = 0,

    @Column(name = "start_time", nullable = false)
    var startTime: Double,

    @Column(name = "end_time", nullable = false)
    var endTime: Double,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "camera_position", nullable = false, columnDefinition = "jsonb")
    var cameraPosition: Map<String, Any>,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "transition_to_next", columnDefinition = "jsonb")
    var transitionToNext: Map<String, Any>? = null
) : BaseEntity()
