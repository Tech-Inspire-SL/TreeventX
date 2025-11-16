import { getEventDetails, getEventFormFields } from '@/lib/server/queries/events';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { RegisterForEventForm } from './_components/register-event-form';
import { EventDetailsCard } from '@/app/events/[eventId]/register/_components/event-details-card';
import { cookies } from 'next/headers';

async function getAttendeeCount(eventId: number) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { count } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('status', 'approved');
    return count || 0;
}

interface RegisterForEventPageProps {
    params: Promise<{ eventId: string }>;
    searchParams?: Promise<{ payment_cancelled?: string }>;
}

export default async function RegisterForEventPage({ params, searchParams }: RegisterForEventPageProps) {
    // Await both params and searchParams for Next.js 15 compatibility
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const eventId = parseInt(resolvedParams.eventId, 10);
    const { data: event, error } = await getEventDetails(eventId);
    const { data: formFields } = await getEventFormFields(eventId);
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Handle payment cancellation - mark unpaid tickets as cancelled
    if (resolvedSearchParams?.payment_cancelled === 'true' && user) {
        await supabase
            .from('tickets')
            .update({ status: 'cancelled' })
            .eq('event_id', eventId)
            .eq('user_id', user.id)
            .eq('status', 'unpaid');
    }

    if (error || !event) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-secondary">
                <p>Event not found.</p>
            </div>
        );
    }

    const attendeeCount = await getAttendeeCount(eventId);
    const eventWithAttendees = {
        ...event,
        attendees: attendeeCount
    };

    return (
        <div className="container mx-auto py-8">
            <div className="grid gap-8 md:grid-cols-2">
                <EventDetailsCard event={eventWithAttendees} />
                <RegisterForEventForm event={eventWithAttendees} formFields={formFields || []} user={user} />
            </div>
        </div>
    );
}