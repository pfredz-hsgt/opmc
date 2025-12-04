-- OPMC Database Setup for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Table 1: medicines
CREATE TABLE IF NOT EXISTS medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  baris TEXT,
  rak TEXT,
  tingkat TEXT,
  petak TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 2: location_options
CREATE TABLE IF NOT EXISTS location_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('baris', 'rak', 'tingkat', 'petak')),
  value TEXT NOT NULL,
  UNIQUE(category, value)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_medicines_name ON medicines(name);
CREATE INDEX IF NOT EXISTS idx_location_options_category ON location_options(category);

-- Insert some default location options (customize as needed)
INSERT INTO location_options (category, value) VALUES
  ('baris', 'A'),
  ('baris', 'B'),
  ('baris', 'C'),
  ('baris', 'D'),
  ('rak', '1'),
  ('rak', '2'),
  ('rak', '3'),
  ('rak', '4'),
  ('tingkat', '1'),
  ('tingkat', '2'),
  ('tingkat', '3'),
  ('tingkat', '4'),
  ('petak', '1'),
  ('petak', '2'),
  ('petak', '3'),
  ('petak', '4')
ON CONFLICT (category, value) DO NOTHING;

-- Insert some sample medicines (optional - for testing)
INSERT INTO medicines (name, baris, rak, tingkat, petak) VALUES
  ('Paracetamol 500mg', 'A', '1', '2', '3'),
  ('Amoxicillin 500mg', 'B', '2', '1', '4'),
  ('Ibuprofen 400mg', NULL, NULL, NULL, NULL),
  ('Metformin 850mg', 'A', '3', '2', '1')
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_options ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (since no auth is required)
-- WARNING: This allows anyone to read/write. Adjust based on your security needs.
CREATE POLICY "Allow all operations on medicines" ON medicines
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on location_options" ON location_options
  FOR ALL USING (true) WITH CHECK (true);
