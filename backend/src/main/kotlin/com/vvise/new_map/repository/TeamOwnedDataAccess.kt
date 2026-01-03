package com.vvise.new_map.repository

import com.vvise.new_map.entity.Team
import com.vvise.new_map.entity.TeamOwnedEntity
import com.vvise.new_map.security.AuthenticatedUser
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.domain.Specification
import java.util.*

abstract class TeamOwnedDataAccess<T : TeamOwnedEntity>(
    private val teamOwnedRepository: TeamOwnedRepository<T>
) : BaseDataAccess<T>(teamOwnedRepository) {

    fun save(entity: T, team: Team): T {
        if (entity.id == null) {
            entity.team = team
        }
        return repository.save(entity)
    }

    fun saveAll(entities: List<T>, team: Team): List<T> {
        entities.forEach { entity ->
            if (entity.id == null) {
                entity.team = team
            }
        }
        return repository.saveAll(entities)
    }

    // Team-based queries
    fun findByTeam(team: Team): List<T> {
        return teamOwnedRepository.findByTeamAndDeletedFalse(team)
    }

    fun findByTeamId(teamId: UUID): List<T> {
        return teamOwnedRepository.findByTeamIdAndDeletedFalse(teamId)
    }

    fun findByIdAndTeam(id: UUID, team: Team): T? {
        return teamOwnedRepository.findByIdAndTeamAndDeletedFalse(id, team)
    }

    fun findByIdAndTeamId(id: UUID, teamId: UUID): T? {
        return teamOwnedRepository.findByIdAndTeamIdAndDeletedFalse(id, teamId)
    }

    fun findAllByTeam(team: Team, pageable: Pageable): Page<T> {
        val spec = Specification<T> { root, _, cb ->
            cb.and(
                cb.equal(root.get<Team>("team"), team),
                cb.equal(root.get<Boolean>("deleted"), false)
            )
        }
        return repository.findAll(spec, pageable)
    }

    fun findAllByTeamId(teamId: UUID, pageable: Pageable): Page<T> {
        val spec = Specification<T> { root, _, cb ->
            cb.and(
                cb.equal(root.get<Team>("team").get<UUID>("id"), teamId),
                cb.equal(root.get<Boolean>("deleted"), false)
            )
        }
        return repository.findAll(spec, pageable)
    }

    fun countByTeam(team: Team): Long {
        val spec = Specification<T> { root, _, cb ->
            cb.and(
                cb.equal(root.get<Team>("team"), team),
                cb.equal(root.get<Boolean>("deleted"), false)
            )
        }
        return repository.count(spec)
    }

    fun countByTeamId(teamId: UUID): Long {
        val spec = Specification<T> { root, _, cb ->
            cb.and(
                cb.equal(root.get<Team>("team").get<UUID>("id"), teamId),
                cb.equal(root.get<Boolean>("deleted"), false)
            )
        }
        return repository.count(spec)
    }

    // CreatedBy/UpdatedBy queries
    fun findByCreatedBy(userSub: String): List<T> {
        return teamOwnedRepository.findByCreatedByAndDeletedFalse(userSub)
    }

    fun findByCreatedBy(user: AuthenticatedUser): List<T> {
        return findByCreatedBy(user.sub)
    }

    fun findByUpdatedBy(userSub: String): List<T> {
        return teamOwnedRepository.findByUpdatedByAndDeletedFalse(userSub)
    }

    fun findByUpdatedBy(user: AuthenticatedUser): List<T> {
        return findByUpdatedBy(user.sub)
    }
}
