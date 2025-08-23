-- Add draft session support to sessions table
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT FALSE;

-- Add index for draft sessions for better query performance
CREATE INDEX IF NOT EXISTS idx_sessions_draft ON sessions(is_draft);

-- Update existing sessions to be non-draft
UPDATE sessions SET is_draft = FALSE WHERE is_draft IS NULL;

-- Add constraint to ensure only one draft per user
-- We'll handle this in application logic for better user experience
