package com.vvise.new_map.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.vvise.new_map.entity.Project
import java.time.Instant
import java.util.UUID

data class CreateProjectRequest(
    val name: String,
    val description: String? = null
)

data class UpdateProjectRequest(
    val name: String? = null,
    val description: String? = null,
    val starred: Boolean? = null
)

data class ProjectDto(
    val id: UUID,
    val name: String,
    val description: String?,
    val starred: Boolean,
    @JsonProperty("team_id")
    val teamId: UUID,
    @JsonProperty("created_at")
    val createdAt: Instant?,
    @JsonProperty("updated_at")
    val updatedAt: Instant?
) {
    companion object {
        fun from(project: Project): ProjectDto {
            return ProjectDto(
                id = project.id!!,
                name = project.name,
                description = project.description,
                starred = project.starred,
                teamId = project.team!!.id!!,
                createdAt = project.createdAt,
                updatedAt = project.updatedAt
            )
        }
    }
}

data class ProjectListResponse(
    val recent: List<ProjectDto>,
    val starred: List<ProjectDto>
)
