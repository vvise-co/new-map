import { api } from './api';
import { Settings, PatchSettingsRequest } from './types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// User Settings
export async function getUserSettings(): Promise<Settings> {
  const response = await api.get<ApiResponse<Settings>>('/api/settings/user');
  return response.data;
}

export async function patchUserSettings(data: Record<string, unknown>): Promise<Settings> {
  const request: PatchSettingsRequest = { data };
  const response = await api.patch<ApiResponse<Settings>>('/api/settings/user', request);
  return response.data;
}

export async function removeUserSettingsKey(key: string): Promise<Settings> {
  const response = await api.delete<ApiResponse<Settings>>(`/api/settings/user/${key}`);
  return response.data;
}

// Team Settings
export async function getTeamSettings(teamId: string): Promise<Settings> {
  const response = await api.get<ApiResponse<Settings>>(`/api/teams/${teamId}/settings`);
  return response.data;
}

export async function patchTeamSettings(teamId: string, data: Record<string, unknown>): Promise<Settings> {
  const request: PatchSettingsRequest = { data };
  const response = await api.patch<ApiResponse<Settings>>(`/api/teams/${teamId}/settings`, request);
  return response.data;
}

export async function removeTeamSettingsKey(teamId: string, key: string): Promise<Settings> {
  const response = await api.delete<ApiResponse<Settings>>(`/api/teams/${teamId}/settings/${key}`);
  return response.data;
}

// Project Settings
export async function getProjectSettings(teamId: string, projectId: string): Promise<Settings> {
  const response = await api.get<ApiResponse<Settings>>(`/api/teams/${teamId}/projects/${projectId}/settings`);
  return response.data;
}

export async function patchProjectSettings(
  teamId: string,
  projectId: string,
  data: Record<string, unknown>
): Promise<Settings> {
  const request: PatchSettingsRequest = { data };
  const response = await api.patch<ApiResponse<Settings>>(
    `/api/teams/${teamId}/projects/${projectId}/settings`,
    request
  );
  return response.data;
}

export async function removeProjectSettingsKey(
  teamId: string,
  projectId: string,
  key: string
): Promise<Settings> {
  const response = await api.delete<ApiResponse<Settings>>(
    `/api/teams/${teamId}/projects/${projectId}/settings/${key}`
  );
  return response.data;
}
