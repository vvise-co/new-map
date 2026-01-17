-- Asset categories for organizing team map assets (hierarchical folders)
CREATE TABLE asset_categories (
    id UUID PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES teams(id),
    parent_category_id UUID REFERENCES asset_categories(id),
    name VARCHAR(255) NOT NULL,
    "order" INT NOT NULL DEFAULT 0,
    color VARCHAR(7),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_asset_categories_team ON asset_categories(team_id);
CREATE INDEX idx_asset_categories_parent ON asset_categories(parent_category_id);
CREATE INDEX idx_asset_categories_deleted ON asset_categories(deleted) WHERE deleted = FALSE;
