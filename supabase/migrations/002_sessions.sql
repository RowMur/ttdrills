-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  notes TEXT,
  duration_minutes INTEGER,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create session_drills table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS session_drills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  drill_slug TEXT NOT NULL, -- Changed from drill_id to drill_slug
  duration_minutes INTEGER,
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- 1-5 star rating
  repetitions INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);
CREATE INDEX IF NOT EXISTS idx_session_drills_session_id ON session_drills(session_id);
CREATE INDEX IF NOT EXISTS idx_session_drills_drill_id ON session_drills(drill_id);

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_drills ENABLE ROW LEVEL SECURITY;

-- RLS policies for sessions
CREATE POLICY "Users can view their own sessions" ON sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" ON sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" ON sessions
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for session_drills
CREATE POLICY "Users can view their own session drills" ON session_drills
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sessions 
      WHERE sessions.id = session_drills.session_id 
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create session drills for their sessions" ON session_drills
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions 
      WHERE sessions.id = session_drills.session_id 
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own session drills" ON session_drills
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM sessions 
      WHERE sessions.id = session_drills.session_id 
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own session drills" ON session_drills
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM sessions 
      WHERE sessions.id = session_drills.session_id 
      AND sessions.user_id = auth.uid()
    )
  );

-- Create trigger to automatically update updated_at for sessions
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
