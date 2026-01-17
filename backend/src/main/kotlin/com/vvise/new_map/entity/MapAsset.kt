package com.vvise.new_map.entity

import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import org.locationtech.jts.geom.Geometry

@Entity
@Table(
    name = "map_assets",
    indexes = [
        Index(name = "idx_map_assets_team", columnList = "team_id"),
        Index(name = "idx_map_assets_category", columnList = "category_id"),
        Index(name = "idx_map_assets_type", columnList = "type")
    ]
)
class MapAsset(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false, updatable = false)
    var team: Team? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    var category: AssetCategory? = null,

    @Column(name = "name", nullable = false)
    var name: String,

    @Column(name = "description", columnDefinition = "TEXT")
    var description: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    var type: MapAssetType,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "style_data", nullable = false, columnDefinition = "jsonb")
    var styleData: Map<String, Any> = emptyMap(),

    @Column(name = "default_geometry", columnDefinition = "geometry")
    var defaultGeometry: Geometry? = null,

    @Column(name = "preview_url", length = 500)
    var previewUrl: String? = null,

    @Column(name = "tags", length = 500)
    var tags: String? = null
) : BaseEntity()
