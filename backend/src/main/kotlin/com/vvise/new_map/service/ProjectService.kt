package com.vvise.new_map.service

import com.vvise.new_map.dto.*
import com.vvise.new_map.entity.Project
import com.vvise.new_map.repository.ProjectRepository
import com.vvise.new_map.repository.TeamRepository
import com.vvise.new_map.security.AuthenticatedUser
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class ProjectService(
    private val projectRepository: ProjectRepository,
    private val teamRepository: TeamRepository,
    private val teamService: TeamService
) {

    @Transactional
    fun createProject(
        teamId: UUID,
        request: CreateProjectRequest,
        user: AuthenticatedUser
    ): ProjectDto {
        if (!teamService.isTeamMember(teamId, user)) {
            throw IllegalAccessException("Not a member of this team")
        }

        val team = teamRepository.findByIdAndDeletedFalse(teamId)
            ?: throw IllegalArgumentException("Team not found")

        val project = Project(
            team = team,
            name = request.name,
            description = request.description
        )

        val saved = projectRepository.save(project)
        return ProjectDto.from(saved)
    }

    fun getProject(
        teamId: UUID,
        projectId: UUID,
        user: AuthenticatedUser
    ): ProjectDto? {
        if (!teamService.isTeamMember(teamId, user)) {
            return null
        }

        val project = projectRepository.findByIdAndTeamIdAndDeletedFalse(projectId, teamId)
            ?: return null

        return ProjectDto.from(project)
    }

    fun getTeamProjects(
        teamId: UUID,
        user: AuthenticatedUser
    ): ProjectListResponse {
        if (!teamService.isTeamMember(teamId, user)) {
            throw IllegalAccessException("Not a member of this team")
        }

        val recent = projectRepository.findRecentByTeamId(teamId, PageRequest.of(0, 10))
            .map { ProjectDto.from(it) }

        val starred = projectRepository.findStarredByTeamId(teamId)
            .map { ProjectDto.from(it) }

        return ProjectListResponse(recent = recent, starred = starred)
    }

    @Transactional
    fun updateProject(
        teamId: UUID,
        projectId: UUID,
        request: UpdateProjectRequest,
        user: AuthenticatedUser
    ): ProjectDto? {
        if (!teamService.isTeamMember(teamId, user)) {
            return null
        }

        val project = projectRepository.findByIdAndTeamIdAndDeletedFalse(projectId, teamId)
            ?: return null

        request.name?.let { project.name = it }
        request.description?.let { project.description = it }
        request.starred?.let { project.starred = it }

        val saved = projectRepository.save(project)
        return ProjectDto.from(saved)
    }

    @Transactional
    fun toggleStarred(
        teamId: UUID,
        projectId: UUID,
        user: AuthenticatedUser
    ): ProjectDto? {
        if (!teamService.isTeamMember(teamId, user)) {
            return null
        }

        val project = projectRepository.findByIdAndTeamIdAndDeletedFalse(projectId, teamId)
            ?: return null

        project.starred = !project.starred
        val saved = projectRepository.save(project)
        return ProjectDto.from(saved)
    }

    @Transactional
    fun deleteProject(
        teamId: UUID,
        projectId: UUID,
        user: AuthenticatedUser
    ): Boolean {
        if (!teamService.isTeamAdmin(teamId, user)) {
            return false
        }

        val project = projectRepository.findByIdAndTeamIdAndDeletedFalse(projectId, teamId)
            ?: return false

        project.softDelete()
        projectRepository.save(project)
        return true
    }
}
