
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface EventHubCountdownProps {
  event: {
    date: string;
  };
}

export const EventHubCountdown = ({ event }: EventHubCountdownProps) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(event.date) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents: JSX.Element[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval as keyof typeof timeLeft]) {
      return;
    }

    timerComponents.push(
      <div key={interval} className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
        <span className="text-4xl font-bold">
          {String(timeLeft[interval as keyof typeof timeLeft]).padStart(2, '0')}
        </span>
        <span className="text-sm uppercase">{interval}</span>
      </div>
    );
  });

  return (
    <section className="bg-gray-900 text-white py-16 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">HACKATHON STARTS IN</h2>
        <div className="flex justify-center space-x-4 mb-8">
          {timerComponents.length ? timerComponents : <span className="text-xl">Time's up!</span>}
        </div>
        <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-800 text-lg px-8 py-3 rounded-full">
          View Full Schedule
        </Button>
      </div>
    </section>
  );
};
