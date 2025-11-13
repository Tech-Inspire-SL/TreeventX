
import { notFound } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/server';
import { cookies } from 'next/headers';
import { EventHubHeader } from './components/event-hub-header';
import { EventHubHero } from './components/event-hub-hero';
import { EventHubCountdown } from './components/event-hub-countdown';
import { EventHubStats } from './components/event-hub-stats';
import { EventHubCTA } from './components/event-hub-cta';
import { EventHubFooter } from './components/event-hub-footer';

async function getEventDetails(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: event, error } = await supabase
    .from('events')
    .select('*, organization:organizations(id, name, description, website, logo_url, cover_image_url)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching event:', error);
    return null;
  }

  return event;
}

export default async function EventHubPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventDetails(id);

  if (!event || !event.organization_id) { // Check if event or organization_id is missing
    notFound();
  }

  // For now, we assume all events with an organization_id can have a hub.
  // Later, we might add a check for "premium" organizations.

  return (
    <main>
      <EventHubHeader event={event} />
      <EventHubHero event={event} />
      <EventHubCountdown event={event} />
      <EventHubStats event={event} />
      <EventHubCTA event={event} />
      <EventHubFooter event={event} />
    </main>
  );
}
