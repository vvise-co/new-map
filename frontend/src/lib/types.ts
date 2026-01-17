/**
 * User interface compliant with OpenID Connect Core 1.0 Standard Claims.
 * @see https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
 */
export interface User {
  // OIDC: sub - Subject Identifier
  sub: string;
  // OIDC: name - Full name
  name: string;
  // OIDC: given_name
  given_name?: string;
  // OIDC: family_name
  family_name?: string;
  // OIDC: middle_name
  middle_name?: string;
  // OIDC: nickname
  nickname?: string;
  // OIDC: preferred_username
  preferred_username?: string;
  // OIDC: profile - URL of profile page
  profile?: string;
  // OIDC: picture - URL of profile picture
  picture?: string;
  // OIDC: website
  website?: string;
  // OIDC: email
  email: string;
  // OIDC: email_verified
  email_verified?: boolean;
  // OIDC: gender
  gender?: string;
  // OIDC: birthdate (YYYY-MM-DD format)
  birthdate?: string;
  // OIDC: zoneinfo
  zoneinfo?: string;
  // OIDC: locale
  locale?: string;
  // OIDC: phone_number
  phone_number?: string;
  // OIDC: phone_number_verified
  phone_number_verified?: boolean;
  // OIDC: address
  address?: Address;
  // OIDC: updated_at (Unix timestamp)
  updated_at?: number;
  // Application-specific fields
  roles?: string[];
  provider?: string;
}

/**
 * OIDC Address Claim structure.
 */
