'use server';

import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import type { EventWithAttendees, TicketWithRelations } from '@/app/lib/types';
import { cookies } from 'next/headers';

export async function getTicketDetails(ticketId: number): Promise<{
  data: TicketWithRelations | null;
  error: string | null;
}> {
  const cookieStore = await cookies();
  const supabase = await createServiceRoleClient(cookieStore);

  const { data, error } = await supabase
    .from('tickets')
    .select(`
      *,
      events (
        id,
        title,
        description,
        date,
        location,
        cover_image,
        is_paid,
        price,
        organization_id,
        ticket_brand_logo,
        ticket_brand_color,
        ticket_background_image,
        organization:organizations(name)
      ),
      profiles (
        id,
        first_name,
        last_name,
        email,
        is_guest
      ),
      form_responses:attendee_form_responses (
        field_value,
        event_form_fields (
          field_name
        )
      )
    `)
    .eq('id', ticketId)
    .single();

  if (error) {
    console.error('Error fetching ticket details:', error);
    return { data: null, error: error.message };
  }

  const normalizedTicket = data as TicketWithRelations;
  if (!normalizedTicket.form_responses) {
    normalizedTicket.form_responses = [];
  }
  return { data: normalizedTicket, error: null };
}

export async function getEventDetails(eventId: number): Promise<{
  data: (EventWithAttendees & { pin_hash?: string | null }) | null;
  error: string | null;
}> {
  const cookieStore = await cookies();
  const supabase = await createServiceRoleClient(cookieStore);

  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      requires_approval,
      scanners:event_scanners(*, profiles(email)),
      event_form_fields(*, options:event_form_field_options(*)),
      community_features:event_community_features(feature_type, is_enabled),
      organizer:profiles!events_organizer_id_fkey(id, first_name, last_name, email),
      organization:organizations(id, name, description, website, location)
    `)
    .eq('id', eventId)
    .single();

  if (error || !data) {
    return { data: null, error: error?.message || 'Event not found' };
  }

  const { count: attendeeCount, error: attendeeError } = await supabase
    .from('tickets')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId);

  if (attendeeError) {
    return { data: null, error: attendeeError.message };
  }

  const processedData = {
    ...data,
    organizer: Array.isArray(data.organizer) ? data.organizer[0] : data.organizer,
    organization: Array.isArray(data.organization) ? data.organization[0] : data.organization,
    attendees: attendeeCount ?? 0,
    community_features: data.community_features || [],
  } as EventWithAttendees & { pin_hash?: string | null };

  return { data: processedData, error: null };
}

export async function getEventFormFields(eventId: number): Promise<{ data: unknown[]; error: string | null }> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from('event_form_fields')
    .select('*, options:event_form_field_options(*)')
    .eq('event_id', eventId)
    .order('order', { ascending: true });

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: data || [], error: null };
}
