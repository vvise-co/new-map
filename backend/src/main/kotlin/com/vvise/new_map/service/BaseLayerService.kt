package com.vvise.new_map.service

import com.vvise.new_map.dto.*
import com.vvise.new_map.entity.BaseSegment
import com.vvise.new_map.repository.*
import com.vvise.new_map.security.AuthenticatedUser
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class BaseLayerService(
    private val compositionRepository: CompositionRepository,
    private val baseLayerRepository: BaseLayerRepository,
    private val baseSegmentRepository: BaseSegmentRepository,
    private val projectRepository: ProjectRepository,
    private val teamService: TeamService
) {

    fun getBaseLayer(teamId: UUID, projectId: UUID, user: AuthenticatedUser): BaseLayerDto? {
        if (!teamService.isTeamMember(teamId, user)) {
            return null
        }

        projectRepository.findByIdAndTeamIdAndDeletedFalse(projectId, teamId)
            ?: return null

        val composition = compositionRepository.findByProjectIdAndDeletedFalse(projectId)
            ?: return null

        val baseLayer = baseLayerRepository.findByCompositionIdAndDeletedFalse(composition.id!!)
            ?: return null

        val segments = baseSegmentRepository.findByBaseLayerIdAndDeletedFalseOrderByOrder(baseLayer.id!!)
            .map { BaseSegmentDto.from(it) }

        return BaseLayerDto.from(baseLayer, segments)
    }

    fun getBaseSegments(teamId: UUID, projectId: UUID, user: AuthenticatedUser): List<BaseSegmentDto> {
        if (!teamService.isTeamMember(teamId, user)) {
            throw IllegalAccessException("Not a member of this team")
        }

        projectRepository.findByIdAndTeamIdAndDeletedFalse(projectId, teamId)
            ?: throw IllegalArgumentException("Project not found")

        val composition = compositionRepository.findByProjectIdAndDeletedFalse(projectId)
            ?: throw IllegalArgumentException("Composition not found")

        val baseLayer = baseLayerRepository.findByCompositionIdAndDeletedFalse(composition.id!!)
            ?: throw IllegalArgumentException("Base layer not found")

        return baseSegmentRepository.findByBaseLayerIdAndDeletedFalseOrderByOrder(baseLayer.id!!)
            .map { BaseSegmentDto.from(it) }
    }

    @Transactional
    fun addBaseSegment(
        teamId: UUID,
        projectId: UUID,
        request: CreateBaseSegmentRequest,
        user: AuthenticatedUser
    ): BaseSegmentDto {
        if (!teamService.isTeamMember(teamId, user)) {
            throw IllegalAccessException("Not a member of this team")
        }

        projectRepository.findByIdAndTeamIdAndDeletedFalse(projectId, teamId)
            ?: throw IllegalArgumentException("Project not found")

        val composition = compositionRepository.findByProjectIdAndDeletedFalse(projectId)
            ?: throw IllegalArgumentException("Composition not found")

        val baseLayer = baseLayerRepository.findByCompositionIdAndDeletedFalse(composition.id!!)
            ?: throw IllegalArgumentException("Base layer not found")

        val maxOrder = baseSegmentRepository.findByBaseLayerIdAndDeletedFalseOrderByOrder(baseLayer.id!!)
            .maxOfOrNull { it.order } ?: -1

        val segment = BaseSegment(
            baseLayer = baseLayer,
            name = request.name,
            order = maxOrder + 1,
            startTime = request.startTime,
            endTime = request.endTime,
            cameraPosition = request.cameraPosition,
            transitionToNext = request.transitionToNext
        )

        val saved = baseSegmentRepository.save(segment)
        return BaseSegmentDto.from(saved)
    }

    @Transactional
    fun updateBaseSegment(
        teamId: UUID,
        projectId: UUID,
        segmentId: UUID,
        request: UpdateBaseSegmentRequest,
        user: AuthenticatedUser
    ): BaseSegmentDto? {
        if (!teamService.isTeamMember(teamId, user)) {
            return null
        }

        projectRepository.findByIdAndTeamIdAndDeletedFalse(projectId, teamId)
            ?: return null

        val composition = compositionRepository.findByProjectIdAndDeletedFalse(projectId)
            ?: return null

        val baseLayer = baseLayerRepository.findByCompositionIdAndDeletedFalse(composition.id!!)
            ?: return null

        val segment = baseSegmentRepository.findByIdAndBaseLayerIdAndDeletedFalse(segmentId, baseLayer.id!!)
            ?: return null

        request.name?.let { segment.name = it }
        request.startTime?.let { segment.startTime = it }
        request.endTime?.let { segment.endTime = it }
        request.cameraPosition?.let { segment.cameraPosition = it }
        request.transitionToNext?.let { segment.transitionToNext = it }

        val saved = baseSegmentRepository.save(segment)
        return BaseSegmentDto.from(saved)
    }

    @Transactional
    fun deleteBaseSegment(
        teamId: UUID,
        projectId: UUID,
        segmentId: UUID,
        user: AuthenticatedUser
    ): Boolean {
        if (!teamService.isTeamMember(teamId, user)) {
            return false
        }

        projectRepository.findByIdAndTeamIdAndDeletedFalse(projectId, teamId)
            ?: return false

        val composition = compositionRepository.findByProjectIdAndDeletedFalse(projectId)
            ?: return false

        val baseLayer = baseLayerRepository.findByCompositionIdAndDeletedFalse(composition.id!!)
            ?: return false

        val segment = baseSegmentRepository.findByIdAndBaseLayerIdAndDeletedFalse(segmentId, baseLayer.id!!)
            ?: return false

        segment.softDelete()
        baseSegmentRepository.save(segment)
        return true
    }

    @Transactional
    fun reorderBaseSegments(
        teamId: UUID,
        projectId: UUID,
        request: ReorderBaseSegmentsRequest,
        user: AuthenticatedUser
    ): List<BaseSegmentDto> {
        if (!teamService.isTeamMember(teamId, user)) {
            throw IllegalAccessException("Not a member of this team")
        }

        projectRepository.findByIdAndTeamIdAndDeletedFalse(projectId, teamId)
            ?: throw IllegalArgumentException("Project not found")

        val composition = compositionRepository.findByProjectIdAndDeletedFalse(projectId)
            ?: throw IllegalArgumentException("Composition not found")

        val baseLayer = baseLayerRepository.findByCompositionIdAndDeletedFalse(composition.id!!)
            ?: throw IllegalArgumentException("Base layer not found")

        request.segmentIds.forEachIndexed { index, segmentId ->
            val segment = baseSegmentRepository.findByIdAndBaseLayerIdAndDeletedFalse(segmentId, baseLayer.id!!)
            segment?.let {
                it.order = index
                baseSegmentRepository.save(it)
            }
        }

        return getBaseSegments(teamId, projectId, user)
    }
}
