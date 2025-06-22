-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cnic VARCHAR(13) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create crime_reports table
CREATE TABLE IF NOT EXISTS crime_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  crime_type VARCHAR(100) NOT NULL,
  location TEXT,
  description TEXT NOT NULL,
  image_url TEXT,
  video_link TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_responses table
CREATE TABLE IF NOT EXISTS admin_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES crime_reports(id) ON DELETE CASCADE,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_crime_reports_user_id ON crime_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_crime_reports_status ON crime_reports(status);
CREATE INDEX IF NOT EXISTS idx_crime_reports_crime_type ON crime_reports(crime_type);
CREATE INDEX IF NOT EXISTS idx_admin_responses_report_id ON admin_responses(report_id);

-- Disable Row Level Security for now to avoid auth issues
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE crime_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_responses DISABLE ROW LEVEL SECURITY;
