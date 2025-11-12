import React from 'react';

export function OrganizationForm({ organization }: { organization?: any }) {
  return (
    <div>
      <h1>Organization Form</h1>
      <pre>{JSON.stringify(organization, null, 2)}</pre>
    </div>
  );
}
