
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import {
  Building2,
  Calendar,
  Download,
  Heart,
  MapPin,
  Ticket,
  Users,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShareButton } from '@/app/components/share-button';
import type { PremiumEventData } from '@/app/lib/types/premium';
import { createClient } from '@/lib/supabase/server';
import { CountdownTimer } from '@/app/components/countdown-timer';

// (Data fetching function remains the same)
async function getPremiumEventData(eventId: number): Promise<PremiumEventData | null> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data: event, error: eventError } = await supabase
    .from('events')
    .select(`
      *,
      template:event_templates(id, name),
      organizer:profiles!events_organizer_id_fkey(id, first_name, last_name, email, avatar_url),
      organization:organizations(id, name, description, website, location)
    `)
    .eq('id', eventId)
    .single();

  if (eventError || !event) return null;
  if (!event.premium_features_enabled && !event.community_enabled) return null;

  const { data: communityFeatures } = await supabase.from('event_community_features').select('*').eq('event_id', eventId).eq('is_enabled', true);
  const { data: gallery } = await supabase.from('event_gallery').select('*').eq('event_id', eventId).order('upload_date', { ascending: false });
  const { data: timeline } = await supabase.from('event_timeline').select('*').eq('event_id', eventId).eq('is_published', true).order('start_time', { ascending: true });
  const { data: comments } = await supabase.from('event_comments').select('*, user:profiles!event_comments_user_id_fkey(first_name, last_name, avatar_url)').eq('event_id', eventId).eq('is_approved', true).order('created_at', { ascending: false });
  const { data: resources } = await supabase.from('event_resources').select('*').eq('event_id', eventId).eq('is_public', true).order('created_at', { ascending: false });
  const { data: feedbackData } = await supabase.from('event_feedback').select('rating').eq('event_id', eventId);
  const { count: attendees } = await supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('event_id', eventId).eq('status', 'approved');

  let feedbackSummary = null;
  if (feedbackData && feedbackData.length > 0) {
    const totalFeedback = feedbackData.length;
    const averageRating = feedbackData.reduce((sum, f) => sum + f.rating, 0) / totalFeedback;
    feedbackSummary = { average_rating: averageRating, total_feedback: totalFeedback, ratings_breakdown: {} };
  }

  return {
    ...event,
    community_features: communityFeatures || [],
    gallery: gallery || [],
    timeline: timeline || [],
    comments: comments || [],
    resources: resources || [],
    feedback_summary: feedbackSummary,
    attendees: attendees || 0,
  } as PremiumEventData;
}

// --- Modular View Components (remain the same) ---

