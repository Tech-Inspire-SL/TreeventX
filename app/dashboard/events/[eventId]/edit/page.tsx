
import { CreateEventForm } from '@/app/components/create-event-form';
import { getEventDetails } from '@/lib/server/queries/events';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function EditEventPage(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  const eventId = parseInt(params.eventId, 10);
  const { data: event, error } = await getEventDetails(eventId);

  if (error || !event || !user || user.id !== event.organizer_id) {
    redirect('/dashboard/events');
  }

  const { data: memberships } = await supabase
    .from('organization_members')
    .select('organizations ( id, name )')
    .eq('user_id', user.id);

  const organizationMap = new Map<string, { id: string; name: string }>();

  (memberships ?? []).forEach((membership) => {
    const orgRecord = Array.isArray(membership.organizations)
      ? membership.organizations[0]
      : membership.organizations;
    if (orgRecord?.id) {
      organizationMap.set(orgRecord.id, { id: orgRecord.id, name: orgRecord.name });
    }
  });

  if (event.organization?.id && !organizationMap.has(event.organization.id)) {
    organizationMap.set(event.organization.id, {
      id: event.organization.id,
      name: event.organization.name,
    });
  }

  const organizations = Array.from(organizationMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Map event data to form values
  const normalizedFeeBearer: 'organizer' | 'buyer' =
    event.fee_bearer === 'organizer'
      ? 'organizer'
      : 'buyer';

  const allowedCategories = [
    'conference',
    'workshop',
    'festival',
    'concert',
    'seminar',
    'networking',
    'sports',
    'community',
    'other',
  ] as const;

  const eventCategory = allowedCategories.includes(event.category as typeof allowedCategories[number])
    ? (event.category as typeof allowedCategories[number])
    : 'other';

  const allowedCommunityFeatures = [
    'gallery',
    'timeline',
    'comments',
    'feedback',
    'resources',
    'newsletter',
  ] as const;

  const communityFeatures = (event.community_features || [])
    .filter((feature: { is_enabled: boolean }) => feature.is_enabled)
    .map((feature: { feature_type: string }) => feature.feature_type)
    .filter((feature): feature is typeof allowedCommunityFeatures[number] =>
      allowedCommunityFeatures.includes(feature as typeof allowedCommunityFeatures[number])
    );

  const defaultValues = {
    title: event.title ?? '',
    description: event.description ?? '',
    category: eventCategory,
    date: new Date(event.date),
    end_date: event.end_date ? new Date(event.end_date) : undefined,
    location: event.location ?? '',
    capacity: event.capacity ?? undefined,
    targetAudience: 'Users', // This field is not in the db, providing a default
    current_cover_image: event.cover_image || undefined,
    scanners: (event.scanners || []).map((s: { profiles: { email: string } }) => ({ email: s.profiles.email })),
    customFields: event.event_form_fields?.map(f => ({ field_name: f.field_name, field_type: f.field_type as any, is_required: f.is_required, options: f.options ? f.options.map(o => ({ value: o.value })) : undefined })),
    is_paid: event.is_paid ?? false,
    price: event.price ?? undefined,
    fee_bearer: normalizedFeeBearer,
    is_public: event.is_public ?? true,
    requires_approval: event.requires_approval ?? false,
    premium_features_enabled: event.premium_features_enabled ?? false,
    community_enabled: event.community_enabled ?? false,
    communityFeatures,
    organization_id: event.organization_id ?? '',
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
          Edit Event
        </h1>
        <p className="text-muted-foreground">
          Update the details for your event.
        </p>
      </div>
      <CreateEventForm event={event} defaultValues={defaultValues} organizations={organizations} />
    </div>
  );
}
