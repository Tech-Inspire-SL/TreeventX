
import { ReactNode } from 'react';

export default function EventHubLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gray-900 text-white">
      {children}
    </div>
  );
}
