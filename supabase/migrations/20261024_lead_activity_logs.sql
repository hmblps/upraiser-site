-- UPRAISER Telemetry & High-Intent Lead Activity Logs
-- Migration: 20261024_lead_activity_logs.sql

-- 1. Main Lead Activity Log Table
CREATE TABLE IF NOT EXISTS lead_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  lead_name TEXT,
  lead_contact TEXT,
  event_type TEXT NOT NULL,
  duration_seconds INT DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for rapid visitor session aggregation and digest queries
CREATE INDEX IF NOT EXISTS idx_lead_activity_visitor_time ON lead_activity_logs (visitor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_activity_event_type ON lead_activity_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_lead_activity_created_at ON lead_activity_logs (created_at DESC);

-- 2. 12-Hour Cooldown & Digest Tracker Table
CREATE TABLE IF NOT EXISTS lead_notification_cooldowns (
  visitor_id TEXT PRIMARY KEY,
  last_notified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_event_type TEXT,
  total_notifications INT DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 3. Security (RLS)
ALTER TABLE lead_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notification_cooldowns ENABLE ROW LEVEL SECURITY;

-- Service role policies (used by /api/activity and /api/contact via SUPABASE_SERVICE_ROLE_KEY)
DROP POLICY IF EXISTS "Service role full access on lead_activity_logs" ON lead_activity_logs;
CREATE POLICY "Service role full access on lead_activity_logs"
  ON lead_activity_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on lead_notification_cooldowns" ON lead_notification_cooldowns;
CREATE POLICY "Service role full access on lead_notification_cooldowns"
  ON lead_notification_cooldowns
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anonymous inserts if client-side Supabase client is used as direct fallback
DROP POLICY IF EXISTS "Anon insert on lead_activity_logs" ON lead_activity_logs;
CREATE POLICY "Anon insert on lead_activity_logs"
  ON lead_activity_logs
  FOR INSERT
  TO anon
  WITH CHECK (true);
