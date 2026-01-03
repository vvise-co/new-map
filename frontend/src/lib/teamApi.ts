import { api } from './api';
import {
  Team,
  TeamWithMembers,
  Invitation,
  InvitationInfo,
  CreateTeamRequest,
  CreateTeamResponse,
  CreateInvitationRequest,
  AcceptInvitationResponse,
} from './types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// Team endpoints
export async function createTeam(data: CreateTeamRequest): Promise<CreateTeamResponse> {
  const response = await api.post<ApiResponse<CreateTeamResponse>>('/api/teams', data);
  return response.data;
}

export async function getUserTeams(): Promise<Team[]> {
  const response = await api.get<ApiResponse<Team[]>>('/api/teams');
  return response.data;
}

export async function getTeam(teamId: string): Promise<TeamWithMembers> {
  const response = await api.get<ApiResponse<TeamWithMembers>>(`/api/teams/${teamId}`);
  return response.data;
}

export async function checkHasTeam(): Promise<boolean> {
  const response = await api.get<{ success: boolean; has_team: boolean }>('/api/teams/has-team');
  return response.has_team;
}

// Invitation endpoints
export async function createInvitation(data: CreateInvitationRequest): Promise<Invitation> {
  const response = await api.post<ApiResponse<Invitation>>('/api/invitations', data);
  return response.data;
}

export async function getTeamInvitations(teamId: string): Promise<Invitation[]> {
  const response = await api.get<ApiResponse<Invitation[]>>(`/api/teams/${teamId}/invitations`);
  return response.data;
}

export async function getActiveInvitations(teamId: string): Promise<Invitation[]> {
  const response = await api.get<ApiResponse<Invitation[]>>(`/api/teams/${teamId}/invitations/active`);
  return response.data;
}

// Public endpoint - no auth required
export async function getInvitationInfo(token: string): Promise<InvitationInfo | null> {
  try {
    const response = await fetch(`/api/public/invitations/${token}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.data;
  } catch {
    return null;
  }
}

export async function acceptInvitation(token: string): Promise<AcceptInvitationResponse> {
  const response = await api.post<ApiResponse<AcceptInvitationResponse>>(`/api/invitations/${token}/accept`);
  return response.data;
}

export async function revokeInvitation(invitationId: string): Promise<void> {
  await api.delete(`/api/invitations/${invitationId}`);
}
