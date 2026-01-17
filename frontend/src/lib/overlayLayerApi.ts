import { api } from './api';
import {
  OverlayLayer,
  OverlayLayerSummary,
  CreateOverlayLayerRequest,
  UpdateOverlayLayerRequest,
  ReorderLayersRequest,
  LayerKeyframe,
  AddKeyframeRequest,
  UpdateKeyframeRequest,
  LayerTransition,
  SetTransitionRequest,
  ApiResponse,
} from './types';

// ============================================
// Overlay Layer Endpoints
// ============================================

export async function createOverlayLayer(
  teamId: string,
  projectId: string,
  data: CreateOverlayLayerRequest
): Promise<OverlayLayer> {
  const response = await api.post<ApiResponse<OverlayLayer>>(
    `/api/teams/${teamId}/projects/${projectId}/composition/layers`,
    data
  );
  return response.data;
}

export async function getOverlayLayers(
  teamId: string,
  projectId: string
): Promise<OverlayLayerSummary[]> {
  const response = await api.get<ApiResponse<OverlayLayerSummary[]>>(
    `/api/teams/${teamId}/projects/${projectId}/composition/layers`
  );
  return response.data;
}

export async function getOverlayLayer(
  teamId: string,
  projectId: string,
  layerId: string
): Promise<OverlayLayer> {
  const response = await api.get<ApiResponse<OverlayLayer>>(
    `/api/teams/${teamId}/projects/${projectId}/composition/layers/${layerId}`
  );
  return response.data;
}

export async function updateOverlayLayer(
  teamId: string,
  projectId: string,
  layerId: string,
  data: UpdateOverlayLayerRequest
): Promise<OverlayLayer> {
  const response = await api.patch<ApiResponse<OverlayLayer>>(
    `/api/teams/${teamId}/projects/${projectId}/composition/layers/${layerId}`,
    data
  );
  return response.data;
}

export async function deleteOverlayLayer(
  teamId: string,
  projectId: string,
  layerId: string
): Promise<void> {
  await api.delete(
    `/api/teams/${teamId}/projects/${projectId}/composition/layers/${layerId}`
  );
}

export async function reorderOverlayLayers(
  teamId: string,
  projectId: string,
  data: ReorderLayersRequest
): Promise<OverlayLayerSummary[]> {
  const response = await api.post<ApiResponse<OverlayLayerSummary[]>>(
    `/api/teams/${teamId}/projects/${projectId}/composition/layers/reorder`,
    data
  );
  return response.data;
}

// ============================================
// Keyframe Endpoints
// ============================================

export async function addKeyframe(
  teamId: string,
  projectId: string,
  layerId: string,
  data: AddKeyframeRequest
): Promise<LayerKeyframe> {
  const response = await api.post<ApiResponse<LayerKeyframe>>(
    `/api/teams/${teamId}/projects/${projectId}/composition/layers/${layerId}/keyframes`,
    data
  );
  return response.data;
}

export async function updateKeyframe(
  teamId: string,
  projectId: string,
  layerId: string,
  keyframeId: string,
  data: UpdateKeyframeRequest
): Promise<LayerKeyframe> {
  const response = await api.patch<ApiResponse<LayerKeyframe>>(
    `/api/teams/${teamId}/projects/${projectId}/composition/layers/${layerId}/keyframes/${keyframeId}`,
    data
  );
  return response.data;
}

export async function deleteKeyframe(
  teamId: string,
  projectId: string,
  layerId: string,
  keyframeId: string
): Promise<void> {
  await api.delete(
    `/api/teams/${teamId}/projects/${projectId}/composition/layers/${layerId}/keyframes/${keyframeId}`
  );
}

// ============================================
// Transition Endpoints
// ============================================

export async function setTransition(
  teamId: string,
  projectId: string,
  fromLayerId: string,
  toLayerId: string,
  data: SetTransitionRequest
): Promise<LayerTransition> {
  const response = await api.put<ApiResponse<LayerTransition>>(
    `/api/teams/${teamId}/projects/${projectId}/composition/layers/${fromLayerId}/transition-to/${toLayerId}`,
    data
  );
  return response.data;
}

export async function removeTransition(
  teamId: string,
  projectId: string,
  layerId: string
): Promise<void> {
  await api.delete(
    `/api/teams/${teamId}/projects/${projectId}/composition/layers/${layerId}/transition`
  );
}
