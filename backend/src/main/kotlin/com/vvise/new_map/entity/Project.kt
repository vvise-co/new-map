package com.vvise.new_map.entity

import jakarta.persistence.*

@Entity
@Table(
    name = "team_projects",
    indexes = [
        Index(name = "idx_team_projects_team", columnList = "team_id"),
        Index(name = "idx_team_projects_starred", columnList = "team_id, starred"),
        Index(name = "idx_team_projects_recent", columnList = "team_id, updated_at")
    ]
)
class Project(
    team: Team? = null,

    @Column(name = "name", nullable = false)
    var name: String,

    @Column(name = "description")
    var description: String? = null,

    @Column(name = "starred", nullable = false)
    var starred: Boolean = false
) : TeamOwnedEntity(team)