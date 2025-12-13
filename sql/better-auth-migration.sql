-- Better Auth Migration SQL for Supabase
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. Add missing columns to existing users table
-- ============================================

-- Add email_verified column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- Add updated_at column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ============================================
-- 2. Create session table for Better Auth
-- ============================================

CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(uuid) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster session lookups
CREATE INDEX IF NOT EXISTS idx_session_user_id ON session(user_id);
CREATE INDEX IF NOT EXISTS idx_session_token ON session(token);
CREATE INDEX IF NOT EXISTS idx_session_expires_at ON session(expires_at);

-- ============================================
-- 3. Create account table for OAuth providers
-- ============================================

CREATE TABLE IF NOT EXISTS account (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(uuid) ON DELETE CASCADE,
    account_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    access_token_expires_at TIMESTAMP WITH TIME ZONE,
    refresh_token_expires_at TIMESTAMP WITH TIME ZONE,
    scope TEXT,
    id_token TEXT,
    password TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(provider_id, account_id)
);

-- Create index for faster account lookups
CREATE INDEX IF NOT EXISTS idx_account_user_id ON account(user_id);
CREATE INDEX IF NOT EXISTS idx_account_provider ON account(provider_id, account_id);

-- ============================================
-- 4. Create verification table
-- ============================================

CREATE TABLE IF NOT EXISTS verification (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for verification lookups
CREATE INDEX IF NOT EXISTS idx_verification_identifier ON verification(identifier);
CREATE INDEX IF NOT EXISTS idx_verification_expires_at ON verification(expires_at);

-- ============================================
-- 5. Enable Row Level Security (RLS) - Optional
-- ============================================

-- Enable RLS on session table
ALTER TABLE session ENABLE ROW LEVEL SECURITY;

-- Enable RLS on account table
ALTER TABLE account ENABLE ROW LEVEL SECURITY;

-- Enable RLS on verification table
ALTER TABLE verification ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. Create RLS Policies - Optional
-- These allow the service role to access all data
-- ============================================

-- Session policies
CREATE POLICY "Service role can manage sessions" ON session
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Account policies
CREATE POLICY "Service role can manage accounts" ON account
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Verification policies
CREATE POLICY "Service role can manage verifications" ON verification
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Notes:
-- ============================================
-- 1. Run this SQL in your Supabase Dashboard > SQL Editor
-- 2. The users table already exists, we just add missing columns
-- 3. The session, account, and verification tables are new
-- 4. RLS is enabled but policies allow full access via service role
-- 5. Make sure you're using the service role key in your .env
