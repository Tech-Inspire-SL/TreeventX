const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Service Key available:', !!supabaseServiceKey);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDatabase() {
    try {
        // Test 1: Check if we can connect to the database
        console.log('\n=== Testing Database Connection ===');
        const { data: connection, error: connectionError } = await supabase
            .from('profiles')
            .select('count')
            .limit(1);
        
        if (connectionError) {
            console.log('Connection Error:', connectionError.message);
        } else {
            console.log('✅ Database connection successful');
        }

        // Test 2: List all users in auth.users (if we have service key)
        console.log('\n=== Checking Auth Users ===');
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
            console.log('Auth Error:', authError.message);
        } else {
            console.log(`Found ${authUsers.users.length} users in auth.users:`);
            authUsers.users.forEach(user => {
                console.log(`- ${user.email} (ID: ${user.id}, Confirmed: ${!!user.email_confirmed_at})`);
            });
        }

        // Test 3: List all profiles
        console.log('\n=== Checking Profiles Table ===');
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*');
        
        if (profilesError) {
            console.log('Profiles Error:', profilesError.message);
        } else {
            console.log(`Found ${profiles.length} profiles:`);
            profiles.forEach(profile => {
                console.log(`- ${profile.email} (ID: ${profile.id}, Name: ${profile.first_name} ${profile.last_name})`);
            });
        }

        // Test 4: Check if trigger function exists
        console.log('\n=== Checking Trigger Function ===');
        const { data: functions, error: functionsError } = await supabase
            .rpc('check_function_exists', { function_name: 'handle_new_user' })
            .then(() => ({ data: 'Function exists', error: null }))
            .catch(err => ({ data: null, error: err }));
        
        if (functionsError) {
            console.log('Function check error:', functionsError.message);
        } else {
            console.log('✅ handle_new_user function exists');
        }

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testDatabase();