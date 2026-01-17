import { createContext, useContext, ReactNode, useMemo } from 'react';

// Import all API modules
import * as teamApi from '@/lib/teamApi';
import * as projectApi from '@/lib/projectApi';
import * as settingsApi from '@/lib/settingsApi';
import * as mapAssetApi from '@/lib/mapAssetApi';
import * as compositionApi from '@/lib/compositionApi';
import * as overlayLayerApi from '@/lib/overlayLayerApi';

// Define the API interface for type safety and mocking
export interface ApiContextType {
  // Team API
  team: typeof teamApi;
  // Project API
  project: typeof projectApi;
  // Settings API
  settings: typeof settingsApi;
  // Map Asset API
  mapAsset: typeof mapAssetApi;
  // Composition API
  composition: typeof compositionApi;
  // Overlay Layer API
  overlayLayer: typeof overlayLayerApi;
}

// Create the default API implementation
const defaultApi: ApiContextType = {
  team: teamApi,
  project: projectApi,
  settings: settingsApi,
  mapAsset: mapAssetApi,
  composition: compositionApi,
  overlayLayer: overlayLayerApi,
};

const ApiContext = createContext<ApiContextType>(defaultApi);

interface ApiProviderProps {
  children: ReactNode;
  // Allow overriding API implementations for testing/mocking
  overrides?: Partial<ApiContextType>;
}

export function ApiProvider({ children, overrides }: ApiProviderProps) {
  const api = useMemo(() => {
    if (!overrides) return defaultApi;
    return {
      ...defaultApi,
      ...overrides,
    };
  }, [overrides]);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

// Hook to access all APIs
export function useApi(): ApiContextType {
  return useContext(ApiContext);
}

// Convenience hooks for specific API modules
export function useTeamApi() {
  const { team } = useContext(ApiContext);
  return team;
}

export function useProjectApi() {
  const { project } = useContext(ApiContext);
  return project;
}

export function useSettingsApi() {
  const { settings } = useContext(ApiContext);
  return settings;
}

export function useMapAssetApi() {
  const { mapAsset } = useContext(ApiContext);
  return mapAsset;
}

export function useCompositionApi() {
  const { composition } = useContext(ApiContext);
  return composition;
}

export function useOverlayLayerApi() {
  const { overlayLayer } = useContext(ApiContext);
  return overlayLayer;
}
