// Premium Event Templates and Community Features Types

// Base Event interface based on database schema
export interface Event {
  id: number;
  created_at: string;
  title: string;
  description?: string;
  welcome_message?: string;
  date: string;
  end_date?: string;
  location?: string;
  cover_image?: string;
  ticket_brand_logo?: string;
  ticket_brand_color?: string;
  organizer_id: string;
  organization_id?: number;
  capacity?: number;
  is_paid: boolean;
  price?: number;
  is_public: boolean;
  requires_approval: boolean;
  ticket_background_image?: string;
  fee_bearer: string;
  status: string;
}

export interface EventTemplate {
  id: number;
  name: string;
  description?: string;
  template_type: 'basic' | 'premium' | 'community_hub';
  is_active: boolean;
  features: Record<string, boolean>;
  price_tier: 'free' | 'premium' | 'enterprise';
  created_at: string;
  updated_at: string;
}

export interface EventCommunityFeature {
  id: number;
  event_id: number;
  feature_type: 'gallery' | 'timeline' | 'comments' | 'feedback' | 'resources' | 'newsletter';
  is_enabled: boolean;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface EventGalleryItem {
  id: number;
  event_id: number;
  image_url: string;
  caption?: string;
  uploaded_by: string;
  upload_date: string;
  is_featured: boolean;
  likes_count: number;
  created_at: string;
}

export interface EventTimelineItem {
  id: number;
  event_id: number;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  location?: string;
  speaker?: string;
  session_type: 'keynote' | 'workshop' | 'break' | 'networking';
  is_published: boolean;
  order_index: number;
  created_at: string;
}

export interface EventComment {
  id: number;
  event_id: number;
  user_id: string;
  comment_text: string;
  parent_comment_id?: number;
  likes_count: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  replies?: EventComment[];
  user?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

export interface EventFeedback {
  id: number;
  event_id: number;
  user_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  feedback_text?: string;
  category: 'overall' | 'organization' | 'content' | 'venue';
  is_anonymous: boolean;
  submitted_at: string;
}

export interface EventResource {
  id: number;
  event_id: number;
  title: string;
  description?: string;
  resource_type: 'document' | 'link' | 'video' | 'presentation';
  resource_url: string;
  file_size?: number;
  is_public: boolean;
  download_count: number;
  uploaded_by: string;
  created_at: string;
}

export interface EventNewsletterSubscriber {
  id: number;
  event_id: number;
  email: string;
  user_id?: string;
  subscribed_at: string;
  is_active: boolean;
  preferences: Record<string, unknown>;
}

export interface PremiumEventData extends Event {
  template?: EventTemplate;
  template_settings: Record<string, unknown>;
  community_enabled: boolean;
  premium_features_enabled: boolean;
  community_features: EventCommunityFeature[];
  gallery?: EventGalleryItem[];
  timeline?: EventTimelineItem[];
  comments?: (EventComment & { user?: { first_name?: string; last_name?: string; email?: string } })[];
  feedback?: EventFeedback[];
  resources?: EventResource[];
  newsletter_subscribers?: EventNewsletterSubscriber[];
  feedback_summary?: {
    average_rating: number;
    total_feedback: number;
    ratings_breakdown: Record<number, number>;
  };
  attendees?: number;
  organizer?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  organization?: {
    id: number;
    name: string;
    description?: string;
    website?: string;
    location?: string;
  };
}