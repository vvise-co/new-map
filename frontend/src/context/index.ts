// Core contexts
export { AuthProvider, useAuth } from './AuthContext';
export { ThemeProvider, ThemeContext } from './ThemeContext';

// API context - provides mockable API access
export {
  ApiProvider,
  useApi,
  useTeamApi,
  useProjectApi,
  useSettingsApi,
  useMapAssetApi,
  useCompositionApi,
  useOverlayLayerApi,
} from './ApiContext';
export type { ApiContextType } from './ApiContext';

// Domain contexts
export { TeamProvider, useTeam } from './TeamContext';
export { ProjectProvider, useProject } from './ProjectContext';
export { CompositionProvider, useComposition } from './CompositionContext';
export { MapAssetProvider, useMapAssets } from './MapAssetContext';
