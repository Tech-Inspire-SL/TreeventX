
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import {
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
import { CountdownTimer } from '@/app/components/countdown-timer';
import { createClient } from '@/lib/supabase/server';
import type { PremiumEventData } from '@/lib/types/premium';

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

const TimelineView = ({ event }: { event: PremiumEventData }) => {
  const timelineItems = event.timeline ?? [];
  const hasTimeline = timelineItems.length > 0;

  return (
    <div className="space-y-6">
      {hasTimeline ? (
        timelineItems.map((item) => (
        <Card key={item.id}>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl">{item.title}</CardTitle>
              {item.description && (
                <CardDescription className="mt-1 text-sm">{item.description}</CardDescription>
              )}
            </div>
            <Badge variant="outline">
              {format(new Date(item.start_time), 'p')}
              {item.end_time ? ` - ${format(new Date(item.end_time), 'p')}` : ''}
            </Badge>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {item.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{item.location}</span>
              </div>
            )}
            {item.speaker && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{item.speaker}</span>
              </div>
            )}
            <Badge variant="secondary">{item.session_type}</Badge>
          </CardContent>
        </Card>
        ))
      ) : (
        <p className="text-muted-foreground">The event schedule will be posted here soon.</p>
      )}
    </div>
  );
};

const GalleryView = ({ event }: { event: PremiumEventData }) => {
  const galleryItems = event.gallery ?? [];
  const hasGallery = galleryItems.length > 0;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {hasGallery ? (
        galleryItems.map((item) => (
        <Link key={item.id} href={item.image_url} target="_blank">
          <img src={item.image_url} alt={item.caption || 'Event gallery image'} className="aspect-square w-full rounded-lg object-cover transition-transform hover:scale-105" />
        </Link>
        ))
      ) : (
        <p className="col-span-full text-muted-foreground">No images have been shared yet.</p>
      )}
    </div>
  );
};

const CommunityView = ({ event }: { event: PremiumEventData }) => {
  const comments = event.comments ?? [];
  const hasComments = comments.length > 0;

  return (
    <div className="space-y-6">
      {hasComments ? (
        comments.map((comment) => (
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
};

const ResourcesView = ({ event }: { event: PremiumEventData }) => {
  const resources = event.resources ?? [];
  const hasResources = resources.length > 0;

  return (
    <div className="space-y-4">
      {hasResources ? (
        resources.map((resource) => {
          const downloadUrl = resource.file_url ?? resource.resource_url;
          return (
            <Card key={resource.id}>
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <div>
                  <CardTitle className="text-base">{resource.title}</CardTitle>
                  {resource.description && <CardDescription className="text-sm">{resource.description}</CardDescription>}
                </div>
                <Button asChild size="sm">
                  <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" /> Download
                  </a>
                </Button>
              </CardHeader>
            </Card>
          );
        })
      ) : (
        <p className="text-muted-foreground">No resources have been shared for this event yet.</p>
      )}
    </div>
  );
};

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
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(168,85,247,0.2),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden h-full w-[60rem] -translate-x-1/2 bg-gradient-to-r from-indigo-600/20 via-sky-400/10 to-transparent blur-3xl md:block" />
      <div className="relative z-10">
      {/* --- Hero Section --- */}
      <section className="relative border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.2),_transparent_60%)]" />
        <div className="container relative mx-auto px-4 py-12 text-center text-white lg:px-8">
          <Avatar className="mx-auto h-24 w-24 border-4 border-background shadow-lg">
            <AvatarImage src={event.organizer?.avatar_url ?? undefined} />
            <AvatarFallback className="text-3xl">{organizerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="mt-4 flex items-center justify-center gap-4">
            <h2 className="text-xl font-semibold text-white/80">{organizerName} invites you to</h2>
          </div>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white md:text-6xl">{event.title}</h1>
          {event.template?.name && <Badge variant="secondary" className="mt-4 border border-white/10 bg-white/10 text-white">{event.template.name}</Badge>}
          {event.description && <p className="mx-auto mt-4 max-w-3xl text-lg text-white/70">{event.description}</p>}
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href={`/events/${event.id}/tickets`}><Ticket className="mr-2 h-4 w-4" /> {ticketLabel}</Link>
            </Button>
            <ShareButton eventUrl={eventUrl} eventTitle={event.title} />
          </div>
        </div>
      </section>

      {/* --- Countdown & Details --- */}
      <main className="container mx-auto -mt-8 max-w-5xl px-4 pb-12 text-white lg:px-8">
        <Card className="mb-8 border border-white/10 bg-white/5 backdrop-blur-lg">
          <CardContent className="p-6 text-center">
            <CountdownTimer eventDate={event.date} />
          </CardContent>
        </Card>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="text-center border border-white/10 bg-white/5 text-white backdrop-blur">
            <CardHeader><MapPin className="mx-auto h-6 w-6 text-white/70" /></CardHeader>
            <CardContent><p className="font-semibold">{event.location || 'TBA'}</p></CardContent>
          </Card>
          <Card className="text-center border border-white/10 bg-white/5 text-white backdrop-blur">
            <CardHeader><Calendar className="mx-auto h-6 w-6 text-white/70" /></CardHeader>
            <CardContent><p className="font-semibold">{format(new Date(event.date), 'MMMM d, yyyy')}</p></CardContent>
          </Card>
          <Card className="text-center border border-white/10 bg-white/5 text-white backdrop-blur">
            <CardHeader><Users className="mx-auto h-6 w-6 text-white/70" /></CardHeader>
            <CardContent><p className="font-semibold">{event.attendees?.toLocaleString() ?? '0'} Confirmed</p></CardContent>
          </Card>
          <Card className="text-center border border-white/10 bg-white/5 text-white backdrop-blur">
            <CardHeader><Heart className="mx-auto h-6 w-6 text-white/70" /></CardHeader>
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
            <Card className="border border-white/10 bg-white/5 text-white backdrop-blur">
              <CardHeader><CardTitle>Schedule</CardTitle></CardHeader>
              <CardContent><TimelineView event={event} /></CardContent>
            </Card>
          )}
          {hasFeature('gallery') && (
            <Card className="border border-white/10 bg-white/5 text-white backdrop-blur">
              <CardHeader><CardTitle>Gallery</CardTitle></CardHeader>
              <CardContent><GalleryView event={event} /></CardContent>
            </Card>
          )}
          {hasFeature('comments') && (
            <Card className="border border-white/10 bg-white/5 text-white backdrop-blur">
              <CardHeader><CardTitle>Community Discussion</CardTitle></CardHeader>
              <CardContent><CommunityView event={event} /></CardContent>
            </Card>
          )}
          {hasFeature('resources') && (
            <Card className="border border-white/10 bg-white/5 text-white backdrop-blur">
              <CardHeader><CardTitle>Resources</CardTitle></CardHeader>
              <CardContent><ResourcesView event={event} /></CardContent>
            </Card>
          )}
        </div>
      </main>
      </div>
    </div>
  );
}
