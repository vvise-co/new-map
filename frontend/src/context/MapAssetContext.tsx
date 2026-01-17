import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import {
  AssetCategory,
  AssetCategoryTree,
  CreateAssetCategoryRequest,
  UpdateAssetCategoryRequest,
  MapAsset,
  MapAssetType,
  CreateMapAssetRequest,
  UpdateMapAssetRequest,
} from '@/lib/types';
import { useMapAssetApi } from './ApiContext';
import { useTeam } from './TeamContext';

interface AssetFilters {
  type?: MapAssetType;
  categoryId?: string;
  tag?: string;
}

interface MapAssetContextType {
  // State
  categories: AssetCategory[];
  categoryTree: AssetCategoryTree[];
  assets: MapAsset[];
  selectedAsset: MapAsset | null;
  filters: AssetFilters;
  loading: boolean;
  error: string | null;

  // Category Actions
  loadCategories: () => Promise<void>;
  loadCategoryTree: () => Promise<void>;
  createCategory: (data: CreateAssetCategoryRequest) => Promise<AssetCategory>;
  updateCategory: (categoryId: string, data: UpdateAssetCategoryRequest) => Promise<AssetCategory>;
  deleteCategory: (categoryId: string) => Promise<void>;
  reorderCategories: (categoryIds: string[]) => Promise<void>;

  // Asset Actions
  loadAssets: (filters?: AssetFilters) => Promise<void>;
  setFilters: (filters: AssetFilters) => void;
  selectAsset: (assetId: string) => Promise<void>;
  createAsset: (data: CreateMapAssetRequest) => Promise<MapAsset>;
  updateAsset: (assetId: string, data: UpdateMapAssetRequest) => Promise<MapAsset>;
  deleteAsset: (assetId: string) => Promise<void>;
  duplicateAsset: (assetId: string) => Promise<MapAsset>;
  clearSelectedAsset: () => void;
}

const MapAssetContext = createContext<MapAssetContextType | undefined>(undefined);

