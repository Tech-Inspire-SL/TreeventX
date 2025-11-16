'use client';

import { useEffect, useState } from 'react';
import { calculateCountdown } from '@/lib/premium/countdown';
import type { CountdownState } from '@/lib/types/premium';

export function CountdownTimer({ eventDate }: { eventDate: string }) {
  const [countdown, setCountdown] = useState<CountdownState>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateCountdown(eventDate));
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [eventDate]);

  return (
    <div className="grid grid-cols-4 gap-4 text-center">
      <div>
        <p className="text-4xl font-bold">{countdown.days}</p>
        <p className="text-xs uppercase text-muted-foreground">Days</p>
      </div>
      <div>
        <p className="text-4xl font-bold">{countdown.hours}</p>
        <p className="text-xs uppercase text-muted-foreground">Hours</p>
      </div>
      <div>
        <p className="text-4xl font-bold">{countdown.minutes}</p>
        <p className="text-xs uppercase text-muted-foreground">Mins</p>
      </div>
      <div>
        <p className="text-4xl font-bold">{countdown.seconds}</p>
        <p className="text-xs uppercase text-muted-foreground">Secs</p>
      </div>
    </div>
  );
}
