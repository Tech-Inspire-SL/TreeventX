
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Assuming ui/button is available

interface EventHubCTAProps {
  event: {
    id: string;
  };
}

export const EventHubCTA = ({ event }: EventHubCTAProps) => {
  return (
    <section className="bg-gray-900 text-white py-16 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">READY TO GET STARTED?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Upload your photos, explore the timeline, connect with other participants, and follow the hackathon journey.
        </p>
        <div className="space-x-4">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-3 rounded-full">
            <Link href={`/events/${event.id}/hub/gallery`}>Explore Gallery</Link>
          </Button>
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-800 text-lg px-8 py-3 rounded-full">
            <Link href={`/events/${event.id}/hub/contact`}>Contact Organisers</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
