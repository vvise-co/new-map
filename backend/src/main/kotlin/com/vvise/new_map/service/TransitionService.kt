package com.vvise.new_map.service

import com.vvise.new_map.dto.*
import com.vvise.new_map.entity.EasingType
import com.vvise.new_map.entity.SegmentTransition
import com.vvise.new_map.repository.*
import com.vvise.new_map.security.AuthenticatedUser
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class TransitionService(
    private val compositionRepository: CompositionRepository,
    private val overlayLayerRepository: OverlayLayerRepository,
    private val segmentTransitionRepository: SegmentTransitionRepository,
    private val projectRepository: ProjectRepository,
    private val teamService: TeamService
) {

    @Transactional
    fun setTransition(
        teamId: UUID,
        projectId: UUID,
        fromLayerId: UUID,
        toLayerId: UUID,
        request: SetTransitionRequest,
        user: AuthenticatedUser
    ): LayerTransitionDto {
        if (!teamService.isTeamMember(teamId, user)) {
            throw IllegalAccessException("Not a member of this team")
        }

        projectRepository.findByIdAndTeamIdAndDeletedFalse(projectId, teamId)
            ?: throw IllegalArgumentException("Project not found")

        val composition = compositionRepository.findByProjectIdAndDeletedFalse(projectId)
            ?: throw IllegalArgumentException("Composition not found")

        val fromLayer = overlayLayerRepository.findByIdAndCompositionIdAndDeletedFalse(fromLayerId, composition.id!!)
            ?: throw IllegalArgumentException("From layer not found")

        val toLayer = overlayLayerRepository.findByIdAndCompositionIdAndDeletedFalse(toLayerId, composition.id!!)
            ?: throw IllegalArgumentException("To layer not found")

        // Check if transition already exists
        val existingTransition = segmentTransitionRepository.findByFromLayerIdAndToLayerIdAndDeletedFalse(
            fromLayerId, toLayerId
        )

        val transition = if (existingTransition != null) {
            existingTransition.type = request.type
            request.duration?.let { existingTransition.duration = it }
            request.easing?.let { existingTransition.easing = it }
            request.config?.let { existingTransition.config = it }
            existingTransition
        } else {
            SegmentTransition(
                fromLayer = fromLayer,
                toLayer = toLayer,
                type = request.type,
                duration = request.duration ?: 0.5,
                easing = request.easing ?: EasingType.EASE_IN_OUT,
                config = request.config
            )
        }

        val saved = segmentTransitionRepository.save(transition)
        return LayerTransitionDto.from(saved)
    }

    @Transactional
    fun removeTransition(
        teamId: UUID,
        projectId: UUID,
        layerId: UUID,
        user: AuthenticatedUser
    ): Boolean {
        if (!teamService.isTeamMember(teamId, user)) {
            return false
        }

        projectRepository.findByIdAndTeamIdAndDeletedFalse(projectId, teamId)
            ?: return false

        val composition = compositionRepository.findByProjectIdAndDeletedFalse(projectId)
            ?: return false

        val layer = overlayLayerRepository.findByIdAndCompositionIdAndDeletedFalse(layerId, composition.id!!)
            ?: return false

        val transition = segmentTransitionRepository.findByFromLayerIdAndDeletedFalse(layer.id!!)
            ?: return false

        transition.softDelete()
        segmentTransitionRepository.save(transition)
        return true
    }
}
