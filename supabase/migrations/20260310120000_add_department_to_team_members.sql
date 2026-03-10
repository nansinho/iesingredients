-- Add department column to team_members for filtering by department
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS department text;
CREATE INDEX IF NOT EXISTS idx_team_members_department ON team_members(department);
