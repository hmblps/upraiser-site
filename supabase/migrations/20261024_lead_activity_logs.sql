-- UPRAISER Telemetry & High-Intent Lead Activity Logs
-- Migration: 20261024_lead_activity_logs.sql (100% Additive & Safe)

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

-- 3. Security (Row Level Security)
ALTER TABLE lead_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notification_cooldowns ENABLE ROW LEVEL SECURITY;

-- 4. Safe Idempotent Policies (No DROP statements)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'lead_activity_logs' 
      AND policyname = 'Service role full access on lead_activity_logs'
  ) THEN
    CREATE POLICY "Service role full access on lead_activity_logs"
      ON lead_activity_logs
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'lead_notification_cooldowns' 
      AND policyname = 'Service role full access on lead_notification_cooldowns'
  ) THEN
    CREATE POLICY "Service role full access on lead_notification_cooldowns"
      ON lead_notification_cooldowns
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'lead_activity_logs' 
      AND policyname = 'Anon insert on lead_activity_logs'
  ) THEN
    CREATE POLICY "Anon insert on lead_activity_logs"
      ON lead_activity_logs
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END $$;