const TimelineView = ({ event }: { event: PremiumEventData }) => (
  <div className="space-y-6">
    {event.timeline && event.timeline.length > 0 ? (
      event.timeline.map((item: any) => (
        <Card key={item.id} className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold">{item.title}</h3>
              {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
              {item.start_time && (
                <p className="text-xs text-muted-foreground mt-2">
                  {format(new Date(item.start_time), 'PPp')}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))
    ) : (
      <p className="text-muted-foreground">The event schedule will be posted here soon.</p>
    )}
  </div>
);

const GalleryView = ({ event }: { event: PremiumEventData }) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
    {event.gallery && event.gallery.length > 0 ? (
      event.gallery.map((item) => (
        <Link key={item.id} href={item.image_url} target="_blank">
          <img src={item.image_url} alt={item.caption || 'Event gallery image'} className="aspect-square w-full rounded-lg object-cover transition-transform hover:scale-105" />
        </Link>
      ))
    ) : (
      <p className="col-span-full text-muted-foreground">No images have been shared yet.</p>
    )}
  </div>
);

const CommunityView = ({ event }: { event: PremiumEventData }) => (
  <div className="space-y-6">
    {event.comments && event.comments.length > 0 ? (
      event.comments.map((comment: any) => (
        <div key={comment.id} className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={comment.user?.avatar_url ?? undefined} />
            <AvatarFallback>{comment.user?.first_name?.[0] ?? 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{comment.user?.first_name ?? 'Anonymous'}</p>
              <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</p>
            </div>
            <p className="text-sm text-muted-foreground">{comment.content}</p>
          </div>
        </div>
      ))
    ) : (
      <p className="text-muted-foreground">Be the first to join the discussion!</p>
    )}
  </div>
);

const ResourcesView = ({ event }: { event: PremiumEventData }) => (
  <div className="space-y-4">
    {event.resources && event.resources.length > 0 ? (
      event.resources.map((resource) => (
        <Card key={resource.id}>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <div>
              <CardTitle className="text-base">{resource.title}</CardTitle>
              {resource.description && <CardDescription className="text-sm">{resource.description}</CardDescription>}
            </div>
            <Button asChild size="sm">
              <a href={resource.resource_url} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" /> Download
              </a>
            </Button>
          </CardHeader>
        </Card>
      ))
    ) : (
      <p className="text-muted-foreground">No resources have been shared for this event yet.</p>
    )}
  </div>
);

// --- The Final "Personal Page" Layout ---

export default async function EventHubPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = await getPremiumEventData(Number(eventId));

  if (!event) {
    notFound();
  }

  const features = event.community_features.filter(f => f.is_enabled);
  const hasFeature = (type: string) => features.some(f => f.feature_type === type);

  const organizerName = event.organizer ? `${event.organizer.first_name} ${event.organizer.last_name}`.trim() : 'TBA';
  const ticketLabel = event.is_paid ? 'Get Tickets' : 'Register Free';
  
  // Construct the event URL for sharing.
  // In a real production app, this should come from an environment variable.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const eventUrl = `${siteUrl}/events/${event.id}/hub`;

  return (
    <div className="min-h-screen bg-muted/40">
      {/* --- Hero Section --- */}
      <section className="border-b bg-slate-100 dark:bg-slate-800/20">
        <div className="container mx-auto px-4 py-12 text-center lg:px-8">
          <Avatar className="mx-auto h-24 w-24 border-4 border-background shadow-lg">
            <AvatarImage src={(event.organizer as any)?.avatar_url ?? undefined} />
            <AvatarFallback className="text-3xl">{organizerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="mt-4 flex items-center justify-center gap-4">
            <h2 className="text-xl font-semibold">{organizerName} invites you to</h2>
          </div>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground md:text-6xl">{event.title}</h1>
          {event.template?.name && <Badge variant="secondary" className="mt-4">{event.template.name}</Badge>}
          {event.description && <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">{event.description}</p>}
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href={`/events/${event.id}/tickets`}><Ticket className="mr-2 h-4 w-4" /> {ticketLabel}</Link>
            </Button>
            <ShareButton eventUrl={eventUrl} eventTitle={event.title} />
          </div>
        </div>
      </section>

      {/* --- Countdown & Details --- */}
      <main className="container mx-auto -mt-8 max-w-5xl px-4 pb-12 lg:px-8">
        <Card className="mb-8 bg-background/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <CountdownTimer eventDate={event.date} />
          </CardContent>
        </Card>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="text-center">
            <CardHeader><MapPin className="mx-auto h-6 w-6 text-muted-foreground" /></CardHeader>
            <CardContent><p className="font-semibold">{event.location || 'TBA'}</p></CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader><Calendar className="mx-auto h-6 w-6 text-muted-foreground" /></CardHeader>
            <CardContent><p className="font-semibold">{format(new Date(event.date), 'MMMM d, yyyy')}</p></CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader><Users className="mx-auto h-6 w-6 text-muted-foreground" /></CardHeader>
            <CardContent><p className="font-semibold">{event.attendees?.toLocaleString() ?? '0'} Confirmed</p></CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader><Heart className="mx-auto h-6 w-6 text-muted-foreground" /></CardHeader>
            <CardContent>
              {event.feedback_summary ? (
                <p className="font-semibold">{event.feedback_summary.average_rating.toFixed(1)}/5 Rating</p>
              ) : (
                <p className="font-semibold">No Reviews</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* --- Vertical Content Sections --- */}
        <div className="space-y-8">
          {hasFeature('timeline') && (
            <Card>
              <CardHeader><CardTitle>Schedule</CardTitle></CardHeader>
              <CardContent><TimelineView event={event} /></CardContent>
            </Card>
          )}
          {hasFeature('gallery') && (
            <Card>
              <CardHeader><CardTitle>Gallery</CardTitle></CardHeader>
              <CardContent><GalleryView event={event} /></CardContent>
            </Card>
          )}
          {hasFeature('comments') && (
            <Card>
              <CardHeader><CardTitle>Community Discussion</CardTitle></CardHeader>
              <CardContent><CommunityView event={event} /></CardContent>
            </Card>
          )}
          {hasFeature('resources') && (
            <Card>
              <CardHeader><CardTitle>Resources</CardTitle></CardHeader>
              <CardContent><ResourcesView event={event} /></CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
