'use server';

import { redirect } from 'next/navigation';

export async function signup(state: { error: string } | undefined, formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log('Signing up with:', { firstName, lastName, email, password });

  // Simulate signup
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  // redirect to a page after successful signup
  // for now, let's redirect to the dashboard
  redirect('/dashboard');
}
