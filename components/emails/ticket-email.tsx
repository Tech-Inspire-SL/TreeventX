import React from 'react';
import type { TicketWithRelations } from '@/app/lib/types';

export function TicketEmail({ ticket }: { ticket: TicketWithRelations }) {
  return (
    <div>
      <h1>Your ticket for {ticket.events?.title ?? 'your event'}</h1>
      <p>Thank you for registering.</p>
    </div>
  );
}
