import type {
  CountdownState,
  EventCommunityFeature,
  EventTemplate,
  PremiumEventData,
} from '@/lib/types/premium';

const DEFAULT_EVENT_ID = 999;

const isoTimestamp = () => new Date().toISOString();
const futureDate = (daysAhead: number) =>
  new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString();

export const mockTemplates: EventTemplate[] = [
  {
    id: 1,
    name: 'Basic Event Page',
    description: 'Simple event page with essential information and registration',
    template_type: 'basic',
    is_active: true,
    features: { registration: true, basic_info: true },
    price_tier: 'free',
    created_at: isoTimestamp(),
    updated_at: isoTimestamp(),
  },
  {
    id: 2,
    name: 'Premium Community Hub',
    description: 'Full-featured event community with gallery, timeline, discussions',
    template_type: 'premium',
    is_active: true,
    features: {
      gallery: true,
      timeline: true,
      comments: true,
      feedback: true,
      resources: true,
      newsletter: true,
      custom_branding: true,
    },
    price_tier: 'premium',
    created_at: isoTimestamp(),
    updated_at: isoTimestamp(),
  },
  {
    id: 3,
    name: 'Enterprise Template',
    description: 'Advanced template with custom domains and white-labeling',
    template_type: 'community_hub',
    is_active: true,
    features: {
      all_premium_features: true,
      custom_domain: true,
      white_label: true,
      advanced_analytics: true,
    },
    price_tier: 'enterprise',
    created_at: isoTimestamp(),
    updated_at: isoTimestamp(),
  },
];

export const mockEvent: PremiumEventData = {
  id: DEFAULT_EVENT_ID,
  created_at: isoTimestamp(),
  title: 'TreeventX Premium Demo Event',
  welcome_message: 'Welcome to the ultimate hackathon community experience.',
  description:
    'Experience the power of premium event pages with our interactive demo showcasing community features, beautiful design, and advanced functionality.',
  date: futureDate(7),
  end_date: futureDate(8),
  location: 'Freetown, Sierra Leone',
  cover_image:
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=400&fit=crop',
  ticket_brand_logo: undefined,
  ticket_brand_color: undefined,
  organizer_id: 'demo-organizer',
  organization_id: undefined,
  capacity: 500,
  is_paid: false,
  price: 0,
  is_public: true,
  requires_approval: false,
  ticket_background_image: undefined,
  fee_bearer: 'organizer',
  status: 'published',
  template_settings: {},
  community_enabled: true,
  premium_features_enabled: true,
  community_features: [],
  gallery: [],
  timeline: [],
  comments: [],
  feedback: [],
  resources: [],
  newsletter_subscribers: [],
  attendees: 142,
  template: mockTemplates[1],
};

export const createDefaultCommunityFeatures = (): EventCommunityFeature[] => {
  const generatedAt = isoTimestamp();

  return [
    {
      id: 1,
      event_id: DEFAULT_EVENT_ID,
      feature_type: 'gallery',
      is_enabled: true,
      settings: {},
      created_at: generatedAt,
      updated_at: generatedAt,
    },
    {
      id: 2,
      event_id: DEFAULT_EVENT_ID,
      feature_type: 'timeline',
      is_enabled: true,
      settings: {},
      created_at: generatedAt,
      updated_at: generatedAt,
    },
    {
      id: 3,
      event_id: DEFAULT_EVENT_ID,
      feature_type: 'comments',
      is_enabled: true,
      settings: {},
      created_at: generatedAt,
      updated_at: generatedAt,
    },
    {
      id: 4,
      event_id: DEFAULT_EVENT_ID,
      feature_type: 'feedback',
      is_enabled: true,
      settings: {},
      created_at: generatedAt,
      updated_at: generatedAt,
    },
    {
      id: 5,
      event_id: DEFAULT_EVENT_ID,
      feature_type: 'resources',
      is_enabled: true,
      settings: {},
      created_at: generatedAt,
      updated_at: generatedAt,
    },
    {
      id: 6,
      event_id: DEFAULT_EVENT_ID,
      feature_type: 'newsletter',
      is_enabled: true,
      settings: {},
      created_at: generatedAt,
      updated_at: generatedAt,
    },
  ];
};
