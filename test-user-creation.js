const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Testing manual user creation...');

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTestUser() {
    try {
        console.log('\n=== Creating Test User ===');
        
        const { data, error } = await supabase.auth.admin.createUser({
            email: 'test123@example.com',
            password: 'testpassword123',
            user_metadata: {
                first_name: 'Test',
                last_name: 'User'
            },
            email_confirm: true // This bypasses email confirmation
        });
        
        if (error) {
            console.log('❌ User creation failed:', error.message);
            console.log('Error details:', error);
        } else {
            console.log('✅ User created successfully:', data.user.email);
            console.log('User ID:', data.user.id);
            console.log('Email confirmed:', !!data.user.email_confirmed_at);
            console.log('Metadata:', data.user.user_metadata);
        }

        // Now check if the profile was created by the trigger
        console.log('\n=== Checking Profile Creation ===');
        
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', 'test123@example.com');
        
        if (profileError) {
            console.log('❌ Profile check failed:', profileError.message);
        } else if (profiles.length === 0) {
            console.log('⚠️  No profile found - trigger may not be working');
        } else {
            console.log('✅ Profile created:', profiles[0]);
        }

        // Test sign in with this user
        console.log('\n=== Testing Sign In ===');
        
        const clientSupabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        const { data: signInData, error: signInError } = await clientSupabase.auth.signInWithPassword({
            email: 'test123@example.com',
            password: 'testpassword123'
        });
        
        if (signInError) {
            console.log('❌ Sign in failed:', signInError.message);
        } else {
            console.log('✅ Sign in successful:', signInData.user.email);
        }

    } catch (error) {
        console.error('Test failed:', error);
    }
}

createTestUser();