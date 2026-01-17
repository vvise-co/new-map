import { api } from './api';
import {
  AssetCategory,
  AssetCategoryTree,
  CreateAssetCategoryRequest,
  UpdateAssetCategoryRequest,
  ReorderCategoriesRequest,
  MapAsset,
  MapAssetType,
  CreateMapAssetRequest,
  UpdateMapAssetRequest,
  ApiResponse,
} from './types';

// ============================================
// Asset Category Endpoints
// ============================================

export async function createAssetCategory(
  teamId: string,
  data: CreateAssetCategoryRequest
): Promise<AssetCategory> {
  const response = await api.post<ApiResponse<AssetCategory>>(
    `/api/teams/${teamId}/asset-categories`,
    data
  );
  return response.data;
}

export async function getAssetCategories(teamId: string): Promise<AssetCategory[]> {
  const response = await api.get<ApiResponse<AssetCategory[]>>(
    `/api/teams/${teamId}/asset-categories`
  );
  return response.data;
}

export async function getAssetCategoryTree(teamId: string): Promise<AssetCategoryTree[]> {
  const response = await api.get<ApiResponse<AssetCategoryTree[]>>(
    `/api/teams/${teamId}/asset-categories/tree`
  );
  return response.data;
}

export async function getAssetCategory(
  teamId: string,
  categoryId: string
): Promise<AssetCategory> {
  const response = await api.get<ApiResponse<AssetCategory>>(
    `/api/teams/${teamId}/asset-categories/${categoryId}`
  );
  return response.data;
}

export async function updateAssetCategory(
  teamId: string,
  categoryId: string,
  data: UpdateAssetCategoryRequest
): Promise<AssetCategory> {
  const response = await api.patch<ApiResponse<AssetCategory>>(
    `/api/teams/${teamId}/asset-categories/${categoryId}`,
    data
  );
  return response.data;
}

export async function deleteAssetCategory(
  teamId: string,
  categoryId: string
): Promise<void> {
  await api.delete(`/api/teams/${teamId}/asset-categories/${categoryId}`);
}

export async function reorderAssetCategories(
  teamId: string,
  data: ReorderCategoriesRequest
): Promise<AssetCategory[]> {
  const response = await api.post<ApiResponse<AssetCategory[]>>(
    `/api/teams/${teamId}/asset-categories/reorder`,
    data
  );
  return response.data;
}

// ============================================
// Map Asset Endpoints
// ============================================

export interface GetMapAssetsParams {
  type?: MapAssetType;
  category_id?: string;
  tag?: string;
}

export async function createMapAsset(
  teamId: string,
  data: CreateMapAssetRequest
): Promise<MapAsset> {
  const response = await api.post<ApiResponse<MapAsset>>(
    `/api/teams/${teamId}/assets`,
    data
  );
  return response.data;
}

export async function getMapAssets(
  teamId: string,
  params?: GetMapAssetsParams
): Promise<MapAsset[]> {
  const searchParams = new URLSearchParams();
  if (params?.type) searchParams.append('type', params.type);
  if (params?.category_id) searchParams.append('category_id', params.category_id);
  if (params?.tag) searchParams.append('tag', params.tag);

  const queryString = searchParams.toString();
  const url = `/api/teams/${teamId}/assets${queryString ? `?${queryString}` : ''}`;

  const response = await api.get<ApiResponse<MapAsset[]>>(url);
  return response.data;
}

export async function getMapAsset(teamId: string, assetId: string): Promise<MapAsset> {
  const response = await api.get<ApiResponse<MapAsset>>(
    `/api/teams/${teamId}/assets/${assetId}`
  );
  return response.data;
}

export async function updateMapAsset(
  teamId: string,
  assetId: string,
  data: UpdateMapAssetRequest
): Promise<MapAsset> {
  const response = await api.patch<ApiResponse<MapAsset>>(
    `/api/teams/${teamId}/assets/${assetId}`,
    data
  );
  return response.data;
}

export async function deleteMapAsset(teamId: string, assetId: string): Promise<void> {
  await api.delete(`/api/teams/${teamId}/assets/${assetId}`);
}

export async function duplicateMapAsset(
  teamId: string,
  assetId: string
): Promise<MapAsset> {
  const response = await api.post<ApiResponse<MapAsset>>(
    `/api/teams/${teamId}/assets/${assetId}/duplicate`
  );
  return response.data;
}
