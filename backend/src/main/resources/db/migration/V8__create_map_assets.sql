-- Map assets - team-level reusable templates for map elements (point, polyline, polygon)
CREATE TABLE map_assets (
    id UUID PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES teams(id),
    category_id UUID REFERENCES asset_categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL, -- POINT, POLYLINE, POLYGON
    style_data JSONB NOT NULL DEFAULT '{}',
    default_geometry GEOMETRY,
    preview_url VARCHAR(500),
    tags VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP,

    CONSTRAINT chk_map_asset_type CHECK (type IN ('POINT', 'POLYLINE', 'POLYGON'))
);

-- Indexes
CREATE INDEX idx_map_assets_team ON map_assets(team_id);
CREATE INDEX idx_map_assets_category ON map_assets(category_id);
CREATE INDEX idx_map_assets_type ON map_assets(type);
CREATE INDEX idx_map_assets_deleted ON map_assets(deleted) WHERE deleted = FALSE;
CREATE INDEX idx_map_assets_geometry ON map_assets USING GIST(default_geometry) WHERE default_geometry IS NOT NULL;

-- Full-text search index on tags
CREATE INDEX idx_map_assets_tags ON map_assets USING gin(to_tsvector('english', COALESCE(tags, '')));
