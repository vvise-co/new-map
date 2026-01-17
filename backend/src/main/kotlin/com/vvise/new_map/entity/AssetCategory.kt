package com.vvise.new_map.entity

import jakarta.persistence.*

@Entity
@Table(
    name = "asset_categories",
    indexes = [
        Index(name = "idx_asset_categories_team", columnList = "team_id"),
        Index(name = "idx_asset_categories_parent", columnList = "parent_category_id")
    ]
)
class AssetCategory(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false, updatable = false)
    var team: Team? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_category_id")
    var parentCategory: AssetCategory? = null,

    @Column(name = "name", nullable = false)
    var name: String,

    @Column(name = "\"order\"", nullable = false)
    var order: Int = 0,

    @Column(name = "color", length = 7)
    var color: String? = null
) : BaseEntity()
