package com.vvise.new_map.entity

import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import org.locationtech.jts.geom.Geometry

@Entity
@Table(
    name = "overlay_layers",
    indexes = [
        Index(name = "idx_overlay_layers_composition", columnList = "composition_id"),
        Index(name = "idx_overlay_layers_order", columnList = "composition_id, \"order\""),
        Index(name = "idx_overlay_layers_asset", columnList = "map_asset_id")
    ]
)
class OverlayLayer(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "composition_id", nullable = false)
    var composition: Composition? = null,

    // Reference to team asset template (optional)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "map_asset_id")
    var mapAsset: MapAsset? = null,

    @Column(name = "name", nullable = false)
    var name: String,

    @Column(name = "\"order\"", nullable = false)
    var order: Int = 0,

    @Column(name = "start_time", nullable = false)
    var startTime: Double = 0.0,

    @Column(name = "end_time", nullable = false)
    var endTime: Double,

    @Column(name = "visible", nullable = false)
    var visible: Boolean = true,

    @Column(name = "locked", nullable = false)
    var locked: Boolean = false,

    @Column(name = "opacity", nullable = false)
    var opacity: Double = 1.0,

    // Geometry data (Point, Line, Polygon) - the actual map element
    @Column(name = "geometry", columnDefinition = "geometry", nullable = false)
    var geometry: Geometry,

    // Style overrides for this specific instance (overrides asset defaults)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "style_overrides", columnDefinition = "jsonb")
    var styleOverrides: Map<String, Any>? = null
) : BaseEntity()
