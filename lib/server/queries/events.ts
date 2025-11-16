'use server';

import { createServiceRoleClient } from '@/app/lib/supabase/server';
import type { Event, TicketWithRelations } from '@/app/lib/types';
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
      )
    `)
    .eq('id', ticketId)
    .single();

  if (error) {
    console.error('Error fetching ticket details:', error);
    return { data: null, error: error.message };
  }

  return { data: data as TicketWithRelations, error: null };
}

export async function getEventDetails(eventId: number): Promise<{
  data: (Event & { pin_hash?: string | null }) | null;
  error: string | null;
}> {
  console.log(`Fetching details for event ${eventId}...`);

  // Simulate fetching data
  await new Promise(resolve => setTimeout(resolve, 1000));

  const cookieStore = await cookies();
  const supabase = await createServiceRoleClient(cookieStore);

  const { data, error } = await supabase
    .from('events')
    .select('*, pin_hash, organization:organizations(*)')
    .eq('id', eventId)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Event & { pin_hash?: string | null }, error: null };
}

export async function getEventFormFields(eventId: number): Promise<{ data: unknown[]; error: string | null }> {
    console.log(`Fetching form fields for event ${eventId}...`);

    // Simulate fetching data
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        data: [],
        error: null,
    };
}
