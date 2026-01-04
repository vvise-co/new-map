-- Settings table for storing project, team, and user settings as JSONB
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scope VARCHAR(50) NOT NULL,
    scope_id UUID NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uk_settings_scope_scope_id UNIQUE (scope, scope_id)
);

-- Indexes for efficient lookups
CREATE INDEX idx_settings_scope ON settings(scope);
CREATE INDEX idx_settings_scope_id ON settings(scope_id);
CREATE INDEX idx_settings_deleted ON settings(deleted);

-- GIN index for JSONB queries (optional but useful for querying inside JSON)
CREATE INDEX idx_settings_data ON settings USING GIN (data);

COMMENT ON TABLE settings IS 'Stores settings for projects, teams, and users using JSONB';
COMMENT ON COLUMN settings.scope IS 'The scope type: PROJECT, TEAM, or USER';
COMMENT ON COLUMN settings.scope_id IS 'The ID of the project, team, or user this settings belongs to';
COMMENT ON COLUMN settings.data IS 'JSONB object containing all settings key-value pairs';
