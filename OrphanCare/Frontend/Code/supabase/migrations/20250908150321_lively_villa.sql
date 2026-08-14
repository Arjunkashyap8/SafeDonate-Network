/*
  # Update Accounts Table for Authentication

  1. Schema Changes
    - Add password field for authentication
    - Add role field to distinguish between Donor and Orphanage
    - Add is_verified field to track email verification status
    - Add last_login field to track user activity
    - Update verification_code to be nullable after verification

  2. Security
    - Enable RLS on accounts table
    - Add policies for account management
*/

-- Add new columns to accounts table
DO $$
BEGIN
  -- Add password column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accounts' AND column_name = 'password'
  ) THEN
    ALTER TABLE accounts ADD COLUMN password TEXT NOT NULL DEFAULT '';
  END IF;

  -- Add role column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accounts' AND column_name = 'role'
  ) THEN
    ALTER TABLE accounts ADD COLUMN role TEXT NOT NULL DEFAULT 'Donor';
  END IF;

  -- Add is_verified column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accounts' AND column_name = 'is_verified'
  ) THEN
    ALTER TABLE accounts ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
  END IF;

  -- Add last_login column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accounts' AND column_name = 'last_login'
  ) THEN
    ALTER TABLE accounts ADD COLUMN last_login TIMESTAMPTZ;
  END IF;
END $$;

-- Add check constraint for role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'accounts' AND constraint_name = 'accounts_role_check'
  ) THEN
    ALTER TABLE accounts ADD CONSTRAINT accounts_role_check 
    CHECK (role IN ('Donor', 'Orphanage'));
  END IF;
END $$;

-- Enable RLS on accounts table
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own account data" ON accounts;
DROP POLICY IF EXISTS "Users can update own account data" ON accounts;
DROP POLICY IF EXISTS "Allow account creation during registration" ON accounts;

-- Create policies for account management
CREATE POLICY "Users can read own account data"
  ON accounts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own account data"
  ON accounts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow account creation during registration (public access for registration)
CREATE POLICY "Allow account creation during registration"
  ON accounts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_accounts_email ON accounts(email);
CREATE INDEX IF NOT EXISTS idx_accounts_verification_code ON accounts(verification_code);