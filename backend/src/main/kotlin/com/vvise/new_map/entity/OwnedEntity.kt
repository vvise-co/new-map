package com.vvise.new_map.entity

import jakarta.persistence.Column
import jakarta.persistence.MappedSuperclass
import java.time.Instant
import java.util.UUID

@MappedSuperclass
abstract class OwnedEntity(
    id: UUID? = null,
    createdAt: Instant? = null,
    updatedAt: Instant? = null,
    deleted: Boolean = false,
    deletedAt: Instant? = null,

    @Column(name = "owner", nullable = false, updatable = false)
    open var owner: String? = null,

    @Column(name = "created_by", updatable = false)
    open var createdBy: String? = null,

    @Column(name = "updated_by")
    open var updatedBy: String? = null
) : BaseEntity(id, createdAt, updatedAt, deleted, deletedAt)
