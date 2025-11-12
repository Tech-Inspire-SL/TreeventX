import React from 'react';

export function OrganizationMembers({ organizationId, members, userRole, ownerId }: { organizationId: string; members: any[]; userRole: string; ownerId: string; }) {
  return (
    <div>
      <h1>Organization Members</h1>
      <p>Organization ID: {organizationId}</p>
      <p>User Role: {userRole}</p>
      <p>Owner ID: {ownerId}</p>
      <pre>{JSON.stringify(members, null, 2)}</pre>
    </div>
  );
}
