import { CreateEventForm } from '@/app/components/create-event-form';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function CreateEventPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
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

  const organizations = Array.from(organizationMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
        <div className="container mx-auto max-w-5xl py-8 flex flex-col items-center justify-center">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
          Create a New Event
        </h1>
        <p className="text-muted-foreground">
          Fill out the details below to get your event up and running.
        </p>
      </div>
      <CreateEventForm organizations={organizations} />
    </div>
  );
}
