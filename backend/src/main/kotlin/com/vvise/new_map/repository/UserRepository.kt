package com.vvise.new_map.repository

import com.vvise.new_map.entity.User
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : BaseRepository<User> {

    fun findBySubAndDeletedFalse(sub: String): User?

    fun findByEmailAndDeletedFalse(email: String): User?
}
