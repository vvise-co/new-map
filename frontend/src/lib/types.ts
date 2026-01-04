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
