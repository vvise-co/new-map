import { MapConfig, MapZoomLevels } from '@/types/utiles';

/**
 * Default map zoom levels for different place types.
 * Used for flyTo operations when navigating to geocoded locations.
 */
export const DEFAULT_MAP_ZOOM_LEVELS: MapZoomLevels = {
  country: 4,
  region: 6,
  postcode: 14,
  district: 10,
  place: 12,
  locality: 13,
  neighborhood: 14,
  address: 16,
  poi: 17,
  city: 11,
};

/**
 * MapTiler configuration from environment variables.
 * These are exposed via Vite's import.meta.env
 *
 * Default map configuration - used as fallback when project settings are not available.
 */
const MAP_TILER_API_KEY = import.meta.env.VITE_MAP_TILER_API_KEY || 'BT1N1fSWfjN5SLzJmC0n';
const MAP_TILER_MAP_ID = import.meta.env.VITE_MAP_TILER_MAP_ID || '0198086b-cd8f-7c6b-b1d2-cf4970224855';

export const DEFAULT_MAP_CONFIG: MapConfig = {
  style: `https://api.maptiler.com/maps/${MAP_TILER_MAP_ID}/style.json?key=${MAP_TILER_API_KEY}`,
  center: [53.688, 32.4279],
  zoom: 5,
  minZoom: 2,
  pitch: 0,
  bearing: 0,
};

/**
 * Settings key used to store map defaults in project settings.
 */
export const MAP_DEFAULTS_SETTINGS_KEY = 'mapDefaults';
