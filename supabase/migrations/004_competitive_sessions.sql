-- Add simple competitive flag to sessions table
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS is_competitive BOOLEAN DEFAULT FALSE;

-- Add index for competitive flag for better query performance
CREATE INDEX IF NOT EXISTS idx_sessions_competitive ON sessions(is_competitive);

-- Update existing sessions to be non-competitive
UPDATE sessions SET is_competitive = FALSE WHERE is_competitive IS NULL;
