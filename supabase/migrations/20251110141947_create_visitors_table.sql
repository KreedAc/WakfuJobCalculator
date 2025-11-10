/*
  # Create visitors tracking table

  1. New Tables
    - `visitors`
      - `id` (uuid, primary key)
      - `ip_address` (text) - indirizzo IP del visitatore
      - `user_agent` (text) - browser/device info
      - `visited_at` (timestamp) - quando ha visitato
      - `page` (text) - pagina visitata
  2. Security
    - Enable RLS on `visitors` table
    - Add policy to allow anyone to insert visitor data
    - Add policy to allow authenticated users to view stats
*/

CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text,
  user_agent text,
  visited_at timestamptz DEFAULT now(),
  page text DEFAULT '/'
);

ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert visits"
  ON visitors
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all visits"
  ON visitors
  FOR SELECT
  TO authenticated
  USING (true);
