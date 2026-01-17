-- Composition - timeline container (1:1 with project)
CREATE TABLE compositions (
    id UUID PRIMARY KEY,
    project_id UUID NOT NULL UNIQUE REFERENCES team_projects(id),
    name VARCHAR(255) NOT NULL,
    duration DOUBLE PRECISION NOT NULL DEFAULT 60.0,
    frame_rate INT NOT NULL DEFAULT 30,
    map_config JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_compositions_project ON compositions(project_id);
CREATE INDEX idx_compositions_deleted ON compositions(deleted) WHERE deleted = FALSE;

-- Base Layer - exactly one per composition, handles camera positions/transitions
CREATE TABLE base_layers (
    id UUID PRIMARY KEY,
    composition_id UUID NOT NULL UNIQUE REFERENCES compositions(id),
    name VARCHAR(255) NOT NULL DEFAULT 'Camera',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_base_layers_composition ON base_layers(composition_id);

-- Base Segments - camera positions on the base layer timeline
CREATE TABLE base_segments (
    id UUID PRIMARY KEY,
    base_layer_id UUID NOT NULL REFERENCES base_layers(id),
    name VARCHAR(255) NOT NULL,
    "order" INT NOT NULL DEFAULT 0,
    start_time DOUBLE PRECISION NOT NULL,
    end_time DOUBLE PRECISION NOT NULL,
    camera_position JSONB NOT NULL,
    transition_to_next JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP,

    CONSTRAINT chk_base_segment_time CHECK (end_time > start_time)
);

CREATE INDEX idx_base_segments_layer ON base_segments(base_layer_id);
CREATE INDEX idx_base_segments_order ON base_segments(base_layer_id, "order");
CREATE INDEX idx_base_segments_deleted ON base_segments(deleted) WHERE deleted = FALSE;

-- Overlay Layers - each layer IS a single map element (like video editor clips)
-- Each layer contains: time range, geometry, asset reference, and style
CREATE TABLE overlay_layers (
    id UUID PRIMARY KEY,
    composition_id UUID NOT NULL REFERENCES compositions(id),
    map_asset_id UUID REFERENCES map_assets(id),
    name VARCHAR(255) NOT NULL,
    "order" INT NOT NULL DEFAULT 0,
    start_time DOUBLE PRECISION NOT NULL DEFAULT 0,
    end_time DOUBLE PRECISION NOT NULL,
    visible BOOLEAN NOT NULL DEFAULT TRUE,
    locked BOOLEAN NOT NULL DEFAULT FALSE,
    opacity DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    geometry GEOMETRY NOT NULL,
    style_overrides JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP,

    CONSTRAINT chk_overlay_layer_time CHECK (end_time > start_time),
    CONSTRAINT chk_overlay_layer_opacity CHECK (opacity >= 0 AND opacity <= 1)
);

CREATE INDEX idx_overlay_layers_composition ON overlay_layers(composition_id);
CREATE INDEX idx_overlay_layers_order ON overlay_layers(composition_id, "order");
CREATE INDEX idx_overlay_layers_asset ON overlay_layers(map_asset_id);
CREATE INDEX idx_overlay_layers_geometry ON overlay_layers USING GIST(geometry);
CREATE INDEX idx_overlay_layers_deleted ON overlay_layers(deleted) WHERE deleted = FALSE;

-- Layer Keyframes - animation keyframes for layer properties
CREATE TABLE layer_keyframes (
    id UUID PRIMARY KEY,
    layer_id UUID NOT NULL REFERENCES overlay_layers(id),
    time_offset DOUBLE PRECISION NOT NULL,
    property VARCHAR(50) NOT NULL,
    value VARCHAR(255) NOT NULL,
    easing VARCHAR(20) NOT NULL DEFAULT 'LINEAR',
    easing_params JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP,

    CONSTRAINT chk_keyframe_time CHECK (time_offset >= 0),
    CONSTRAINT chk_keyframe_easing CHECK (easing IN ('LINEAR', 'EASE_IN', 'EASE_OUT', 'EASE_IN_OUT', 'CUBIC_BEZIER'))
);

CREATE INDEX idx_layer_keyframes_layer ON layer_keyframes(layer_id);
CREATE INDEX idx_layer_keyframes_time ON layer_keyframes(layer_id, time_offset);
CREATE INDEX idx_layer_keyframes_deleted ON layer_keyframes(deleted) WHERE deleted = FALSE;

-- Layer Transitions - transitions between layers
CREATE TABLE layer_transitions (
    id UUID PRIMARY KEY,
    from_layer_id UUID NOT NULL REFERENCES overlay_layers(id),
    to_layer_id UUID NOT NULL REFERENCES overlay_layers(id),
    type VARCHAR(20) NOT NULL,
    duration DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    easing VARCHAR(20) NOT NULL DEFAULT 'EASE_IN_OUT',
    config JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP,

    CONSTRAINT chk_transition_type CHECK (type IN ('NONE', 'FLYTO', 'FADE', 'INSTANT', 'EASE_TO', 'JUMP_TO')),
    CONSTRAINT chk_transition_easing CHECK (easing IN ('LINEAR', 'EASE_IN', 'EASE_OUT', 'EASE_IN_OUT', 'CUBIC_BEZIER')),
    CONSTRAINT chk_transition_duration CHECK (duration >= 0),
    CONSTRAINT uq_layer_transition UNIQUE(from_layer_id, to_layer_id)
);

CREATE INDEX idx_layer_transitions_from ON layer_transitions(from_layer_id);
CREATE INDEX idx_layer_transitions_to ON layer_transitions(to_layer_id);
CREATE INDEX idx_layer_transitions_deleted ON layer_transitions(deleted) WHERE deleted = FALSE;
