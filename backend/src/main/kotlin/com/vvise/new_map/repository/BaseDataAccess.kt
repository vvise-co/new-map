package com.vvise.new_map.repository

import com.vvise.new_map.entity.BaseEntity
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.domain.Specification
import java.util.UUID

abstract class BaseDataAccess<T : BaseEntity>(
    protected val repository: BaseRepository<T>
) {

    fun findById(id: UUID): T? {
        return repository.findByIdAndDeletedFalse(id)
    }

    fun findAll(): List<T> {
        return repository.findAllByDeletedFalse()
    }

    fun findAll(pageable: Pageable): Page<T> {
        val spec = Specification<T> { root, _, cb ->
            cb.equal(root.get<Boolean>("deleted"), false)
        }
        return repository.findAll(spec, pageable)
    }

    fun findAll(specification: Specification<T>): List<T> {
        val notDeletedSpec = Specification<T> { root, _, cb ->
            cb.equal(root.get<Boolean>("deleted"), false)
        }
        return repository.findAll(specification.and(notDeletedSpec))
    }

    fun findAll(specification: Specification<T>, pageable: Pageable): Page<T> {
        val notDeletedSpec = Specification<T> { root, _, cb ->
            cb.equal(root.get<Boolean>("deleted"), false)
        }
        return repository.findAll(specification.and(notDeletedSpec), pageable)
    }

    fun save(entity: T): T {
        return repository.save(entity)
    }

    fun saveAll(entities: List<T>): List<T> {
        return repository.saveAll(entities)
    }

    fun delete(id: UUID): Boolean {
        val entity = repository.findByIdAndDeletedFalse(id) ?: return false
        entity.softDelete()
        repository.save(entity)
        return true
    }

    fun delete(entity: T): Boolean {
        entity.softDelete()
        repository.save(entity)
        return true
    }

    fun hardDelete(id: UUID) {
        repository.deleteById(id)
    }

    fun hardDelete(entity: T) {
        repository.delete(entity)
    }

    fun restore(id: UUID): T? {
        val entity = repository.findById(id).orElse(null) ?: return null
        entity.restore()
        return repository.save(entity)
    }

    fun exists(id: UUID): Boolean {
        return repository.findByIdAndDeletedFalse(id) != null
    }

    fun count(): Long {
        val spec = Specification<T> { root, _, cb ->
            cb.equal(root.get<Boolean>("deleted"), false)
        }
        return repository.count(spec)
    }

    fun count(specification: Specification<T>): Long {
        val notDeletedSpec = Specification<T> { root, _, cb ->
            cb.equal(root.get<Boolean>("deleted"), false)
        }
        return repository.count(specification.and(notDeletedSpec))
    }
}
