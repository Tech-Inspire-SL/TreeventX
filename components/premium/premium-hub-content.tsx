import { format } from 'date-fns';
import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  Calendar,
  Clock,
  Image as ImageIcon,
  MapPin,
  MessageSquare,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type {
  CountdownState,
  EventCommunityFeature,
  PremiumEventData,
} from '@/lib/types/premium';

interface InfoCard {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface StatHighlight {
  label: string;
  value: string;
}

interface ActionButton {
  label: string;
  href: string;
  variant?: 'default' | 'outline' | 'secondary';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  target?: '_blank';
}

interface CTASection {
  title: string;
  description: string;
  actions: ActionButton[];
}

interface PremiumHubContentProps {
  event: PremiumEventData;
  countdown: CountdownState;
  communityFeatures: EventCommunityFeature[];
  layout?: 'embedded' | 'page';
  heroHeading?: string;
  heroDescription?: string;
  heroActions?: ActionButton[];
  badgeLabel?: string;
  stats?: StatHighlight[];
  infoCards?: InfoCard[];
  ctaSection?: CTASection;
}

const defaultInfoCards: InfoCard[] = [
  {
    title: 'Reminders',
    description: "Set reminders for events you don't want to miss",
    icon: Bell,
  },
  {
    title: 'Locations',
    description: 'All events are held at the main venue unless specified',
    icon: MapPin,
  },
  {
    title: 'Schedule',
    description: 'Schedule is subject to change. Check back for updates',
    icon: Clock,
  },
];

const defaultHeroActions: ActionButton[] = [
  {
    label: 'Join Now',
    href: '#register',
    icon: ArrowRight,
    iconPosition: 'right',
  },
  {
    label: 'Sign In',
    href: '/login',
    variant: 'outline',
  },
];

const defaultCTASection: CTASection = {
  title: 'Ready to Get Started?',
  description:
    'Upload your photos, explore the timeline, connect with other participants, and follow the hackathon journey.',
  actions: [
    {
      label: 'Explore Gallery',
      href: '#gallery',
      icon: ImageIcon,
    },
    {
      label: 'Contact Organisers',
      href: '#contact',
      icon: MessageSquare,
      variant: 'outline',
    },
  ],
};

const defaultStats = (event: PremiumEventData): StatHighlight[] => [
  {
    label: 'Total Participants',
    value: event.attendees ? `${event.attendees.toLocaleString()}` : '—',
  },
  {
    label: 'Reviews',
    value: event.feedback_summary?.total_feedback
      ? `${event.feedback_summary.total_feedback.toLocaleString()}`
      : 'Collecting',
  },
];

const enabledFeatures = (features: EventCommunityFeature[]) =>
  features.filter((feature) => feature.is_enabled);

const formatEventDate = (date?: string) => {
  if (!date) {
    return 'Date TBA';
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return 'Date TBA';
  }

  return format(parsed, 'MMMM d, yyyy');
};

const renderActionButton = ({
  label,
  href,
  variant = 'default',
  icon: Icon,
  iconPosition = 'left',
  target,
}: ActionButton) => (
  <Button key={label} asChild size="lg" variant={variant}>
    <Link href={href} target={target} prefetch={false}>
      {Icon && iconPosition !== 'right' ? (
        <Icon className="mr-2 h-4 w-4" />
      ) : null}
      {label}
      {Icon && iconPosition === 'right' ? (
        <Icon className="ml-2 h-4 w-4" />
      ) : null}
    </Link>
  </Button>
);

export function PremiumHubContent({
  event,
  countdown,
  communityFeatures,
  layout = 'embedded',
  heroHeading,
  heroDescription,
  heroActions,
  badgeLabel,
  stats,
  infoCards,
  ctaSection,
}: PremiumHubContentProps) {
  const template = event.template;
  const heroBadge = badgeLabel ?? template?.name ?? 'Premium Event';
  const title = heroHeading ?? event.title;
  const description = heroDescription ?? event.welcome_message ?? event.description ?? '';
  const actionButtons = heroActions ?? defaultHeroActions;
  const infoItems = infoCards ?? defaultInfoCards;
  const statItems = stats ?? defaultStats(event);
  const cta = ctaSection ?? defaultCTASection;
  const publishedFeatures = enabledFeatures(communityFeatures);
  const isPageLayout = layout === 'page';
  const dateLabel = formatEventDate(event.date);
  const attendeeLabel = event.attendees
    ? `${event.attendees.toLocaleString()} confirmed attendees`
    : 'Attendee count coming soon';

  const heroGridClasses = isPageLayout
    ? 'grid gap-10 p-10 md:grid-cols-[1.2fr_0.8fr] md:items-center'
    : 'grid gap-8 p-8 md:grid-cols-[1.1fr_0.9fr] md:items-center';
  const heroCardClasses = isPageLayout
    ? 'rounded-3xl border border-white/20 bg-white/10 p-8 text-center backdrop-blur'
    : 'rounded-2xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur';
  const infoSectionWrapper = isPageLayout
    ? 'mt-12 rounded-3xl border bg-white shadow-sm'
    : 'rounded-2xl border bg-white';
  const infoSectionInner = isPageLayout
    ? 'grid gap-6 px-8 py-8 md:grid-cols-3'
    : 'grid gap-6 px-6 py-6 md:grid-cols-3';
  const infoSectionHeader = isPageLayout ? 'border-b px-8 py-6' : 'border-b px-6 py-5';
  const communitySectionWrapper = isPageLayout
    ? 'mt-12 rounded-3xl border bg-white p-8 shadow-sm'
    : 'rounded-2xl border bg-white p-6';
  const ctaSectionWrapper = isPageLayout
    ? 'mt-12 rounded-3xl border bg-gradient-to-br from-white via-primary/10 to-purple-50 px-10 py-12 shadow-sm'
    : 'rounded-2xl border bg-gradient-to-br from-white via-primary/10 to-purple-50 px-8 py-10';

  return (
    <>
      <section
        className={cn(
          'relative overflow-hidden border bg-gradient-to-br from-primary/80 via-purple-600 to-indigo-600 text-white',
          isPageLayout ? 'rounded-3xl shadow-xl' : 'rounded-2xl',
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_65%)]" />
        <div className={cn('relative', heroGridClasses)}>
          <div className="space-y-6">
            <Badge className="bg-white/20 text-white backdrop-blur-sm">{heroBadge}</Badge>
            <div className="space-y-3">
              <h2 className={cn('font-bold', isPageLayout ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl')}>
                {title}
              </h2>
              {description ? (
                <p className={cn('text-white/80', isPageLayout ? 'max-w-xl text-lg md:text-xl' : 'max-w-xl text-base md:text-lg')}>
                  {description}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3">
              {actionButtons.map(renderActionButton)}
            </div>
            <Separator className="bg-white/20" />
            <div className={cn('grid gap-6', isPageLayout ? 'sm:grid-cols-2' : 'grid-cols-2')}>
              {statItems.map(({ label, value }) => (
                <div key={label}>
                  <p className={cn('font-semibold', isPageLayout ? 'text-5xl' : 'text-4xl')}>{value}</p>
                  <p className="mt-1 text-sm uppercase tracking-widest text-white/70">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className={heroCardClasses}>
              <p className="text-sm uppercase tracking-[0.35em] text-white/70">Event Starts In</p>
              <h3 className={cn('font-semibold', isPageLayout ? 'mt-4 text-2xl' : 'mt-3 text-2xl')}>
                {event.title}
              </h3>
              <div className={cn('grid gap-4', isPageLayout ? 'mt-8 grid-cols-3' : 'mt-6 grid-cols-3')}>
                {([
                  { label: 'Days', value: countdown.days },
                  { label: 'Hours', value: countdown.hours },
                  { label: 'Minutes', value: countdown.minutes },
                ] as const).map(({ label, value }) => (
                  <div key={label} className="rounded-2xl bg-white/10 p-4">
                    <p className={cn('font-bold', isPageLayout ? 'text-4xl' : 'text-3xl')}>{value}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/70">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{dateLabel}</span>
                </div>
                {event.location ? (
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                ) : null}
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{attendeeLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={infoSectionWrapper}>
        <div className={infoSectionHeader}>
          <h3 className="text-lg font-semibold md:text-xl">Event Information</h3>
          <p className="text-sm text-muted-foreground">
            Stay close to the action with timely reminders, venue details, and schedule updates.
          </p>
        </div>
        <div className={infoSectionInner}>
          {infoItems.map(({ title: cardTitle, description, icon: Icon }) => (
            <div
              key={cardTitle}
              className="space-y-3 rounded-xl border border-border bg-white p-4 shadow-sm"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Icon className="h-4 w-4" />
                {cardTitle}
              </div>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={communitySectionWrapper}>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-lg font-semibold md:text-xl">Community Highlights</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Toggle premium community features to preview the attendee experience.
            </p>
          </div>
          <Button asChild variant="secondary" size="sm">
            <Link href="/dashboard/events/create">Create Your Premium Event</Link>
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 md:mt-6">
          {publishedFeatures.length > 0 ? (
            publishedFeatures.map((feature) => (
              <Badge key={feature.feature_type} variant="secondary" className="capitalize">
                {feature.feature_type.replace('_', ' ')}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">
              Enable community features to surface them here.
            </span>
          )}
        </div>
      </section>

      <section className={ctaSectionWrapper}>
        <div className="grid gap-6 md:grid-cols-[1.3fr_auto] md:items-center">
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-gray-900">{cta.title}</h3>
            <p className="text-base text-muted-foreground">{cta.description}</p>
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            {cta.actions.map((action) => renderActionButton(action))}
          </div>
        </div>
      </section>
    </>
  );
}
