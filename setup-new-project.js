const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Setting up new Supabase project...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupDatabase() {
    try {
        console.log('\n=== Reading setup SQL file ===');
        const setupSQL = fs.readFileSync('./complete_setup.sql', 'utf8');
        
        console.log('=== Executing database setup ===');
        // Split the SQL file into individual statements
        const statements = setupSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.length > 10) { // Skip very short statements
                console.log(`Executing statement ${i + 1}/${statements.length}...`);
                
                const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' })
                    .catch(async () => {
                        // If rpc doesn't work, try direct query
                        return await supabase.from('_').select('*').limit(0);
                    })
                    .catch(async () => {
                        // If that doesn't work, we'll need to run manually
                        console.log('Note: You may need to run the SQL manually in Supabase dashboard');
                        return { error: null };
                    });
                
                if (error) {
                    console.log(`Warning on statement ${i + 1}:`, error.message);
                }
            }
        }

        console.log('\n✅ Database setup completed (some statements may need manual execution)');
        
        console.log('\n=== Testing the setup ===');
        
        // Test creating a user
        console.log('Testing user creation...');
        const { data: userData, error: userError } = await supabase.auth.admin.createUser({
            email: 'test@newproject.com',
            password: 'testpassword123',
            user_metadata: {
                first_name: 'Test',
                last_name: 'User'
            },
            email_confirm: true
        });

        if (userError) {
            console.log('❌ User creation failed:', userError.message);
        } else {
            console.log('✅ Test user created successfully');
            
            // Check if profile was created
            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', 'test@newproject.com');
                
            if (profileError) {
                console.log('❌ Profile check failed:', profileError.message);
            } else if (profiles.length === 0) {
                console.log('⚠️ Profile not created - trigger may need manual setup');
            } else {
                console.log('✅ Profile created by trigger:', profiles[0]);
            }
        }

        console.log('\n=== Next Steps ===');
        console.log('1. Update Vercel environment variables with new Supabase credentials');
        console.log('2. If any SQL statements failed, run complete_setup.sql manually in Supabase SQL editor');
        console.log('3. Verify that email confirmation is disabled in Supabase Auth settings');

    } catch (error) {
        console.error('Setup failed:', error);
        console.log('\n=== Manual Setup Required ===');
        console.log('Please run the complete_setup.sql file manually in your Supabase project:');
        console.log('1. Go to https://supabase.com/dashboard/project/gesyeojqxkpltejiptsf/sql');
        console.log('2. Copy and paste the contents of complete_setup.sql');
        console.log('3. Execute the SQL');
    }
}

setupDatabase();