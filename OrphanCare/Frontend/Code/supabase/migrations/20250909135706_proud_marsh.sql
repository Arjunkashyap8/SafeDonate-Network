/*
  # Fix donors table structure

  1. Changes
    - Update donors table to match the expected structure
    - Ensure proper foreign key relationships
    - Add missing columns if needed

  2. Security
    - Maintain existing RLS policies
    - Ensure data integrity
*/

-- Update donors table structure if needed
DO $$
BEGIN
  -- Check if donor_name column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'donors' AND column_name = 'donor_name'
  ) THEN
    ALTER TABLE donors ADD COLUMN donor_name text NOT NULL DEFAULT '';
  END IF;

  -- Check if phone_number column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'donors' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE donors ADD COLUMN phone_number text;
  END IF;

  -- Check if donation_pref column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'donors' AND column_name = 'donation_pref'
  ) THEN
    ALTER TABLE donors ADD COLUMN donation_pref text;
  END IF;
END $$;

-- Update orphanages table structure if needed
DO $$
BEGIN
  -- Check if orphanage_name column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orphanages' AND column_name = 'orphanage_name'
  ) THEN
    ALTER TABLE orphanages ADD COLUMN orphanage_name text NOT NULL DEFAULT '';
  END IF;

  -- Check if location column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orphanages' AND column_name = 'location'
  ) THEN
    ALTER TABLE orphanages ADD COLUMN location text;
  END IF;
END $$;

-- Enable RLS on donors table if not already enabled
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;

-- Create policy for donors to manage their own data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'donors' AND policyname = 'Donors can manage own data'
  ) THEN
    CREATE POLICY "Donors can manage own data"
      ON donors
      FOR ALL
      TO authenticated
      USING (account_id IN (
        SELECT id FROM accounts WHERE user_id = auth.uid()
      ));
  END IF;
END $$;

-- Enable RLS on orphanages table if not already enabled
ALTER TABLE orphanages ENABLE ROW LEVEL SECURITY;

-- Create policy for orphanages to manage their own data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orphanages' AND policyname = 'Orphanages can manage own data'
  ) THEN
    CREATE POLICY "Orphanages can manage own data"
      ON orphanages
      FOR ALL
      TO authenticated
      USING (account_id IN (
        SELECT id FROM accounts WHERE user_id = auth.uid()
      ));
  END IF;
END $$;

-- Enable RLS on Bank_details table if not already enabled
ALTER TABLE "Bank_details" ENABLE ROW LEVEL SECURITY;

-- Create policy for bank details access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'Bank_details' AND policyname = 'Orphanages can manage own bank details'
  ) THEN
    CREATE POLICY "Orphanages can manage own bank details"
      ON "Bank_details"
      FOR ALL
      TO authenticated
      USING (id IN (
        SELECT bank_details_id FROM orphanages 
        WHERE account_id IN (
          SELECT id FROM accounts WHERE user_id = auth.uid()
        )
      ));
  END IF;
END $$;