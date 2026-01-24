import { api } from './api';
import { Settings, PatchSettingsRequest, ApiResponse } from './types';
import { MapConfig } from '@/types/utiles';
import { DEFAULT_MAP_CONFIG, MAP_DEFAULTS_SETTINGS_KEY } from './managers/mapConfig';

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

// Project Map Defaults - Typed helpers

/**
 * Get project map defaults with fallback to DEFAULT_MAP_CONFIG.
 */
export async function getProjectMapDefaults(teamId: string, projectId: string): Promise<MapConfig> {
  try {
    const settings = await getProjectSettings(teamId, projectId);
    const mapDefaults = settings.data[MAP_DEFAULTS_SETTINGS_KEY] as Partial<MapConfig> | undefined;

    if (mapDefaults) {
      return {
        ...DEFAULT_MAP_CONFIG,
        ...mapDefaults,
      };
    }
    return DEFAULT_MAP_CONFIG;
  } catch {
    return DEFAULT_MAP_CONFIG;
  }
}

/**
 * Update project map defaults (partial update supported).
 */
export async function patchProjectMapDefaults(
  teamId: string,
  projectId: string,
  mapDefaults: Partial<MapConfig>
): Promise<Settings> {
  return patchProjectSettings(teamId, projectId, {
    [MAP_DEFAULTS_SETTINGS_KEY]: mapDefaults,
  });
}

/**
 * Reset project map defaults to system defaults.
 */
export async function resetProjectMapDefaults(teamId: string, projectId: string): Promise<Settings> {
  return removeProjectSettingsKey(teamId, projectId, MAP_DEFAULTS_SETTINGS_KEY);
}
