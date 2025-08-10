-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drills table
CREATE TABLE IF NOT EXISTS drills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  objectives TEXT[] NOT NULL,
  difficulty TEXT NOT NULL,
  categories TEXT[] NOT NULL,
  tips TEXT[] NOT NULL,
  duration TEXT,
  video_url TEXT,
  video_start INTEGER,
  graph JSONB NOT NULL,
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_drills_creator_id ON drills(creator_id);
CREATE INDEX IF NOT EXISTS idx_drills_slug ON drills(slug);
CREATE INDEX IF NOT EXISTS idx_drills_difficulty ON drills(difficulty);
CREATE INDEX IF NOT EXISTS idx_drills_categories ON drills USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_drills_name_description ON drills USING GIN(to_tsvector('english', name || ' ' || description));

-- Enable Row Level Security (RLS) - Only for drills table
-- Users table doesn't need RLS since we're using NextAuth
ALTER TABLE drills ENABLE ROW LEVEL SECURITY;

-- Allow user creation (NextAuth will handle this)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow user creation" ON users
  FOR ALL USING (true);

-- Create RLS policies for drills table
CREATE POLICY "Anyone can view drills" ON drills
  FOR SELECT USING (true);

-- Allow authenticated users to create drills (we'll check auth in the API)
CREATE POLICY "Allow drill creation" ON drills
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own drills (we'll check ownership in the API)
CREATE POLICY "Allow drill updates" ON drills
  FOR UPDATE USING (true);

-- Allow users to delete their own drills (we'll check ownership in the API)
CREATE POLICY "Allow drill deletion" ON drills
  FOR DELETE USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drills_updated_at BEFORE UPDATE ON drills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
