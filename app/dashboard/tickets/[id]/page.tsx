

import { getTicketDetails } from "@/lib/server/queries/events";
import { TicketView } from "@/components/tickets/ticket-view";

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const ticketId = parseInt(id, 10);
    const { data: ticket, error } = await getTicketDetails(ticketId);

    if (error || !ticket || !ticket.events) {
        return <div className="text-center text-red-500 p-8">Error: {error || 'Ticket not found or you do not have permission to view it.'}</div>
    }

    // Add form_responses to match expected type (they'll be fetched separately if needed)
    const ticketWithFormResponses = {
        ...ticket,
        form_responses: []
    } as any; // Type assertion needed as TicketWithRelations has a subset of Event fields

    return <TicketView ticket={ticketWithFormResponses} />
}
