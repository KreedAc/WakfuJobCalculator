/*
  # Icons Catalog Table

  1. New Tables
    - `icons`
      - `id` (uuid, primary key) - Unique identifier
      - `filename` (text, unique, not null) - Icon filename (e.g., "agua.png")
      - `category` (text) - Category of icon (e.g., "slot", "stone", "character")
      - `public_path` (text, not null) - Path in public folder
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `icons` table
    - Add policy for public read access (icons are public assets)

  3. Indexes
    - Index on filename for quick lookups

  This table serves as a catalog/backup reference for all game icons stored in the public folder.
*/

CREATE TABLE IF NOT EXISTS icons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text UNIQUE NOT NULL,
  category text,
  public_path text NOT NULL DEFAULT '/icons/',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE icons ENABLE ROW LEVEL SECURITY;

-- Allow public read access to icons catalog
CREATE POLICY "Icons are publicly readable"
  ON icons
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create index for filename lookups
CREATE INDEX IF NOT EXISTS idx_icons_filename ON icons(filename);
CREATE INDEX IF NOT EXISTS idx_icons_category ON icons(category);