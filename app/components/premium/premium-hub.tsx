'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Image as ImageIcon, 
  Clock, 
  MessageSquare, 
  Star, 
  FileText, 
  Mail, 
  Share2,
  Heart,
  Download,
  ChevronRight
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import type { PremiumEventData, EventGalleryItem, EventTimelineItem, EventComment, EventResource } from '@/lib/types/premium.ts';

interface PremiumEventHubProps {
  event: PremiumEventData;
}

export function PremiumEventHub({ event }: PremiumEventHubProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const hasGallery = event.gallery && event.gallery.length > 0;
  const hasTimeline = event.timeline && event.timeline.length > 0;
  const hasComments = event.comments && event.comments.length > 0;
  const hasResources = event.resources && event.resources.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-blue-600">
        {event.cover_image && (
          <Image
            src={event.cover_image}
            alt={event.title}
            fill
            priority
            className="object-cover opacity-35"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-[1.7fr,1fr] items-center text-white">
            <div className="text-center md:text-left space-y-6">
              <Badge className="bg-white/10 text-white border-white/30 backdrop-blur-md uppercase tracking-wide">
                Premium Event Experience
              </Badge>
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-headline">
                  {event.title}
                </h1>
                {event.description && (
                  <p className="text-lg md:text-xl text-white/85 max-w-2xl md:max-w-none mx-auto md:mx-0">
                    {event.description}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 text-sm md:text-base text-white/90">
                <HeroDetail
                  icon={Calendar}
                  title="Date"
                  primary={format(new Date(event.date), 'PPP')}
                  secondary={format(new Date(event.date), 'p')}
                />
                <HeroDetail
                  icon={MapPin}
                  title="Location"
                  primary={event.location || 'To be announced'}
                />
                <HeroDetail
                  icon={Users}
                  title="Attendees"
                  primary={`${event.attendees || 0} confirmed`}
                  secondary={event.capacity ? `${event.capacity} capacity` : undefined}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start pt-2">
                <Button size="lg" className="h-12 px-8 rounded-xl bg-white text-primary hover:bg-white/90 shadow-lg shadow-black/20">
                  Register Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 rounded-xl border-white/70 text-white hover:bg-white/10 hover:border-white"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Event
                </Button>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.2em] text-white/70">Event Snapshot</span>
                <ChevronRight className="h-5 w-5 text-white/70" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <HeroStat icon={Calendar} label="Date" value={format(new Date(event.date), 'MMM d, yyyy')} />
                <HeroStat icon={Clock} label="Time" value={format(new Date(event.date), 'p')} />
                <HeroStat icon={MapPin} label="Venue" value={event.location || event.organization?.location || 'To be announced'} />
                <HeroStat icon={Users} label="Capacity" value={event.capacity ? `${event.capacity} seats` : 'Unlimited'} />
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/30">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-white/15 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-rose-200" />
                </div>
                <div>
                  <p className="text-sm text-white/80">Curated for unforgettable connections</p>
                  <p className="text-base font-semibold tracking-wide">Premium access · Concierge support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-1 bg-transparent h-auto p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              {hasTimeline && (
                <TabsTrigger value="schedule" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Clock className="mr-2 h-4 w-4" />
                  Schedule
                </TabsTrigger>
              )}
              {hasGallery && (
                <TabsTrigger value="gallery" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Gallery
                </TabsTrigger>
              )}
              {hasComments && (
                <TabsTrigger value="community" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Community
                </TabsTrigger>
              )}
              {hasResources && (
                <TabsTrigger value="resources" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <FileText className="mr-2 h-4 w-4" />
                  Resources
                </TabsTrigger>
              )}
              <TabsTrigger value="feedback" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Star className="mr-2 h-4 w-4" />
                Feedback
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="overview" className="mt-0">
            <OverviewTab event={event} />
          </TabsContent>
          
          {hasTimeline && (
            <TabsContent value="schedule" className="mt-0">
              <ScheduleTab timeline={event.timeline!} />
            </TabsContent>
          )}
          
          {hasGallery && (
            <TabsContent value="gallery" className="mt-0">
              <GalleryTab gallery={event.gallery!} />
            </TabsContent>
          )}
          
          {hasComments && (
            <TabsContent value="community" className="mt-0">
              <CommunityTab comments={event.comments!} eventId={event.id} />
            </TabsContent>
          )}
          
          {hasResources && (
            <TabsContent value="resources" className="mt-0">
              <ResourcesTab resources={event.resources!} />
            </TabsContent>
          )}
          
          <TabsContent value="feedback" className="mt-0">
            <FeedbackTab eventId={event.id} feedbackSummary={event.feedback_summary} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Newsletter Signup (if enabled) */}
      {event.community_features?.some(f => f.feature_type === 'newsletter' && f.is_enabled) && (
        <div className="bg-primary text-white py-16">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h3>
            <p className="text-lg mb-8 opacity-90">
              Get the latest news and updates about {event.title}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-3 rounded-lg text-foreground"
              />
              <Button className="bg-white text-primary hover:bg-white/90">
                <Mail className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type HeroDetailProps = {
  icon: LucideIcon;
  title: string;
  primary: string;
  secondary?: string;
};

function HeroDetail({ icon: Icon, title, primary, secondary }: HeroDetailProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="text-left space-y-0.5">
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/70">{title}</p>
        <p className="text-sm font-semibold text-white leading-tight">{primary}</p>
        {secondary && <p className="text-xs text-white/70">{secondary}</p>}
      </div>
    </div>
  );
}

type HeroStatProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function HeroStat({ icon: Icon, label, value }: HeroStatProps) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-white">
      <div className="flex items-center gap-2 text-white/75">
        <Icon className="h-4 w-4" />
        <span className="text-[0.7rem] uppercase tracking-[0.35em]">{label}</span>
      </div>
      <p className="mt-3 text-lg font-semibold leading-tight">{value}</p>
    </div>
  );
}

// Individual tab components
function OverviewTab({ event }: { event: PremiumEventData }) {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>About This Event</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {event.description || 'No description available.'}
            </p>
          </CardContent>
        </Card>

        {event.welcome_message && (
          <Card>
            <CardHeader>
              <CardTitle>Welcome Message</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {event.welcome_message}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{format(new Date(event.date), 'PPP')}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(event.date), 'p')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{event.attendees || 0} attending</p>
                {event.capacity && (
                  <p className="text-sm text-muted-foreground">
                    {event.capacity - (event.attendees || 0)} spots left
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {event.feedback_summary && (
          <Card>
            <CardHeader>
              <CardTitle>Event Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {event.feedback_summary.average_rating.toFixed(1)}
                </div>
                <div className="flex justify-center gap-1 my-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-5 w-5 ${
                        star <= event.feedback_summary!.average_rating 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {event.feedback_summary.total_feedback} reviews
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function ScheduleTab({ timeline }: { timeline: EventTimelineItem[] }) {
  const sortedTimeline = timeline
    .filter(item => item.is_published)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Event Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedTimeline.map((item, index) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-lg border">
                <div className="flex-shrink-0 w-20 text-center">
                  <div className="text-sm font-medium">
                    {format(new Date(item.start_time), 'HH:mm')}
                  </div>
                  {item.end_time && (
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(item.end_time), 'HH:mm')}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="text-muted-foreground mt-1">{item.description}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    {item.speaker && <span>Speaker: {item.speaker}</span>}
                    {item.location && <span>Location: {item.location}</span>}
                  </div>
                </div>
                <Badge variant="outline">{item.session_type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GalleryTab({ gallery }: { gallery: EventGalleryItem[] }) {
  const featuredImages = gallery.filter(item => item.is_featured);
  const regularImages = gallery.filter(item => !item.is_featured);

  return (
    <div className="space-y-8">
      {featuredImages.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Featured Photos</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredImages.map((item) => (
              <GalleryCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-6">All Photos</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {regularImages.map((item) => (
            <GalleryCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryCard({ item }: { item: EventGalleryItem }) {
  return (
    <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
      <div className="relative aspect-square">
        <Image
          src={item.image_url}
          alt={item.caption || 'Event photo'}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-2 right-2 bg-black/50 text-white rounded-full p-2">
          <Heart className="h-4 w-4" />
          <span className="ml-1 text-sm">{item.likes_count}</span>
        </div>
      </div>
      {item.caption && (
        <CardContent className="p-3">
          <p className="text-sm">{item.caption}</p>
        </CardContent>
      )}
    </Card>
  );
}

function CommunityTab({ comments, eventId }: { comments: EventComment[]; eventId: number }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Community Discussions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comments
              .filter(comment => comment.is_approved && !comment.parent_comment_id)
              .map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CommentCard({ comment }: { comment: EventComment }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-primary">
            {comment.user?.first_name?.charAt(0) || comment.user_id.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">
              {comment.user?.first_name} {comment.user?.last_name}
            </span>
            <span className="text-sm text-muted-foreground">
              {format(new Date(comment.created_at), 'PPp')}
            </span>
          </div>
          <p className="text-muted-foreground">{comment.comment_text}</p>
          <div className="flex items-center gap-4 mt-2">
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4 mr-1" />
              {comment.likes_count}
            </Button>
            <Button variant="ghost" size="sm">Reply</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourcesTab({ resources }: { resources: EventResource[] }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Event Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {resources
              .filter(resource => resource.is_public)
              .map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ResourceCard({ resource }: { resource: EventResource }) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{resource.title}</h3>
          {resource.description && (
            <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="capitalize">{resource.resource_type}</span>
            {resource.file_size && (
              <span>{(resource.file_size / 1024 / 1024).toFixed(1)} MB</span>
            )}
            <span>{resource.download_count} downloads</span>
          </div>
        </div>
        <Button size="sm" variant="outline">
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>
      </div>
    </Card>
  );
}

function FeedbackTab({ eventId, feedbackSummary }: { eventId: number; feedbackSummary?: any }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Event Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          {feedbackSummary ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {feedbackSummary.average_rating.toFixed(1)}
                </div>
                <div className="flex justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-6 w-6 ${
                        star <= feedbackSummary.average_rating 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  Based on {feedbackSummary.total_feedback} reviews
                </p>
              </div>
              
              <div className="space-y-2">
                {(Object.entries(feedbackSummary.ratings_breakdown) as Array<[string, number]>).map(([rating, count]) => {
                  const countValue = Number(count);
                  const percentage = feedbackSummary.total_feedback
                    ? (countValue / feedbackSummary.total_feedback) * 100
                    : 0;

                  return (
                    <div key={rating} className="flex items-center gap-2">
                    <span className="w-4">{rating}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ 
                          width: `${percentage}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{countValue}</span>
                  </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-muted-foreground">No feedback yet. Be the first to leave a review!</p>
              <Button className="mt-4">Leave Feedback</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}