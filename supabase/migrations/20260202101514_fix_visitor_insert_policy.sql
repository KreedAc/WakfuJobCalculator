/*
  # Fix visitor insert policy

  1. Changes
    - Drop the existing insert policy that has an incorrect check on the id field
    - Create a new insert policy that allows anonymous and authenticated users to insert visitor records
    - The new policy removes the problematic id check (id = gen_random_uuid() was always false)
    - Keeps the visited_at validation to prevent backdating or future-dating records

  2. Security
    - Maintains RLS protection
    - Allows public visitor tracking
    - Validates timestamp to prevent abuse
*/

DROP POLICY IF EXISTS "Allow visitor tracking with validation" ON visitors;

CREATE POLICY "Allow visitor tracking"
  ON visitors
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    visited_at IS NULL OR (
      visited_at <= (now() + interval '1 minute') AND
      visited_at >= (now() - interval '1 minute')
    )
  );
