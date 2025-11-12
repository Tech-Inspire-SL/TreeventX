import React from 'react';

export function TicketEmail({ ticket }: { ticket: any }) {
  return (
    <div>
      <h1>Your ticket for {ticket.events.title}</h1>
      <p>Thank you for registering.</p>
    </div>
  );
}
