import React from 'react';

export function TicketView({ ticket }: { ticket: any }) {
  return (
    <div>
      <h1>Ticket</h1>
      <pre>{JSON.stringify(ticket, null, 2)}</pre>
    </div>
  );
}
