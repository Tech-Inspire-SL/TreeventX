

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
    type TicketWithFormResponses = typeof ticket & { 
        form_responses: { field_value: string, event_form_fields: { field_name: string } }[]
    };
    const ticketWithFormResponses: TicketWithFormResponses = {
        ...ticket,
        form_responses: []
    };

    return <TicketView ticket={ticketWithFormResponses as any} />
}
