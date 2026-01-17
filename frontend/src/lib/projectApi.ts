import { api } from './api';
import {
  Project,
  ProjectListResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  ApiResponse,
} from './types';

export async function createProject(
  teamId: string,
  data: CreateProjectRequest
): Promise<Project> {
  const response = await api.post<ApiResponse<Project>>(
    `/api/teams/${teamId}/projects`,
    data
  );
  return response.data;
}

export async function getTeamProjects(
  teamId: string
): Promise<ProjectListResponse> {
  const response = await api.get<ApiResponse<ProjectListResponse>>(
    `/api/teams/${teamId}/projects`
  );
  return response.data;
}

export async function getProject(
  teamId: string,
  projectId: string
): Promise<Project> {
  const response = await api.get<ApiResponse<Project>>(
    `/api/teams/${teamId}/projects/${projectId}`
  );
  return response.data;
}

export async function updateProject(
  teamId: string,
  projectId: string,
  data: UpdateProjectRequest
): Promise<Project> {
  const response = await api.patch<ApiResponse<Project>>(
    `/api/teams/${teamId}/projects/${projectId}`,
    data
  );
  return response.data;
}

export async function toggleProjectStar(
  teamId: string,
  projectId: string
): Promise<Project> {
  const response = await api.post<ApiResponse<Project>>(
    `/api/teams/${teamId}/projects/${projectId}/toggle-star`
  );
  return response.data;
}

export async function deleteProject(
  teamId: string,
  projectId: string
): Promise<void> {
  await api.delete(`/api/teams/${teamId}/projects/${projectId}`);
}
