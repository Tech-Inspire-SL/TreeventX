
import Link from 'next/link';

interface EventHubFooterProps {
  event: {
    id: string;
    organization?: {
      name: string;
    };
  };
}

export const EventHubFooter = ({ event }: EventHubFooterProps) => {
  const currentYear = new Date().getFullYear();
  const organizationName = event.organization?.name || "HackHub"; // Default to HackHub if no organization name

  return (
    <footer className="bg-gray-800 text-white py-12 px-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">{organizationName}</h3>
          <p className="text-gray-400">A community-driven platform for hackathon participants and enthusiasts.</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">QUICK LINKS</h4>
          <ul>
            <li><Link href={`/events/${event.id}/hub/gallery`} className="text-gray-400 hover:text-white">Gallery</Link></li>
            <li><Link href={`/events/${event.id}/hub/timeline`} className="text-gray-400 hover:text-white">Timeline</Link></li>
            <li><Link href={`/events/${event.id}/hub/contact`} className="text-gray-400 hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">COMMUNITY</h4>
          <ul>
            <li><Link href="#" className="text-gray-400 hover:text-white">About</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-white">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">LEGAL</h4>
          <ul>
            <li><Link href="#" className="text-gray-400 hover:text-white">Privacy</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-white">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto text-center text-gray-500 mt-8 border-t border-gray-700 pt-8">
        <p>&copy; {currentYear} {organizationName}. All rights reserved.</p>
        <p className="text-sm mt-2">Built with v0</p>
      </div>
    </footer>
  );
};
