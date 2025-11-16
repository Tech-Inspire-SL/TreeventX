import { redirect } from 'next/navigation';

export default async function TicketRedirectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    
    // Validate that ID is a valid number
    const ticketId = parseInt(id, 10);
    if (isNaN(ticketId)) {
        redirect('/dashboard'); // Redirect to dashboard if invalid ID
    }
    
    // Redirect to the proper ticket view path
    redirect(`/tickets/view/${id}`);
}