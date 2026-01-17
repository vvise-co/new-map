package com.vvise.new_map.entity

import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes

@Entity
@Table(
    name = "layer_keyframes",
    indexes = [
        Index(name = "idx_layer_keyframes_layer", columnList = "layer_id"),
        Index(name = "idx_layer_keyframes_time", columnList = "layer_id, time_offset")
    ]
)
class SegmentKeyframe(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "layer_id", nullable = false)
    var layer: OverlayLayer? = null,

    @Column(name = "time_offset", nullable = false)
    var timeOffset: Double,

    @Enumerated(EnumType.STRING)
    @Column(name = "property", nullable = false, length = 50)
    var property: AnimatableProperty,

    @Column(name = "value", nullable = false)
    var value: String,

    @Enumerated(EnumType.STRING)
    @Column(name = "easing", nullable = false, length = 20)
    var easing: EasingType = EasingType.LINEAR,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "easing_params", columnDefinition = "jsonb")
    var easingParams: Map<String, Any>? = null
) : BaseEntity()
