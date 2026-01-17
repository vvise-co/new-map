package com.vvise.new_map.service

import com.vvise.new_map.dto.*
import com.vvise.new_map.entity.EasingType
import com.vvise.new_map.entity.SegmentKeyframe
import com.vvise.new_map.repository.*
import com.vvise.new_map.security.AuthenticatedUser
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class KeyframeService(
    private val compositionRepository: CompositionRepository,
    private val overlayLayerRepository: OverlayLayerRepository,
    private val segmentKeyframeRepository: SegmentKeyframeRepository,
    private val projectRepository: ProjectRepository,
    private val teamService: TeamService
) {

    @Transactional
    fun addKeyframe(
        teamId: UUID,
        projectId: UUID,
        layerId: UUID,
        request: AddKeyframeRequest,
        user: AuthenticatedUser
    ): LayerKeyframeDto {
        if (!teamService.isTeamMember(teamId, user)) {
            throw IllegalAccessException("Not a member of this team")
        }

        projectRepository.findByIdAndTeamIdAndDeletedFalse(projectId, teamId)
            ?: throw IllegalArgumentException("Project not found")

        val composition = compositionRepository.findByProjectIdAndDeletedFalse(projectId)
            ?: throw IllegalArgumentException("Composition not found")

        val layer = overlayLayerRepository.findByIdAndCompositionIdAndDeletedFalse(layerId, composition.id!!)
            ?: throw IllegalArgumentException("Layer not found")

        val keyframe = SegmentKeyframe(
            layer = layer,
            timeOffset = request.timeOffset,
            property = request.property,
            value = request.value,
            easing = request.easing ?: EasingType.LINEAR,
            easingParams = request.easingParams
        )

        val saved = segmentKeyframeRepository.save(keyframe)
        return LayerKeyframeDto.from(saved)
    }

    @Transactional
    fun updateKeyframe(
        teamId: UUID,
        projectId: UUID,
        layerId: UUID,
        keyframeId: UUID,
        request: UpdateKeyframeRequest,
        user: AuthenticatedUser
    ): LayerKeyframeDto? {
        if (!teamService.isTeamMember(teamId, user)) {
            return null
        }

        projectRepository.findByIdAndTeamIdAndDeletedFalse(projectId, teamId)
            ?: return null

        val composition = compositionRepository.findByProjectIdAndDeletedFalse(projectId)
            ?: return null

        val layer = overlayLayerRepository.findByIdAndCompositionIdAndDeletedFalse(layerId, composition.id!!)
            ?: return null

        val keyframe = segmentKeyframeRepository.findByIdAndLayerIdAndDeletedFalse(keyframeId, layer.id!!)
            ?: return null

        request.timeOffset?.let { keyframe.timeOffset = it }
        request.property?.let { keyframe.property = it }
        request.value?.let { keyframe.value = it }
        request.easing?.let { keyframe.easing = it }
        request.easingParams?.let { keyframe.easingParams = it }

        val saved = segmentKeyframeRepository.save(keyframe)
        return LayerKeyframeDto.from(saved)
    }

    @Transactional
    fun deleteKeyframe(
        teamId: UUID,
        projectId: UUID,
        layerId: UUID,
        keyframeId: UUID,
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

        val keyframe = segmentKeyframeRepository.findByIdAndLayerIdAndDeletedFalse(keyframeId, layer.id!!)
            ?: return false

        keyframe.softDelete()
        segmentKeyframeRepository.save(keyframe)
        return true
    }
}
