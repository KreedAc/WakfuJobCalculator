/*
  # Allow public access to visitor count

  1. Changes
    - Add policy to allow anonymous users to read visitor count
    - This enables the public visitor counter on the website

  2. Security
    - Anonymous users can only SELECT (read) data
    - No sensitive information is exposed
*/

CREATE POLICY "Anyone can view visitor stats"
  ON visitors
  FOR SELECT
  TO anon
  USING (true);
