package com.vvise.new_map.repository

import com.vvise.new_map.entity.Team
import org.springframework.stereotype.Repository

@Repository
interface TeamRepository : BaseRepository<Team> {

    fun findByNameAndDeletedFalse(name: String): Team?
}
