// QUICK FIX - Use this temporarily if email confirmation is the issue

'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '../supabase/server';

// Service role client for admin operations
function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    const { createClient } = require('@supabase/supabase-js');
    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

export async function signupWithAdminBypass(prevState: { error: string | undefined } | undefined, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    console.log('Creating user with admin bypass:', { email, firstName, lastName });

    try {
        // Create user with admin client (bypasses email confirmation)
        const adminSupabase = createAdminClient();
        
        const { data: adminData, error: adminError } = await adminSupabase.auth.admin.createUser({
            email,
            password,
            user_metadata: {
                first_name: firstName,
                last_name: lastName,
            },
            email_confirm: true // This bypasses email confirmation
        });

        if (adminError) {
            console.log('Admin user creation failed:', adminError.message);
            return {
                error: adminError.message,
            };
        }

        console.log('User created via admin:', adminData.user.email);

        // Now sign in the user with the regular client
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            console.log('Auto sign-in failed:', signInError.message);
            // User was created but auto sign-in failed, redirect to login
            redirect('/login?message=Account created successfully. Please sign in.');
        }

        console.log('User signed in successfully');
        redirect('/dashboard');

    } catch (error) {
        console.error('Signup process failed:', error);
        return {
            error: 'An unexpected error occurred during signup.',
        };
    }
}