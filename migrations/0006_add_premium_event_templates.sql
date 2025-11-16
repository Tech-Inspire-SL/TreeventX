-- Migration: Add Premium Event Templates and Community Features
-- This adds support for premium event page templates with community features

-- Create event templates table
CREATE TABLE IF NOT EXISTS event_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  template_type VARCHAR(50) NOT NULL, -- 'basic', 'premium', 'community_hub'
  is_active BOOLEAN DEFAULT true,
  features JSONB DEFAULT '{}', -- Store template features as JSON
  price_tier VARCHAR(20) DEFAULT 'free', -- 'free', 'premium', 'enterprise'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add template support to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS template_id INTEGER REFERENCES event_templates(id);
ALTER TABLE events ADD COLUMN IF NOT EXISTS template_settings JSONB DEFAULT '{}';
ALTER TABLE events ADD COLUMN IF NOT EXISTS community_enabled BOOLEAN DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS premium_features_enabled BOOLEAN DEFAULT false;

-- Create event community features table
CREATE TABLE IF NOT EXISTS event_community_features (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  feature_type VARCHAR(50) NOT NULL, -- 'gallery', 'timeline', 'comments', 'feedback', 'resources', 'newsletter'
  is_enabled BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, feature_type)
);

-- Create event gallery for premium events
CREATE TABLE IF NOT EXISTS event_gallery (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  uploaded_by VARCHAR(255), -- User ID or name
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event timeline/schedule for premium events  
CREATE TABLE IF NOT EXISTS event_timeline (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  location VARCHAR(200),
  speaker VARCHAR(100),
  session_type VARCHAR(50), -- 'keynote', 'workshop', 'break', 'networking'
  is_published BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event comments/discussions
CREATE TABLE IF NOT EXISTS event_comments (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL, -- From profiles table
  comment_text TEXT NOT NULL,
  parent_comment_id INTEGER REFERENCES event_comments(id), -- For replies
  likes_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event feedback system
CREATE TABLE IF NOT EXISTS event_feedback (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  category VARCHAR(50), -- 'overall', 'organization', 'content', 'venue'
  is_anonymous BOOLEAN DEFAULT false,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event resources for sharing documents/links
CREATE TABLE IF NOT EXISTS event_resources (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  resource_type VARCHAR(50) NOT NULL, -- 'document', 'link', 'video', 'presentation'
  resource_url TEXT NOT NULL,
  file_size BIGINT, -- For documents
  is_public BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  uploaded_by VARCHAR(255), -- User ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter subscribers for events
CREATE TABLE IF NOT EXISTS event_newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  user_id VARCHAR(255), -- Optional, if user has account
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  preferences JSONB DEFAULT '{}', -- Email preferences
  UNIQUE(event_id, email)
);

-- Insert default templates
INSERT INTO event_templates (name, description, template_type, features, price_tier) VALUES 
('Basic Event Page', 'Simple event page with essential information and registration', 'basic', '{"registration": true, "basic_info": true}', 'free'),
('Premium Community Hub', 'Full-featured event community with gallery, timeline, discussions', 'premium', '{"gallery": true, "timeline": true, "comments": true, "feedback": true, "resources": true, "newsletter": true, "custom_branding": true}', 'premium'),
('Enterprise Template', 'Advanced template with custom domains and white-labeling', 'community_hub', '{"all_premium_features": true, "custom_domain": true, "white_label": true, "advanced_analytics": true}', 'enterprise');

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_template_id ON events(template_id);
CREATE INDEX IF NOT EXISTS idx_event_gallery_event_id ON event_gallery(event_id);
CREATE INDEX IF NOT EXISTS idx_event_timeline_event_id ON event_timeline(event_id);
CREATE INDEX IF NOT EXISTS idx_event_comments_event_id ON event_comments(event_id);
CREATE INDEX IF NOT EXISTS idx_event_feedback_event_id ON event_feedback(event_id);
CREATE INDEX IF NOT EXISTS idx_event_resources_event_id ON event_resources(event_id);

-- Add RLS policies
ALTER TABLE event_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_community_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Templates are publicly viewable
CREATE POLICY "Event templates are viewable by everyone" ON event_templates FOR SELECT USING (true);

-- Community features accessible to event organizers and attendees
CREATE POLICY "Event organizers can manage community features" ON event_community_features 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = event_community_features.event_id 
    AND events.organizer_id = auth.uid()
  )
);

-- Gallery policies - organizers and attendees can view, only organizers can manage
CREATE POLICY "Anyone can view event gallery" ON event_gallery FOR SELECT USING (true);
CREATE POLICY "Event organizers can manage gallery" ON event_gallery 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = event_gallery.event_id 
    AND events.organizer_id = auth.uid()
  )
);

-- Similar policies for other tables...
CREATE POLICY "Anyone can view event timeline" ON event_timeline FOR SELECT USING (is_published = true);
CREATE POLICY "Event organizers can manage timeline" ON event_timeline 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = event_timeline.event_id 
    AND events.organizer_id = auth.uid()
  )
);

-- Comments - viewable by all, creatable by authenticated users
CREATE POLICY "Anyone can view approved comments" ON event_comments 
FOR SELECT USING (is_approved = true);

CREATE POLICY "Authenticated users can create comments" ON event_comments 
FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own comments" ON event_comments 
FOR UPDATE USING (auth.uid()::text = user_id);