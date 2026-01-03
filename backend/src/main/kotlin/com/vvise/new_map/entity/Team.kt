package com.vvise.new_map.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Index
import jakarta.persistence.Table

@Entity
@Table(
    name = "teams",
    indexes = [
        Index(name = "idx_teams_name", columnList = "name")
    ]
)
class Team(
    @Column(name = "name", nullable = false)
    var name: String,

    @Column(name = "description")
    var description: String? = null
) : BaseEntity()
