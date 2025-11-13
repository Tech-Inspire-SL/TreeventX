
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button'; // Assuming ui/button is available

interface EventHubHeaderProps {
  event: {
    id: string;
    title: string;
    organization?: {
      name: string;
      logo_url?: string;
    };
  };
}

export const EventHubHeader = ({ event }: EventHubHeaderProps) => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {event.organization?.logo_url && (
            <Image
              src={event.organization.logo_url}
              alt={`${event.organization.name} Logo`}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <Link href={`/events/${event.id}/hub`} className="text-2xl font-bold">
            {event.title}
          </Link>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link href={`/events/${event.id}/hub/gallery`} className="hover:text-blue-400 transition-colors">
            Gallery
          </Link>
          <Link href={`/events/${event.id}/hub/timeline`} className="hover:text-blue-400 transition-colors">
            Timeline
          </Link>
          <Link href={`/events/${event.id}/hub/feedback`} className="hover:text-blue-400 transition-colors">
            Feedback
          </Link>
          <Link href={`/events/${event.id}/hub/contact`} className="hover:text-blue-400 transition-colors">
            Contact
          </Link>
        </nav>
        <div className="space-x-2">
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-800">
            Login
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600">
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
};
