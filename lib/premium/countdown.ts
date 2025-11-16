import type { CountdownState } from '@/lib/types/premium';

const ZERO_STATE: CountdownState = { days: '00', hours: '00', minutes: '00', seconds: '00' };

export function calculateCountdown(dateString: string, now: Date = new Date()): CountdownState {
  const eventTime = new Date(dateString).getTime();
  const nowTime = now.getTime();

  if (Number.isNaN(eventTime) || eventTime <= nowTime) {
    return ZERO_STATE;
  }

  const diff = eventTime - nowTime;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
}

export function calculateCountdownSnapshot(dateString: string): CountdownState {
  return calculateCountdown(dateString);
}
