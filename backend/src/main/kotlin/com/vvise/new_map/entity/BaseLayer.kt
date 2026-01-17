package com.vvise.new_map.entity

import jakarta.persistence.*

@Entity
@Table(
    name = "base_layers",
    indexes = [
        Index(name = "idx_base_layers_composition", columnList = "composition_id")
    ]
)
class BaseLayer(
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "composition_id", nullable = false, unique = true)
    var composition: Composition? = null,

    @Column(name = "name", nullable = false)
    var name: String = "Camera"
) : BaseEntity()
