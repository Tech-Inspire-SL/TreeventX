
'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '../supabase/server';

export async function login(prevState: { error: string | undefined } | undefined, formData: FormData) {
  const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log('Attempting login with:', { email, password: '***' });

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log('Login result:', { error: error?.message, user: data?.user?.email });

  if (error) {
    console.log('Login failed with error:', error.message);
    return {
      error: error.message,
    };
  }

  redirect('/dashboard');
}

export async function signup(prevState: { error: string | undefined } | undefined, formData: FormData) {
    // First, log that the function was called
    console.log('🚀 SIGNUP FUNCTION CALLED');
    console.log('Environment check:');
    console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY (first 20):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20));
    
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    console.log('=== SIGNUP ATTEMPT ===');
    console.log('Form data:', { email, firstName, lastName, password: '***' });

    try {
        // Try the normal signup first
        const { error, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                },
            },
        });

        console.log('=== SIGNUP RESPONSE ===');
        console.log('Error:', error);
        console.log('User created:', !!data?.user);
        console.log('User ID:', data?.user?.id);
        console.log('User email:', data?.user?.email);
        console.log('Email confirmed at:', data?.user?.email_confirmed_at);
        console.log('Session created:', !!data?.session);
        console.log('User metadata:', data?.user?.user_metadata);
        console.log('Full data object:', JSON.stringify(data, null, 2));

        if (error) {
            console.log('❌ Signup failed with error:', error.message);
            console.log('Error code:', error.status);
            console.log('Error details:', JSON.stringify(error, null, 2));
            return {
                error: error.message,
            };
        }

        // If no session was created, but user exists
        if (data?.user && !data?.session) {
            console.log('⚠️ User created but no session - checking why...');
            
            // Try to get current session
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            console.log('Current session check:', { 
                hasSession: !!sessionData?.session, 
                sessionError: sessionError?.message 
            });

            // Try immediate sign in
            console.log('Attempting immediate sign in...');
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            console.log('Sign in attempt result:', { 
                success: !!signInData?.user, 
                error: signInError?.message 
            });

            if (signInError) {
                return {
                    error: `Account created but sign-in failed: ${signInError.message}`,
                };
            }
        }

        console.log('✅ Signup completed successfully, redirecting to dashboard');

    } catch (unexpectedError) {
        console.error('❌ Unexpected error during signup:', unexpectedError);
        return {
            error: 'An unexpected error occurred during signup.',
        };
    }

    redirect('/dashboard');
}

export async function logout() {
  const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
  await supabase.auth.signOut();
  redirect('/login');
}
