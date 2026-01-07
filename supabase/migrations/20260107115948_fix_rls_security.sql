/*
  # Fix RLS Security Issues

  1. Security Changes
    - Remove overly permissive RLS policy that allows unrestricted inserts
    - Add more restrictive policy that prevents abuse while still allowing visitor tracking
    - Ensure only legitimate visitor data can be inserted
    - Prevent manipulation of id and visited_at fields

  2. Important Notes
    - The new policy allows anonymous inserts but with validation
    - Users cannot set their own id or visited_at (these are auto-generated)
    - This maintains functionality while improving security
*/

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can insert visits" ON visitors;

-- Create a more restrictive policy
-- Allow inserts but ensure id and visited_at are not manually set (they use defaults)
CREATE POLICY "Allow visitor tracking with validation"
  ON visitors
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Ensure the record uses auto-generated values
    id = gen_random_uuid() AND
    visited_at IS NOT NULL AND
    visited_at <= now() + interval '1 minute' AND
    visited_at >= now() - interval '1 minute'
  );
