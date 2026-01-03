package com.vvise.new_map.entity

import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(
    name = "team_members",
    indexes = [
        Index(name = "idx_team_members_team", columnList = "team_id"),
        Index(name = "idx_team_members_user", columnList = "user_id")
    ],
    uniqueConstraints = [
        UniqueConstraint(
            name = "uk_team_members_team_user",
            columnNames = ["team_id", "user_id"]
        )
    ]
)
class TeamMember(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    val team: Team,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    var role: TeamRole
) : BaseEntity() {

    fun isOwner(): Boolean = role == TeamRole.OWNER

    fun isAdmin(): Boolean = role == TeamRole.ADMIN || role == TeamRole.OWNER

    fun canEdit(): Boolean = role != TeamRole.VIEWER

    fun canView(): Boolean = true
}
