'use server';

import { createClient } from '@/app/lib/supabase/server';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : 'An unexpected error occurred.');

export async function unregisterAttendeeAction(state: { success: boolean; error?: string } | undefined, formData: FormData): Promise<{ success: boolean; error?: string }> {
  console.log('unregisterAttendeeAction called');
  const ticketId = parseInt(formData.get('ticketId') as string, 10);

  if (isNaN(ticketId)) {
    return { success: false, error: 'Invalid ticket ID.' };
  }

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  try {
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', ticketId);

    if (error) {
      console.error('Error unregistering attendee:', error);
      return { success: false, error: `Failed to unregister: ${error.message}` };
    }

    revalidatePath('/dashboard/events'); // Revalidate relevant paths
    revalidatePath('/events');

    return { success: true };
  } catch (error) {
    console.error('Unhandled error in unregisterAttendeeAction:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function approveAttendeeAction(formData: FormData) {
  console.log('approveAttendeeAction called');
  // return { success: true };
}

export async function rejectAttendeeAction(formData: FormData) {
  console.log('rejectAttendeeAction called');
  // return { success: true };
}

export async function resendTicketLinkAction(state: { success: boolean; error?: string } | undefined, formData: FormData): Promise<{ success: boolean; error?: string }> {
  console.log('resendTicketLinkAction called');
  // Placeholder implementation
  const email = formData.get('email') as string;
  const eventId = formData.get('eventId') as string;

  if (!email || !eventId) {
    return { success: false, error: 'Email and Event ID are required.' };
  }

  // Simulate sending email
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (email === 'error@example.com') {
    return { success: false, error: 'Failed to send ticket link.' };
  }

  return { success: true };
}

export async function registerAndCreateTicket(state: { success: boolean; error?: string; ticketId?: number } | undefined, formData: FormData): Promise<{ success: boolean; error?: string; ticketId?: number }> {
  console.log('registerAndCreateTicket called');
  const eventId = parseInt(formData.get('eventId') as string, 10);
  const userId = formData.get('userId') as string;
  const formResponses = JSON.parse(formData.get('formResponses') as string || '[]');
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;

  if (!eventId || !userId || !firstName || !lastName || !email) {
    return { success: false, error: 'Missing required fields for registration.' };
  }

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  try {
    // 1. Create the ticket
    const { data: newTicket, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        event_id: eventId,
        user_id: userId,
        status: 'approved', // Assuming direct approval for now
        qr_token: crypto.randomUUID(), // Generate QR token
      })
      .select('id')
      .single();

    if (ticketError || !newTicket) {
      console.error('Error creating ticket:', ticketError);
      return { success: false, error: `Failed to create ticket: ${ticketError?.message}` };
    }

    // 2. Save form responses
    if (formResponses.length > 0) {
      const responsesToInsert = formResponses.map((response: { form_field_id: string; field_value: string }) => ({
        ticket_id: newTicket.id,
        form_field_id: response.form_field_id,
        field_value: response.field_value,
      }));

      const { error: responsesError } = await supabase
        .from('attendee_form_responses')
        .insert(responsesToInsert);

      if (responsesError) {
        console.error('Error saving form responses:', responsesError);
        // This might not be a critical error, so we just log it.
      }
    }

    // 3. Send confirmation email (placeholder)
    // await sendTicketEmail(email, `Your ticket for Event ID: ${eventId}`, 'Ticket details here');

    revalidatePath(`/events/${eventId}`);
    revalidatePath(`/dashboard/tickets/${newTicket.id}`);

    return { success: true, ticketId: newTicket.id };
  } catch (error) {
    console.error('Unhandled error in registerAndCreateTicket:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function registerGuestForEvent(state: { success: boolean; error?: string; ticketId?: number } | undefined, formData: FormData): Promise<{ success: boolean; error?: string; ticketId?: number }> {
  console.log('registerGuestForEvent called');
  const eventId = parseInt(formData.get('eventId') as string, 10);
  const formResponses = JSON.parse(formData.get('formResponses') as string || '[]');
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;

  if (!eventId || !firstName || !lastName || !email) {
    return { success: false, error: 'Missing required fields for guest registration.' };
  }

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  try {
    // 1. Create guest user in Supabase Auth
    const { data: newAuthUser, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: crypto.randomUUID(), // Secure random password for guest
      email_confirm: true, // Auto-confirm guest accounts
      user_metadata: { first_name: firstName, last_name: lastName }
    });

    if (authError || !newAuthUser?.user) {
      console.error('Error creating guest auth user:', authError);
      return { success: false, error: `Failed to create guest user: ${authError?.message}` };
    }

    const guestUserId = newAuthUser.user.id;

    // 2. Create public profile for guest user
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: guestUserId, email, first_name: firstName, last_name: lastName, is_guest: true });

    if (profileError) {
      console.error('Error creating guest profile:', profileError);
      // This might not be a critical error, so we just log it.
    }

    // 3. Create the ticket
    const { data: newTicket, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        event_id: eventId,
        user_id: guestUserId,
        status: 'approved', // Assuming direct approval for now
        qr_token: crypto.randomUUID(), // Generate QR token
      })
      .select('id')
      .single();

    if (ticketError || !newTicket) {
      console.error('Error creating ticket for guest:', ticketError);
      return { success: false, error: `Failed to create ticket for guest: ${ticketError?.message}` };
    }

    // 4. Save form responses
    if (formResponses.length > 0) {
      const responsesToInsert = formResponses.map((response: { form_field_id: string; field_value: string }) => ({
        ticket_id: newTicket.id,
        form_field_id: response.form_field_id,
        field_value: response.field_value,
      }));

      const { error: responsesError } = await supabase
        .from('attendee_form_responses')
        .insert(responsesToInsert);

      if (responsesError) {
        console.error('Error saving form responses for guest:', responsesError);
        // This might not be a critical error, so we just log it.
      }
    }

    // 5. Send confirmation email (placeholder)
    // await sendTicketEmail(email, `Your ticket for Event ID: ${eventId}`, 'Ticket details here');

    revalidatePath(`/events/${eventId}`);
    revalidatePath(`/dashboard/tickets/${newTicket.id}`); // Guests might not have a dashboard, but good for consistency

    return { success: true, ticketId: newTicket.id };
  } catch (error) {
    console.error('Unhandled error in registerGuestForEvent:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function scanTicketAction(qrToken: string, eventId: number): Promise<{ success: boolean; message?: string; error?: string; user?: { first_name: string; last_name: string; email: string }; status?: { checked_in: boolean; checked_out: boolean } }> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  try {
    // 1. Find the ticket with user information
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select(`
        id, 
        status, 
        checked_in, 
        checked_out,
        profiles (
          first_name,
          last_name,
          email
        )
      `)
      .eq('qr_token', qrToken)
      .eq('event_id', eventId)
      .single();

    if (ticketError || !ticket) {
      console.error('Scan Error: Ticket not found or invalid QR.', ticketError);
      return { success: false, error: 'Ticket not found or invalid QR code.' };
    }

    if (ticket.status !== 'approved') {
      const profile = Array.isArray(ticket.profiles) ? ticket.profiles[0] : ticket.profiles;
      return { 
        success: false, 
        error: `Ticket status is '${ticket.status}'. Only approved tickets can be scanned.`,
        user: profile ? {
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          email: profile.email || ''
        } : undefined,
        status: { checked_in: ticket.checked_in, checked_out: ticket.checked_out }
      };
    }

    let message = '';
    let updateError = null;
    const profile = Array.isArray(ticket.profiles) ? ticket.profiles[0] : ticket.profiles;
    const userName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : 'Unknown User';

    if (!ticket.checked_in) {
      // Check in
      const { error } = await supabase
        .from('tickets')
        .update({ checked_in: true, checked_in_at: new Date().toISOString() })
        .eq('id', ticket.id);
      updateError = error;
      message = `${userName} checked in successfully!`;
    } else if (!ticket.checked_out) {
      // Check out
      const { error } = await supabase
        .from('tickets')
        .update({ checked_out: true, checked_out_at: new Date().toISOString() })
        .eq('id', ticket.id);
      updateError = error;
      message = `${userName} checked out successfully!`;
    } else {
      // Already checked in and out
      message = `${userName} already checked in and out.`;
    }

    if (updateError) {
      console.error('Scan Error: Failed to update ticket status.', updateError);
      return { success: false, error: `Failed to update ticket status: ${updateError.message}` };
    }

    revalidatePath(`/dashboard/events/${eventId}/manage/attendees`);
    return { 
      success: true, 
      message,
      user: profile ? {
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || ''
      } : undefined,
      status: { 
        checked_in: !ticket.checked_in ? true : ticket.checked_in, 
        checked_out: (!ticket.checked_in && !ticket.checked_out) ? false : (!ticket.checked_out ? true : ticket.checked_out)
      }
    };
  } catch (error: any) {
    console.error('Unhandled error in scanTicketAction:', error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}

export async function getScannableEvents(): Promise<{ data: any[] | null; error: string | null; isLoggedIn: boolean }> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'User not logged in.', isLoggedIn: false };
  }

  try {
    // Fetch events where user is the organizer
    const { data: organizedEvents, error: organizedError } = await supabase
      .from('events')
      .select('id, title, date, cover_image, capacity')
      .eq('organizer_id', user.id)
      .gt('date', new Date().toISOString()); // Only upcoming events

    if (organizedError) {
      console.error('Error fetching organized events for scanner:', organizedError);
      return { data: null, error: organizedError.message, isLoggedIn: true };
    }

    // Fetch events where user is an assigned scanner
    const { data: scannedEvents, error: scannedError } = await supabase
      .from('event_scanners')
      .select('events(id, title, date, cover_image, capacity)')
      .eq('user_id', user.id)
      .gt('events.date', new Date().toISOString()); // Only upcoming events

    if (scannedError) {
      console.error('Error fetching scanned events for scanner:', scannedError);
      return { data: null, error: scannedError.message, isLoggedIn: true };
    }

    const allEvents = [
      ...(organizedEvents || []),
      ...(scannedEvents || []).filter(s => s.events).map(s => s.events),
    ];

    // Flatten in case any entries are arrays
    const flatEvents = allEvents.flat();

    // Deduplicate events
    const uniqueEvents = Array.from(new Map(flatEvents.map(event => [event.id, event])).values());

    return { data: uniqueEvents, error: null, isLoggedIn: true };
  } catch (error: any) {
    console.error('Unhandled error in getScannableEvents:', error);
    return { data: null, error: error.message || 'An unexpected error occurred.', isLoggedIn: true };
  }
}
