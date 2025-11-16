'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';

const PinSchema = z.string().min(4, "PIN must be at least 4 digits").max(8, "PIN must be no more than 8 digits");

// Helper function to get the event and check ownership
async function getEventAndVerifyOwnership(eventId: number) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('You must be logged in to perform this action.');
  }

  const { data: event, error } = await supabase
    .from('events')
    .select('id, organizer_id, pin_hash')
    .eq('id', eventId)
    .single();

  if (error || !event) {
    throw new Error('Event not found.');
  }

  if (event.organizer_id !== user.id) {
    throw new Error('You are not authorized to manage this event.');
  }

  return { event, supabase };
}

export async function setEventPin(eventId: number, pin: string) {
  try {
    const { event, supabase } = await getEventAndVerifyOwnership(eventId);

    const validation = PinSchema.safeParse(pin);
    if (!validation.success) {
      return { error: validation.error.errors.map(e => e.message).join(', ') };
    }

    const saltRounds = 10;
    const pinHash = await bcrypt.hash(pin, saltRounds);

    const { error: updateError } = await supabase
      .from('events')
      .update({ pin_hash: pinHash })
      .eq('id', eventId);

    if (updateError) {
      throw updateError;
    }

    revalidatePath(`/dashboard/events/${eventId}/manage`);
    return { success: true, message: 'PIN has been set successfully.' };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to set PIN.' };
  }
}

export async function removeEventPin(eventId: number, currentPin: string) {
  try {
    const { event, supabase } = await getEventAndVerifyOwnership(eventId);

    if (!event.pin_hash) {
      return { error: 'No PIN is set for this event.' };
    }

    const pinMatches = await bcrypt.compare(currentPin, event.pin_hash);

    if (!pinMatches) {
      return { error: 'The current PIN is incorrect.' };
    }

    const { error: updateError } = await supabase
      .from('events')
      .update({ pin_hash: null })
      .eq('id', eventId);

    if (updateError) {
      throw updateError;
    }

    revalidatePath(`/dashboard/events/${eventId}/manage`);
    return { success: true, message: 'PIN has been removed.' };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to remove PIN.' };
  }
}

type PinActionState = {
  success?: boolean;
  message?: string;
  error?: string;
} | null;

const parseEventId = (value: FormDataEntryValue | null): number | null => {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

export async function setEventPinAction(
  _prevState: PinActionState,
  formData: FormData,
) {
  const eventId = parseEventId(formData.get('eventId'));
  const pin = formData.get('pin');

  if (!eventId || typeof pin !== 'string') {
    return { error: 'Invalid form submission.' };
  }

  return setEventPin(eventId, pin);
}

export async function removeEventPinAction(
  _prevState: PinActionState,
  formData: FormData,
) {
  const eventId = parseEventId(formData.get('eventId'));
  const currentPin = formData.get('currentPin');

  if (!eventId || typeof currentPin !== 'string') {
    return { error: 'Invalid form submission.' };
  }

  return removeEventPin(eventId, currentPin);
}


export async function verifyEventPin(eventId: number, pin: string): Promise<boolean> {
    try {
    const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        const { data: event, error } = await supabase
            .from('events')
            .select('pin_hash')
            .eq('id', eventId)
            .single();

        if (error || !event || !event.pin_hash) {
            return false;
        }

        return await bcrypt.compare(pin, event.pin_hash);

    } catch (error) {
        console.error("Error verifying PIN:", error);
        return false;
    }
}

export async function createPinSession(eventId: number, pin: string) {
    const pinIsValid = await verifyEventPin(eventId, pin);

    if (!pinIsValid) {
        return { error: 'Invalid PIN provided.' };
    }

    const cookieStore = await cookies();
    const cookieName = `event-pin-session-${eventId}`;
    
    // The value can be simple, the presence and expiry of the cookie is what matters.
    // In a real-world scenario, this might be a signed JWT for more security.
    cookieStore.set(cookieName, 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 15, // 15 minutes
        path: '/',
    });

    return { success: true };
}

export async function createPinSessionAction(
  eventId: number,
  _prevState: PinActionState,
  formData: FormData
) {
  const pin = formData.get('pin');

  if (typeof pin !== 'string') {
    return { error: 'Invalid PIN provided.' };
  }

  return createPinSession(eventId, pin);
}
