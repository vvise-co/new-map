import { api } from './api';
import {
  Composition,
  CreateCompositionRequest,
  UpdateCompositionRequest,
  BaseLayer,
  BaseSegment,
  CreateBaseSegmentRequest,
  UpdateBaseSegmentRequest,
  ReorderBaseSegmentsRequest,
  ApiResponse,
} from './types';

// ============================================
// Composition Endpoints
// ============================================

export async function createComposition(
  teamId: string,
  projectId: string,
  data?: CreateCompositionRequest
): Promise<Composition> {
  const response = await api.post<ApiResponse<Composition>>(
    `/api/teams/${teamId}/projects/${projectId}/composition`,
    data || {}
  );
  return response.data;
}

export async function getComposition(
  teamId: string,
  projectId: string
): Promise<Composition> {
  const response = await api.get<ApiResponse<Composition>>(
    `/api/teams/${teamId}/projects/${projectId}/composition`
  );
  return response.data;
}

export async function updateComposition(
  teamId: string,
  projectId: string,
  data: UpdateCompositionRequest
): Promise<Composition> {
  const response = await api.patch<ApiResponse<Composition>>(
    `/api/teams/${teamId}/projects/${projectId}/composition`,
    data
  );
  return response.data;
}

export async function deleteComposition(
  teamId: string,
  projectId: string
): Promise<void> {
  await api.delete(`/api/teams/${teamId}/projects/${projectId}/composition`);
}

// ============================================
// Base Layer Endpoints (Camera)
// ============================================

export async function getBaseLayer(
  teamId: string,
  projectId: string
): Promise<BaseLayer> {
  const response = await api.get<ApiResponse<BaseLayer>>(
    `/api/teams/${teamId}/projects/${projectId}/composition/base-layer`
  );
  return response.data;
}

export async function getBaseSegments(
  teamId: string,
  projectId: string
): Promise<BaseSegment[]> {
  const response = await api.get<ApiResponse<BaseSegment[]>>(
    `/api/teams/${teamId}/projects/${projectId}/composition/base-layer/segments`
  );
  return response.data;
}

export async function createBaseSegment(
  teamId: string,
  projectId: string,
  data: CreateBaseSegmentRequest
): Promise<BaseSegment> {
  const response = await api.post<ApiResponse<BaseSegment>>(
    `/api/teams/${teamId}/projects/${projectId}/composition/base-layer/segments`,
    data
  );
  return response.data;
}

export async function getBaseSegment(
  teamId: string,
  projectId: string,
  segmentId: string
): Promise<BaseSegment> {
  const response = await api.get<ApiResponse<BaseSegment>>(
    `/api/teams/${teamId}/projects/${projectId}/composition/base-layer/segments/${segmentId}`
  );
  return response.data;
}

export async function updateBaseSegment(
  teamId: string,
  projectId: string,
  segmentId: string,
  data: UpdateBaseSegmentRequest
): Promise<BaseSegment> {
  const response = await api.patch<ApiResponse<BaseSegment>>(
    `/api/teams/${teamId}/projects/${projectId}/composition/base-layer/segments/${segmentId}`,
    data
  );
  return response.data;
}

export async function deleteBaseSegment(
  teamId: string,
  projectId: string,
  segmentId: string
): Promise<void> {
  await api.delete(
    `/api/teams/${teamId}/projects/${projectId}/composition/base-layer/segments/${segmentId}`
  );
}

export async function reorderBaseSegments(
  teamId: string,
  projectId: string,
  data: ReorderBaseSegmentsRequest
): Promise<BaseSegment[]> {
  const response = await api.post<ApiResponse<BaseSegment[]>>(
    `/api/teams/${teamId}/projects/${projectId}/composition/base-layer/segments/reorder`,
    data
  );
  return response.data;
}
