
'use server';

import { getEventAttendees } from "@/lib/actions/events";
import { getEventDetails } from "@/lib/server/queries/events";
import { ManageEventView } from "./_components/manage-event-view";
import { cookies } from "next/headers";
import { PinVerificationForm } from "./_components/pin-verification-form";


interface ManageEventPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function ManageEventPage({ params }: ManageEventPageProps) {
  const resolvedParams = await params;
  const eventId = parseInt(resolvedParams.eventId, 10);
  
  // Fetch data in parallel
  const [
    { data: event, error: eventError },
    { data: attendees, error: attendeesError }
  ] = await Promise.all([
    getEventDetails(eventId),
    getEventAttendees(eventId)
  ]);

  if (eventError || !event) {
    return (
      <div className="text-center text-destructive p-8">
        <h2 className="text-xl font-semibold">Error</h2>
        <p>{eventError || 'Event not found.'}</p>
      </div>
    );
  }

  if (attendeesError) {
    return (
      <div className="text-center text-destructive p-8">
        <h2 className="text-xl font-semibold">Error</h2>
        <p>Error fetching attendees: {attendeesError}</p>
      </div>
    );
  }

  // PIN Verification Gate - Type assertion needed for pin_hash property
  const eventWithPinHash = event as typeof event & { pin_hash?: string | null };
  if (eventWithPinHash.pin_hash) {
    const cookieStore = await cookies();
    const pinSession = cookieStore.get(`event-pin-session-${eventId}`)?.value;
    if (pinSession !== 'true') {
      return <PinVerificationForm eventId={eventId} eventTitle={eventWithPinHash.title} />;
    }
  }

  // Add attendees count to event
  const eventWithAttendees = {
    ...eventWithPinHash,
    attendees: attendees?.length || 0
  };

  return <ManageEventView event={eventWithAttendees} initialAttendees={attendees || []} />;
}
