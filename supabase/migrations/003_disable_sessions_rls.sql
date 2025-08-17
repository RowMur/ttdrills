-- Disable Row Level Security on sessions tables
-- This is needed because we're using NextAuth for authentication, not Supabase auth
-- Authorization is handled in the API layer instead

ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE session_drills DISABLE ROW LEVEL SECURITY;

-- Drop the RLS policies since they're no longer needed
DROP POLICY IF EXISTS "Users can view their own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can create their own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON sessions;

DROP POLICY IF EXISTS "Users can view their own session drills" ON session_drills;
DROP POLICY IF EXISTS "Users can create session drills for their sessions" ON session_drills;
DROP POLICY IF EXISTS "Users can update their own session drills" ON session_drills;
DROP POLICY IF EXISTS "Users can delete their own session drills" ON session_drills;
