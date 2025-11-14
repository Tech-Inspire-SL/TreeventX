'use client';

import { useMemo, useState } from 'react';
import type { EventWithAttendees } from '@/app/lib/types';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { Search } from 'lucide-react';
import { EventCard } from '@/app/components/event-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { TimelineEventCard } from '@/app/components/timeline-event-card';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Skeleton } from '@/app/components/ui/skeleton';

interface EventsClientPageProps {
  allEvents: EventWithAttendees[];
  myEvents: EventWithAttendees[];
  registeredEvents: EventWithAttendees[];
  pastEvents: any[];
  user: { id: string } | null;
}

function EventsLoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
      {[...Array(8)].map((_, i) => (
        <Card key={i}>
          <Skeleton className="aspect-[16/10] w-full" />
          <Skeleton className="h-6 w-3/4 my-4 mx-4" />
          <Skeleton className="h-4 w-1/2 mb-4 mx-4" />
          <Skeleton className="h-9 w-full m-4" />
        </Card>
      ))}
    </div>
  )
}

export function EventsClientPage({
  allEvents,
  myEvents,
  registeredEvents,
  pastEvents,
  user
}: EventsClientPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const filteredEvents = useMemo(() => {
    return allEvents
      .filter(event => {
        if (searchTerm && !event.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        const eventDate = new Date(event.date);
        if (dateFilter === 'upcoming' && eventDate < new Date()) {
          return false;
        }
        if (dateFilter === 'past' && eventDate >= new Date()) {
          return false;
        }
        if (typeFilter === 'free' && event.is_paid) {
          return false;
        }
        if (typeFilter === 'paid' && !event.is_paid) {
          return false;
        }
        // Placeholder for featured logic
        if (showFeaturedOnly && !event.title.toLowerCase().includes('pro')) {
            return false;
        }
        return true;
      });
  }, [allEvents, searchTerm, dateFilter, typeFilter, showFeaturedOnly]);

  return (
    <>
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search events by title..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
            </Select>
            <div className="flex items-center space-x-2 lg:col-start-1">
                <Switch 
                    id="featured-only" 
                    checked={showFeaturedOnly}
                    onCheckedChange={setShowFeaturedOnly}
                />
                <Label htmlFor="featured-only">Featured events</Label>
            </div>
        </div>
      </Card>

      <Tabs defaultValue="all-events">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all-events">All Events</TabsTrigger>
          <TabsTrigger value="my-events">My Events</TabsTrigger>
          <TabsTrigger value="registered">My Tickets</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="all-events">
          {filteredEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} isMyEvent={user ? event.organizer_id === user.id : false} />
              ))}
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
              <h3 className="text-xl font-semibold tracking-tight">No public events found</h3>
              <p className="text-sm text-muted-foreground mb-4">Check back later or adjust your filters!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-events">
          {myEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
              {myEvents.map(event => (
                <EventCard key={event.id} event={event} isMyEvent={true} />
              ))}
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
              <h3 className="text-xl font-semibold tracking-tight">You haven't created any events yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Get started by creating your first event.</p>
              <Button asChild>
                <Link href="/dashboard/events/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Event
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="registered">
          {registeredEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
              {registeredEvents.map(event => (
                <EventCard key={event.id} event={event} isMyEvent={user ? event.organizer_id === user.id : false} />
              ))}
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
              <h3 className="text-xl font-semibold tracking-tight">You have no tickets yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Register for an event to get your ticket.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline">
          {pastEvents.length > 0 ? (
            <div className="relative mt-12 pl-6">
              <div className="absolute left-[30px] top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
              <div className="space-y-12">
                {pastEvents.map((event) => (
                  <TimelineEventCard key={`${event.id}-${event.type}`} event={event} />
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
              <h3 className="text-xl font-semibold tracking-tight">No past events</h3>
              <p className="text-sm text-muted-foreground">Your past created and attended events will appear here.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
