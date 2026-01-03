package com.vvise.new_map.entity

import jakarta.persistence.*

@Entity
@Table(
    name = "team_projects",
    indexes = [Index(name = "idx_team_projects_team", columnList = "team_id")],
    uniqueConstraints = [UniqueConstraint(
        name = "uk_team_projects_team", columnNames = ["team_id"]
    )]
)
class Project(
    team: Team? = null,

    @Column(name = "name", nullable = false)
    var name: String,
    @Column(name = "description")
    var description: String? = null
) : TeamOwnedEntity(
    team
) {}