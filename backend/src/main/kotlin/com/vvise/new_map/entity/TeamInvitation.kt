package com.vvise.new_map.entity

import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(
    name = "team_invitations",
    indexes = [
        Index(name = "idx_team_invitations_token", columnList = "token", unique = true),
        Index(name = "idx_team_invitations_team", columnList = "team_id"),
        Index(name = "idx_team_invitations_created_by", columnList = "created_by_id")
    ]
)
class TeamInvitation(
    @Column(name = "token", nullable = false, unique = true, updatable = false)
    val token: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    val team: Team,

    @Column(name = "expires_at", nullable = false)
    val expiresAt: Instant,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id", nullable = false)
    val createdBy: User,

    @Column(name = "used_at")
    var usedAt: Instant? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "used_by_id")
    var usedBy: User? = null
) : BaseEntity() {

    fun isExpired(): Boolean = Instant.now().isAfter(expiresAt)

    fun isUsed(): Boolean = usedAt != null

    fun isValid(): Boolean = !isExpired() && !isUsed() && !deleted

    fun markAsUsed(user: User) {
        this.usedAt = Instant.now()
        this.usedBy = user
    }
}
