
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button'; // Assuming ui/button is available

interface EventHubHeroProps {
  event: {
    id: string;
    title: string;
    description?: string;
    cover_image?: string;
  };
}

export const EventHubHero = ({ event }: EventHubHeroProps) => {
  return (
    <section className="relative bg-gray-900 text-white py-20 px-4 overflow-hidden">
      {event.cover_image && (
        <Image
          src={event.cover_image}
          alt={`${event.title} Cover`}
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0 opacity-30"
        />
      )}
      <div className="relative z-10 container mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">{event.title}</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          {event.description || "Join our vibrant community for an exciting event. Connect with innovators, share your journey, and be part of something extraordinary."}
        </p>
        <div className="space-x-4">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-3 rounded-full">
            Join Now
          </Button>
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-800 text-lg px-8 py-3 rounded-full">
            Sign In
          </Button>
        </div>
      </div>
    </section>
  );
};
