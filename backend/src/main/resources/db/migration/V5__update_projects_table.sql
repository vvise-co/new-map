-- V5: Update team_projects table to allow multiple projects per team and add starred field

-- Drop the unique constraint on team_id (allows multiple projects per team)
ALTER TABLE team_projects DROP CONSTRAINT IF EXISTS uk_team_projects_team;

-- Add starred field for favorite projects
ALTER TABLE team_projects ADD COLUMN starred BOOLEAN NOT NULL DEFAULT FALSE;

-- Add index for starred projects lookup
CREATE INDEX idx_team_projects_starred ON team_projects(team_id, starred) WHERE deleted = FALSE;

-- Add index for recent projects (by updated_at)
CREATE INDEX idx_team_projects_recent ON team_projects(team_id, updated_at DESC) WHERE deleted = FALSE;