export function MapAssetProvider({ children }: { children: ReactNode }) {
  const api = useMapAssetApi();
  const { currentTeam } = useTeam();

  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [categoryTree, setCategoryTree] = useState<AssetCategoryTree[]>([]);
  const [assets, setAssets] = useState<MapAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<MapAsset | null>(null);
  const [filters, setFiltersState] = useState<AssetFilters>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTeamId = useCallback(() => {
    if (!currentTeam) {
      throw new Error('No team selected');
    }
    return currentTeam.team.id;
  }, [currentTeam]);

  // Category Actions
  const loadCategories = useCallback(async () => {
    const teamId = getTeamId();

    setLoading(true);
    setError(null);
    try {
      const data = await api.getAssetCategories(teamId);
      setCategories(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load categories';
      setError(message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [api, getTeamId]);

  const loadCategoryTree = useCallback(async () => {
    const teamId = getTeamId();

    setLoading(true);
    setError(null);
    try {
      const data = await api.getAssetCategoryTree(teamId);
      setCategoryTree(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load category tree';
      setError(message);
      setCategoryTree([]);
    } finally {
      setLoading(false);
    }
  }, [api, getTeamId]);

  const createCategory = useCallback(
    async (data: CreateAssetCategoryRequest): Promise<AssetCategory> => {
      const teamId = getTeamId();

      setLoading(true);
      setError(null);
      try {
        const category = await api.createAssetCategory(teamId, data);
        await loadCategories();
        await loadCategoryTree();
        return category;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create category';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api, getTeamId, loadCategories, loadCategoryTree]
  );

  const updateCategory = useCallback(
    async (categoryId: string, data: UpdateAssetCategoryRequest): Promise<AssetCategory> => {
      const teamId = getTeamId();

      setLoading(true);
      setError(null);
      try {
        const category = await api.updateAssetCategory(teamId, categoryId, data);
        await loadCategories();
        await loadCategoryTree();
        return category;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update category';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api, getTeamId, loadCategories, loadCategoryTree]
  );

  const deleteCategory = useCallback(
    async (categoryId: string): Promise<void> => {
      const teamId = getTeamId();

      setLoading(true);
      setError(null);
      try {
        await api.deleteAssetCategory(teamId, categoryId);
        await loadCategories();
        await loadCategoryTree();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete category';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api, getTeamId, loadCategories, loadCategoryTree]
  );

  const reorderCategories = useCallback(
    async (categoryIds: string[]): Promise<void> => {
      const teamId = getTeamId();

      try {
        await api.reorderAssetCategories(teamId, { category_ids: categoryIds });
        await loadCategories();
        await loadCategoryTree();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to reorder categories';
        setError(message);
        throw err;
      }
    },
    [api, getTeamId, loadCategories, loadCategoryTree]
  );

  // Asset Actions
  const loadAssets = useCallback(
    async (newFilters?: AssetFilters) => {
      const teamId = getTeamId();
      const appliedFilters = newFilters || filters;

      setLoading(true);
      setError(null);
      try {
        const data = await api.getMapAssets(teamId, {
          type: appliedFilters.type,
          category_id: appliedFilters.categoryId,
          tag: appliedFilters.tag,
        });
        setAssets(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load assets';
        setError(message);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    },
    [api, getTeamId, filters]
  );

  const setFilters = useCallback(
    (newFilters: AssetFilters) => {
      setFiltersState(newFilters);
      loadAssets(newFilters);
    },
    [loadAssets]
  );

  const selectAsset = useCallback(
    async (assetId: string): Promise<void> => {
      const teamId = getTeamId();

      setLoading(true);
      setError(null);
      try {
        const asset = await api.getMapAsset(teamId, assetId);
        setSelectedAsset(asset);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load asset';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [api, getTeamId]
  );

  const createAsset = useCallback(
    async (data: CreateMapAssetRequest): Promise<MapAsset> => {
      const teamId = getTeamId();

      setLoading(true);
      setError(null);
      try {
        const asset = await api.createMapAsset(teamId, data);
        await loadAssets();
        return asset;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create asset';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api, getTeamId, loadAssets]
  );

  const updateAsset = useCallback(
    async (assetId: string, data: UpdateMapAssetRequest): Promise<MapAsset> => {
      const teamId = getTeamId();

      setLoading(true);
      setError(null);
      try {
        const asset = await api.updateMapAsset(teamId, assetId, data);
        if (selectedAsset?.id === assetId) {
          setSelectedAsset(asset);
        }
        await loadAssets();
        return asset;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update asset';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api, getTeamId, selectedAsset, loadAssets]
  );

  const deleteAsset = useCallback(
    async (assetId: string): Promise<void> => {
      const teamId = getTeamId();

      setLoading(true);
      setError(null);
      try {
        await api.deleteMapAsset(teamId, assetId);
        if (selectedAsset?.id === assetId) {
          setSelectedAsset(null);
        }
        await loadAssets();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete asset';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api, getTeamId, selectedAsset, loadAssets]
  );

  const duplicateAsset = useCallback(
    async (assetId: string): Promise<MapAsset> => {
      const teamId = getTeamId();

      setLoading(true);
      setError(null);
      try {
        const asset = await api.duplicateMapAsset(teamId, assetId);
        await loadAssets();
        return asset;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to duplicate asset';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api, getTeamId, loadAssets]
  );

  const clearSelectedAsset = useCallback(() => {
    setSelectedAsset(null);
  }, []);

  return (
    <MapAssetContext.Provider
      value={{
        categories,
        categoryTree,
        assets,
        selectedAsset,
        filters,
        loading,
        error,
        loadCategories,
        loadCategoryTree,
        createCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        loadAssets,
        setFilters,
        selectAsset,
        createAsset,
        updateAsset,
        deleteAsset,
        duplicateAsset,
        clearSelectedAsset,
      }}
    >
      {children}
    </MapAssetContext.Provider>
  );
}

export function useMapAssets() {
  const context = useContext(MapAssetContext);
  if (!context) {
    throw new Error('useMapAssets must be used within MapAssetProvider');
  }
  return context;
}
