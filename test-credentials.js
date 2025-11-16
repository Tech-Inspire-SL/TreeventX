const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

console.log('=== Checking Supabase Credentials ===');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('URL:', supabaseUrl);
console.log('Anon Key (first 20 chars):', supabaseAnonKey?.substring(0, 20) + '...');
console.log('Service Key available:', !!supabaseServiceKey);

// Test anon client
const anonClient = createClient(supabaseUrl, supabaseAnonKey);

// Test service client  
const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

async function testCredentials() {
    console.log('\n=== Testing Anon Client Auth Permissions ===');
    
    try {
        // Test if anon client can create users (it should be able to)
        const { data, error } = await anonClient.auth.signUp({
            email: `anontest${Date.now()}@example.com`,
            password: 'testpassword123'
        });
        
        if (error) {
            console.log('❌ Anon client signup failed:', error.message);
            console.log('Error code:', error.status);
            console.log('Error details:', JSON.stringify(error, null, 2));
        } else {
            console.log('✅ Anon client signup succeeded');
            console.log('User created:', !!data.user);
            console.log('Session created:', !!data.session);
        }
    } catch (e) {
        console.log('❌ Anon client exception:', e.message);
    }

    console.log('\n=== Testing Service Client ===');
    
    try {
        // List users with service client
        const { data: users, error: usersError } = await serviceClient.auth.admin.listUsers();
        
        if (usersError) {
            console.log('❌ Service client failed:', usersError.message);
        } else {
            console.log('✅ Service client works');
            console.log('Total users found:', users.users.length);
        }
    } catch (e) {
        console.log('❌ Service client exception:', e.message);
    }

    console.log('\n=== Checking Database Permissions ===');
    
    try {
        // Test if anon client can read from profiles table
        const { data: profiles, error: profilesError } = await anonClient
            .from('profiles')
            .select('count')
            .limit(1);
            
        if (profilesError) {
            console.log('❌ Anon client cannot read profiles:', profilesError.message);
            console.log('This might indicate RLS policy issues');
        } else {
            console.log('✅ Anon client can read profiles table');
        }
    } catch (e) {
        console.log('❌ Database test exception:', e.message);
    }
}

testCredentials();