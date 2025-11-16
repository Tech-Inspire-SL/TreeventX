'use client';

import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Eye, Settings } from 'lucide-react';
import type { EventWithAttendees } from '@/app/lib/types';

export function OrganizerEventCard({ event }: { event: EventWithAttendees }) {
  const isUpcoming = new Date(event.date) > new Date();

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{event.title}</CardTitle>
          <Badge variant={isUpcoming ? 'default' : 'secondary'}>
            {isUpcoming ? 'Upcoming' : 'Past'}
          </Badge>
        </div>
        <CardDescription>
          {new Date(event.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          {event.attendees} confirmed attendees
        </p>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Button asChild variant="secondary">
          <Link href={`/events/${event.id}/hub`}>
            <Eye className="mr-2 h-4 w-4" />
            View Hub
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/dashboard/events/${event.id}/manage`}>
            <Settings className="mr-2 h-4 w-4" />
            Manage
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
