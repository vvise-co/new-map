-- Add default map settings to PROJECT settings for existing projects
-- This uses the Settings table with scope='PROJECT'

-- Default map configuration as JSONB
-- Keys match frontend MapConfig type: style, center, zoom, minZoom, pitch, bearing
DO $$
DECLARE
    default_map_config JSONB := jsonb_build_object(
        'style', 'https://api.maptiler.com/maps/0198086b-cd8f-7c6b-b1d2-cf4970224855/style.json?key=BT1N1fSWfjN5SLzJmC0n',
        'center', jsonb_build_array(53.688, 32.4279),
        'zoom', 5,
        'minZoom', 2,
        'pitch', 0,
        'bearing', 0
    );
BEGIN
    -- Insert settings for projects that don't have any settings yet
    INSERT INTO settings (id, scope, scope_id, data, created_at, updated_at, deleted)
    SELECT
        gen_random_uuid(),
        'PROJECT',
        p.id,
        jsonb_build_object('mapDefaults', default_map_config),
        NOW(),
        NOW(),
        FALSE
    FROM team_projects p
    WHERE p.deleted = FALSE
      AND NOT EXISTS (
          SELECT 1 FROM settings s
          WHERE s.scope = 'PROJECT'
            AND s.scope_id = p.id
            AND s.deleted = FALSE
      );

    -- For projects that have settings but no mapDefaults key, add it
    UPDATE settings
    SET data = data || jsonb_build_object('mapDefaults', default_map_config),
        updated_at = NOW()
    WHERE scope = 'PROJECT'
      AND deleted = FALSE
      AND NOT (data ? 'mapDefaults');
END $$;
