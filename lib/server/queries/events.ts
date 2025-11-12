'use server';

import { createServiceRoleClient } from '@/app/lib/supabase/server';
import { cookies } from 'next/headers';

export async function getTicketDetails(ticketId: number): Promise<{ data: any; error: string | null }> {
  const cookieStore = await cookies();
  const supabase = createServiceRoleClient(cookieStore);

  const { data, error } = await supabase
    .from('tickets')
    .select(`
      *,
      events (
        id,
        title,
        date,
        location,
        cover_image,
        is_paid,
        price,
        organization_id,
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

  return { data, error: null };
}

export async function getEventDetails(eventId: number): Promise<{ data: any; error: string | null }> {
  console.log(`Fetching details for event ${eventId}...`);

  // Simulate fetching data
  await new Promise(resolve => setTimeout(resolve, 1000));

  const cookieStore = await cookies();
  const supabase = createServiceRoleClient(cookieStore);

  const { data, error } = await supabase
    .from('events')
    .select('*, organization:organizations(*)')
    .eq('id', eventId)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function getEventFormFields(eventId: number): Promise<{ data: any[]; error: string | null }> {
    console.log(`Fetching form fields for event ${eventId}...`);

    // Simulate fetching data
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        data: [],
        error: null,
    };
}
