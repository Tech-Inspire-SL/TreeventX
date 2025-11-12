import React from 'react';

export function OrganizationEvents({ organizationId }: { organizationId: string }) {
  return (
    <div>
      <h1>Organization Events</h1>
      <p>Organization ID: {organizationId}</p>
    </div>
  );
}
