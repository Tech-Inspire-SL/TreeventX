
'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { DashboardClientLayout } from './dashboard-client-layout';
import { DashboardHeader } from '../components/dashboard-header';

async function getActiveEventCount(userId: string) {
  const cookieStore = await cookies();
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('organizer_id', userId)
    .gt('date', new Date().toISOString());

  if (error) {
    console.error("Error fetching active event count:", error);
    return 0;
  }
  return count || 0;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const activeEventCount = user ? await getActiveEventCount(user.id) : 0;
  
  return (
    <DashboardClientLayout activeEventCount={activeEventCount}>
        <DashboardHeader />
        {children}
    </DashboardClientLayout>
  );
}
