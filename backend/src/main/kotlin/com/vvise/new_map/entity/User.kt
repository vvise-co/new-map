package com.vvise.new_map.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Index
import jakarta.persistence.Table

@Entity
@Table(
    name = "users",
    indexes = [
        Index(name = "idx_users_sub", columnList = "sub", unique = true),
        Index(name = "idx_users_email", columnList = "email")
    ]
)
class User(
    @Column(name = "sub", nullable = false, unique = true, updatable = false)
    val sub: String,

    @Column(name = "email", nullable = false)
    var email: String,

    @Column(name = "name", nullable = false)
    var name: String
) : BaseEntity()
