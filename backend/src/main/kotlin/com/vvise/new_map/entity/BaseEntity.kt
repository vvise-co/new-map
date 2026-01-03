package com.vvise.new_map.entity

import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.Instant
import java.util.UUID

@MappedSuperclass
@EntityListeners(AuditingEntityListener::class)
abstract class BaseEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    open val id: UUID? = null,

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    open var createdAt: Instant? = null,

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    open var updatedAt: Instant? = null,

    @Column(name = "deleted", nullable = false)
    open var deleted: Boolean = false,

    @Column(name = "deleted_at")
    open var deletedAt: Instant? = null
) {
    fun softDelete() {
        this.deleted = true
        this.deletedAt = Instant.now()
    }

    fun restore() {
        this.deleted = false
        this.deletedAt = null
    }
}
