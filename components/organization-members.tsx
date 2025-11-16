import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { OrganizationMembersClient } from './organization-members-client';

interface OrganizationMembersProps {
  organizationId: string;
  userRole: 'owner' | 'admin' | 'member';
  ownerId: string;
}

export async function OrganizationMembers({
  organizationId,
  userRole,
  ownerId,
}: OrganizationMembersProps) {
  const cookieStore = await cookies();
  const supabase = await createClient();

  const { data: members } = await supabase
    .from('organization_members')
    .select(`
      id,
      user_id,
      role,
      profiles (
        first_name,
        last_name,
        email
      )
    `)
    .eq('organization_id', organizationId)
    .order('role', { ascending: true });

  const formattedMembers = members?.map(m => {
    const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
    return {
      ...m,
      profiles: profile ? {
        ...profile,
        full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User'
      } : null,
    };
  }) || [];

  return (
    <OrganizationMembersClient
      organizationId={organizationId}
      members={formattedMembers}
      userRole={userRole}
      ownerId={ownerId}
    />
  );
}