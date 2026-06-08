/*
  # Fix visitor RLS policies

  1. Issue
    - The current INSERT policy has an overly restrictive timestamp condition
    - The condition prevents legitimate inserts of visitor records
    - This breaks the visitor tracking functionality

  2. Changes
    - Drop existing restrictive INSERT policy
    - Create new permissive INSERT policy that allows anonymous users to insert visitor records
    - Keep SELECT policies as-is (they are working correctly)

  3. Security
    - Allows anonymous users to INSERT visitor records (needed for tracking)
    - Allows anonymous users to SELECT (for counting visitors)
    - Maintains RLS protection on the table
*/

-- Drop the overly restrictive INSERT policy
DROP POLICY IF EXISTS "Allow visitor tracking" ON visitors;

-- Create new permissive INSERT policy for visitor tracking
CREATE POLICY "Allow anonymous visitor tracking"
  ON visitors
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
