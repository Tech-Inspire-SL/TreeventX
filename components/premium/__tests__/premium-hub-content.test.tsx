import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { PremiumHubContent } from '../premium-hub-content';
import type { CountdownState, EventCommunityFeature, PremiumEventData } from '@/lib/types/premium';

const baseEvent: PremiumEventData = {
  id: 1,
  created_at: '2025-01-01T00:00:00.000Z',
  title: 'Sample Event',
  description: 'Event description',
  welcome_message: 'Welcome to the event',
  date: '2025-04-01T12:00:00.000Z',
  end_date: '2025-04-02T12:00:00.000Z',
  location: 'Freetown',
  cover_image: undefined,
  ticket_brand_logo: undefined,
  ticket_brand_color: undefined,
  organizer_id: 'organizer-1',
  organization_id: undefined,
  capacity: 100,
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
  attendees: 42,
};

const countdown: CountdownState = { days: '07', hours: '12', minutes: '30' };

const features: EventCommunityFeature[] = [
  {
    id: 1,
    event_id: 1,
    feature_type: 'gallery',
    is_enabled: true,
    settings: {},
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-01-01T00:00:00.000Z',
  },
];

describe('PremiumHubContent', () => {
  it('renders hero section content', () => {
    render(
      <PremiumHubContent
        event={baseEvent}
        countdown={countdown}
        communityFeatures={features}
      />,
    );

  expect(screen.getByRole('heading', { level: 2, name: 'Sample Event' })).toBeInTheDocument();
    expect(screen.getByText('Welcome to the event')).toBeInTheDocument();
    expect(screen.getByText('07')).toBeInTheDocument();
    expect(screen.getByText('Days')).toBeInTheDocument();
  });

  it('shows enabled community features', () => {
    render(
      <PremiumHubContent
        event={baseEvent}
        countdown={countdown}
        communityFeatures={features}
      />,
    );

    expect(screen.getByText('gallery')).toBeInTheDocument();
  });

  it('falls back when no features enabled', () => {
    const disabledFeatures = features.map((feature) => ({ ...feature, is_enabled: false }));

    render(
      <PremiumHubContent
        event={baseEvent}
        countdown={countdown}
        communityFeatures={disabledFeatures}
      />,
    );

    expect(
      screen.getByText('Enable community features to surface them here.'),
    ).toBeInTheDocument();
  });
});
