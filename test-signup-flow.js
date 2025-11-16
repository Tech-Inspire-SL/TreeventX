const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing signup flow with client credentials...');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignup() {
    try {
        const testUser = {
            email: `test${Date.now()}@example.com`,
            password: 'testpassword123',
            firstName: 'Test',
            lastName: 'User'
        };

        console.log('\n=== Testing Signup ===');
        console.log('Email:', testUser.email);
        
        const { error, data } = await supabase.auth.signUp({
            email: testUser.email,
            password: testUser.password,
            options: {
                data: {
                    first_name: testUser.firstName,
                    last_name: testUser.lastName,
                },
            },
        });

        console.log('\n=== Signup Result ===');
        console.log('Error:', error?.message || 'None');
        console.log('User created:', !!data?.user);
        console.log('User ID:', data?.user?.id || 'None');
        console.log('User email:', data?.user?.email || 'None');
        console.log('Email confirmed:', !!data?.user?.email_confirmed_at);
        console.log('Session created:', !!data?.session);
        console.log('User metadata:', data?.user?.user_metadata);

        if (error) {
            console.log('\n❌ Signup failed');
            console.log('Error details:', JSON.stringify(error, null, 2));
            return;
        }

        if (data?.user && !data?.session) {
            console.log('\n⚠️ User created but no session');
            
            // Try to sign in immediately
            console.log('\n=== Testing Immediate Sign In ===');
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: testUser.email,
                password: testUser.password,
            });

            console.log('Sign in error:', signInError?.message || 'None');
            console.log('Sign in success:', !!signInData?.user);
            
            if (signInError) {
                console.log('❌ Sign in failed after signup');
                console.log('Sign in error details:', JSON.stringify(signInError, null, 2));
            } else {
                console.log('✅ Sign in successful after signup');
            }
        } else if (data?.session) {
            console.log('\n✅ Signup successful with immediate session');
        }

        // Final check - are there any users in the database now?
        console.log('\n=== Final Database Check ===');
        const adminSupabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);
        const { data: users, error: usersError } = await adminSupabase.auth.admin.listUsers();
        
        if (usersError) {
            console.log('Could not check users:', usersError.message);
        } else {
            console.log(`Total users in database: ${users.users.length}`);
            const ourUser = users.users.find(u => u.email === testUser.email);
            if (ourUser) {
                console.log('✅ Our test user was created in database');
                console.log('User confirmed:', !!ourUser.email_confirmed_at);
            } else {
                console.log('❌ Our test user NOT found in database');
            }
        }

    } catch (error) {
        console.error('Test failed with exception:', error);
    }
}

testSignup();