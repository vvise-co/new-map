package com.vvise.new_map.entity

import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes

@Entity
@Table(
    name = "layer_transitions",
    indexes = [
        Index(name = "idx_layer_transitions_from", columnList = "from_layer_id"),
        Index(name = "idx_layer_transitions_to", columnList = "to_layer_id")
    ],
    uniqueConstraints = [
        UniqueConstraint(
            name = "uq_layer_transition",
            columnNames = ["from_layer_id", "to_layer_id"]
        )
    ]
)
class SegmentTransition(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_layer_id", nullable = false)
    var fromLayer: OverlayLayer? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_layer_id", nullable = false)
    var toLayer: OverlayLayer? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    var type: TransitionType,

    @Column(name = "duration", nullable = false)
    var duration: Double = 0.5,

    @Enumerated(EnumType.STRING)
    @Column(name = "easing", nullable = false, length = 20)
    var easing: EasingType = EasingType.EASE_IN_OUT,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "config", columnDefinition = "jsonb")
    var config: Map<String, Any>? = null
) : BaseEntity()
