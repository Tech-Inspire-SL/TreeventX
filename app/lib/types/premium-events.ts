// Types for Premium Event Templates and Community Features
export interface EventTemplate {
  id: number;
  name: string;
  description: string;
  template_type: 'basic' | 'premium' | 'community_hub';
  is_active: boolean;
  features: TemplateFeatures;
  price_tier: 'free' | 'premium' | 'enterprise';
  created_at: string;
  updated_at: string;
}

export interface TemplateFeatures {
  registration?: boolean;
  basic_info?: boolean;
  gallery?: boolean;
  timeline?: boolean;
  comments?: boolean;
  feedback?: boolean;
  resources?: boolean;
  newsletter?: boolean;
  custom_branding?: boolean;
  all_premium_features?: boolean;
  custom_domain?: boolean;
  white_label?: boolean;
  advanced_analytics?: boolean;
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
  uploaded_by?: string;
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
  session_type: 'keynote' | 'workshop' | 'break' | 'networking' | 'other';
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
  user?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  replies?: EventComment[];
}

export interface EventFeedback {
  id: number;
  event_id: number;
  user_id: string;
  rating: number; // 1-5
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
  uploaded_by?: string;
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

// Extended Event type with premium features
export interface PremiumEvent extends Event {
  template_id?: number;
  template_settings?: Record<string, unknown>;
  community_enabled: boolean;
  premium_features_enabled: boolean;
  template?: EventTemplate;
  community_features?: EventCommunityFeature[];
  gallery?: EventGalleryItem[];
  timeline?: EventTimelineItem[];
  comments?: EventComment[];
  feedback_summary?: {
    average_rating: number;
    total_feedback: number;
    ratings_breakdown: Record<number, number>;
  };
  resources?: EventResource[];
  newsletter_subscribers?: number;
}