package com.vvise.new_map.entity

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@MappedSuperclass
abstract class TeamOwnedEntity(
    id: UUID? = null,
    createdAt: Instant? = null,
    updatedAt: Instant? = null,
    deleted: Boolean = false,
    deletedAt: Instant? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false, updatable = false)
    open var team: Team? = null,

    @Column(name = "created_by", updatable = false)
    open var createdBy: String? = null,

    @Column(name = "updated_by")
    open var updatedBy: String? = null
) : BaseEntity(id, createdAt, updatedAt, deleted, deletedAt)
