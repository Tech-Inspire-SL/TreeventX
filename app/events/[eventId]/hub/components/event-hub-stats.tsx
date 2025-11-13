
interface EventHubStatsProps {
  event: any; // If stats are dynamic, pass event data
}

export const EventHubStats = ({ event }: EventHubStatsProps) => {
  return (
    <section className="bg-gray-900 text-white py-16 px-4">
      <div className="container mx-auto text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <p className="text-5xl font-bold text-blue-400">500+</p>
            <p className="text-xl mt-2">Total Participants</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <p className="text-5xl font-bold text-green-400">1,200+</p>
            <p className="text-xl mt-2">Image Uploads</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <p className="text-5xl font-bold text-purple-400">2,400+</p>
            <p className="text-xl mt-2">Community Engagement</p>
          </div>
        </div>
      </div>
    </section>
  );
};