export interface Address {
  formatted?: string;
  street_address?: string;
  locality?: string;
  region?: string;
  postal_code?: string;
  country?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface ApiError {
  message: string;
  status: number;
}

// Team types
export type TeamRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface Team {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  member_count?: number;
  current_user_role?: TeamRole;
}

export interface TeamMember {
  id: string;
  user_id: string;
  user_sub: string;
  user_name: string;
  user_email: string;
  role: TeamRole;
  joined_at: string;
}

export interface TeamWithMembers {
  team: Team;
  members: TeamMember[];
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
}

export interface CreateTeamResponse {
  team: Team;
  membership: TeamMember;
}

// Invitation types
export interface Invitation {
  id: string;
  token: string;
  team_id: string;
  team_name: string;
  invite_link: string;
  expires_at: string;
  created_at: string;
  created_by_name: string;
  is_expired: boolean;
  is_used: boolean;
  used_at?: string;
  used_by_name?: string;
}

export interface InvitationInfo {
  team_name: string;
  team_description?: string;
  inviter_name: string;
  expires_at: string;
  is_valid: boolean;
}

export interface CreateInvitationRequest {
  team_id: string;
  expires_in_days?: number;
}

export interface AcceptInvitationResponse {
  success: boolean;
  team: Team;
  membership: TeamMember;
}

// Settings types
export type SettingsScope = 'PROJECT' | 'TEAM' | 'USER';

export interface Settings {
  id: string;
  scope: SettingsScope;
  scope_id: string;
  data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PatchSettingsRequest {
  data: Record<string, unknown>;
}

// Project types
export interface Project {
  id: string;
  name: string;
  description?: string;
  starred: boolean;
  team_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  starred?: boolean;
}

export interface ProjectListResponse {
  recent: Project[];
  starred: Project[];
}

// ============================================
// Map Timeline Types
// ============================================

// GeoJSON Types
export type GeoJsonType = 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon';

export interface GeoJsonGeometry {
  type: GeoJsonType;
  coordinates: number[] | number[][] | number[][][] | number[][][][];
}

export interface GeoJsonPoint extends GeoJsonGeometry {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

export interface GeoJsonLineString extends GeoJsonGeometry {
  type: 'LineString';
  coordinates: [number, number][]; // Array of [lng, lat]
}

export interface GeoJsonPolygon extends GeoJsonGeometry {
  type: 'Polygon';
  coordinates: [number, number][][]; // Array of rings, each ring is array of [lng, lat]
}

// Enums
export type MapAssetType = 'POINT' | 'POLYLINE' | 'POLYGON';

export type AnimatableProperty =
  | 'OPACITY'
  | 'SCALE'
  | 'ROTATION'
  | 'OFFSET_X'
  | 'OFFSET_Y'
  | 'FILL_OPACITY'
  | 'STROKE_OPACITY'
  | 'STROKE_WIDTH'
  | 'CAMERA_ZOOM'
  | 'CAMERA_BEARING'
  | 'CAMERA_PITCH';

export type EasingType = 'LINEAR' | 'EASE_IN' | 'EASE_OUT' | 'EASE_IN_OUT' | 'CUBIC_BEZIER';

export type TransitionType = 'NONE' | 'FLYTO' | 'FADE' | 'INSTANT' | 'EASE_TO' | 'JUMP_TO';

// Asset Category Types
export interface AssetCategory {
  id: string;
  team_id: string;
  parent_category_id?: string;
  name: string;
  order: number;
  color?: string;
  children_count: number;
  assets_count: number;
  created_at: string;
  updated_at: string;
}

export interface AssetCategoryTree extends AssetCategory {
  children: AssetCategoryTree[];
}

export interface CreateAssetCategoryRequest {
  name: string;
  parent_category_id?: string;
  color?: string;
}

export interface UpdateAssetCategoryRequest {
  name?: string;
  parent_category_id?: string;
  color?: string;
}

export interface ReorderCategoriesRequest {
  category_ids: string[];
}

// Map Asset Types
export interface MapAsset {
  id: string;
  team_id: string;
  category_id?: string;
  category?: AssetCategory;
  name: string;
  description?: string;
  type: MapAssetType;
  style_data: Record<string, unknown>;
  default_geometry?: GeoJsonGeometry;
  preview_url?: string;
  tags?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMapAssetRequest {
  name: string;
  category_id?: string;
  description?: string;
  type: MapAssetType;
  style_data: Record<string, unknown>;
  default_geometry?: GeoJsonGeometry;
  preview_url?: string;
  tags?: string;
}

export interface UpdateMapAssetRequest {
  name?: string;
  category_id?: string;
  description?: string;
  style_data?: Record<string, unknown>;
  default_geometry?: GeoJsonGeometry;
  preview_url?: string;
  tags?: string;
}

// Composition Types
export interface Composition {
  id: string;
  project_id: string;
  name: string;
  duration: number;
  frame_rate: number;
  map_config: MapConfig;
  base_layer?: BaseLayer;
  overlay_layers: OverlayLayerSummary[];
  created_at: string;
  updated_at: string;
}

export interface CompositionSummary {
  id: string;
  project_id: string;
  name: string;
  duration: number;
  frame_rate: number;
  layer_count: number;
  created_at: string;
  updated_at: string;
}

export interface MapConfig {
  style?: string;
  default_center?: [number, number];
  default_zoom?: number;
  default_bearing?: number;
  default_pitch?: number;
}

export interface CreateCompositionRequest {
  name?: string;
  duration?: number;
  frame_rate?: number;
  map_config?: MapConfig;
}

export interface UpdateCompositionRequest {
  name?: string;
  duration?: number;
  frame_rate?: number;
  map_config?: MapConfig;
}

// Base Layer Types (Camera)
export interface BaseLayer {
  id: string;
  composition_id: string;
  name: string;
  segments: BaseSegment[];
  created_at: string;
  updated_at: string;
}

export interface BaseSegment {
  id: string;
  base_layer_id: string;
  name: string;
  order: number;
  start_time: number;
  end_time: number;
  camera_position: CameraPosition;
  transition_to_next?: CameraTransition;
  created_at: string;
  updated_at: string;
}

export interface CameraPosition {
  center: [number, number]; // [lng, lat]
  zoom: number;
  bearing?: number;
  pitch?: number;
}

export interface CameraTransition {
  type: TransitionType;
  duration: number;
  easing: EasingType;
  curve?: number;
}

export interface CreateBaseSegmentRequest {
  name: string;
  start_time: number;
  end_time: number;
  camera_position: CameraPosition;
  transition_to_next?: CameraTransition;
}

export interface UpdateBaseSegmentRequest {
  name?: string;
  start_time?: number;
  end_time?: number;
  camera_position?: CameraPosition;
  transition_to_next?: CameraTransition;
}

export interface ReorderBaseSegmentsRequest {
  segment_ids: string[];
}

// Overlay Layer Types (Map Elements)
export interface OverlayLayer {
  id: string;
  composition_id: string;
  map_asset_id?: string;
  map_asset?: MapAsset;
  name: string;
  order: number;
  start_time: number;
  end_time: number;
  visible: boolean;
  locked: boolean;
  opacity: number;
  geometry: GeoJsonGeometry;
  style_overrides?: Record<string, unknown>;
  keyframes: LayerKeyframe[];
  transition?: LayerTransition;
  created_at: string;
  updated_at: string;
}

export interface OverlayLayerSummary {
  id: string;
  composition_id: string;
  map_asset_id?: string;
  name: string;
  order: number;
  start_time: number;
  end_time: number;
  visible: boolean;
  locked: boolean;
  opacity: number;
  geometry: GeoJsonGeometry;
  keyframe_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateOverlayLayerRequest {
  name: string;
  map_asset_id?: string;
  start_time?: number;
  end_time: number;
  visible?: boolean;
  locked?: boolean;
  opacity?: number;
  geometry: GeoJsonGeometry;
  style_overrides?: Record<string, unknown>;
}

export interface UpdateOverlayLayerRequest {
  name?: string;
  map_asset_id?: string;
  start_time?: number;
  end_time?: number;
  visible?: boolean;
  locked?: boolean;
  opacity?: number;
  geometry?: GeoJsonGeometry;
  style_overrides?: Record<string, unknown>;
}

export interface ReorderLayersRequest {
  layer_ids: string[];
}

// Keyframe Types
export interface LayerKeyframe {
  id: string;
  layer_id: string;
  time_offset: number;
  property: AnimatableProperty;
  value: string;
  easing: EasingType;
  easing_params?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AddKeyframeRequest {
  time_offset: number;
  property: AnimatableProperty;
  value: string;
  easing?: EasingType;
  easing_params?: Record<string, unknown>;
}

export interface UpdateKeyframeRequest {
  time_offset?: number;
  property?: AnimatableProperty;
  value?: string;
  easing?: EasingType;
  easing_params?: Record<string, unknown>;
}

// Transition Types
export interface LayerTransition {
  id: string;
  from_layer_id: string;
  to_layer_id: string;
  type: TransitionType;
  duration: number;
  easing: EasingType;
  config?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface SetTransitionRequest {
  type: TransitionType;
  duration?: number;
  easing?: EasingType;
  config?: Record<string, unknown>;
}

// Generic API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
