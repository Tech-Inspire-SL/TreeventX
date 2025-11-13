'use server';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { EventsClientPage } from './_components/events-client-page';
import { cookies } from 'next/headers';

async function getEventsData() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      allEvents: [],
      myEvents: [],
      registeredEvents: [],
      pastEvents: [],
      user: null
    };
  }

  // Common function to get attendee counts
  const getCounts = async (eventIds: number[]) => {
    if (eventIds.length === 0) return new Map();
    const { data: counts, error } = await supabase.rpc('get_event_attendee_counts', { event_ids: eventIds });
    if (error) {
      console.error('Error fetching attendee counts:', error);
      return new Map();
    }
    return new Map(counts.map((c: { event_id_out: number, attendee_count: number }) => [c.event_id_out, c.attendee_count]));
  };

  // Fetch all public events
  const { data: publicEventsData, error: publicEventsError } = await supabase
    .from('events')
    .select('*, organization:organizations(name)')
    .eq('is_public', true)
    .order('date', { ascending: false });

  if (publicEventsError) console.error('Error fetching public events:', publicEventsError);

  const publicEventIds = publicEventsData?.map(e => e.id) || [];
  const publicCountsMap = await getCounts(publicEventIds);

  const allEvents = publicEventsData?.map(e => ({
    ...e,
    attendees: publicCountsMap.get(e.id) || 0,
  })) || [];

  // Fetch user's events
  const { data: myEventsData, error: myEventsError } = await supabase
    .from('events')
    .select('*, organization:organizations(name)')
    .eq('organizer_id', user.id)
    .order('date', { ascending: false });
  
  if (myEventsError) console.error('Error fetching my events:', myEventsError);

  const myEventIds = myEventsData?.map(e => e.id) || [];
  const myCountsMap = await getCounts(myEventIds);

  const myEvents = myEventsData?.map(e => ({
    ...e,
    attendees: myCountsMap.get(e.id) || 0,
  })) || [];

  // Fetch registered events
  const { data: registeredTickets, error: registeredError } = await supabase
    .from('tickets')
    .select('id, events!inner(*, organization:organizations(name))')
    .eq('user_id', user.id);

  if (registeredError) console.error('Error fetching registered events:', registeredError);

  const registeredEventIds = registeredTickets?.map(t => t.events.id) || [];
  const registeredCountsMap = await getCounts(registeredEventIds);

  const registeredEvents = registeredTickets?.map(t => ({
    ...t.events,
    ticket_id: t.id,
    attendees: registeredCountsMap.get(t.events.id) || 0,
  })) || [];


  // Fetch past events (both organized and attended)
  const { data: pastData } = await supabase.rpc('get_past_events_for_user', { p_user_id: user.id });

  return {
    allEvents,
    myEvents,
    registeredEvents,
    pastEvents: pastData || [],
    user,
  };
}

export default async function EventsPage() {
  const props = await getEventsData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
            Events
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discover, create, and manage your events
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/events/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <EventsClientPage {...props} />
    </div>
  );
}
