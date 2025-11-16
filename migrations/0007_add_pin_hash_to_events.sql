-- Migration: Add PIN hash to events table
-- This adds a column to store a hashed PIN for event management security.

ALTER TABLE events
ADD COLUMN IF NOT EXISTS pin_hash TEXT;
