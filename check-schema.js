const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDatabaseSetup() {
    console.log('=== Checking Database Schema ===');
    
    const tablesToCheck = [
        'profiles',
        'organizations', 
        'events',
        'tickets',
        'following'
    ];
    
    for (const table of tablesToCheck) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .limit(1);
                
            if (error) {
                console.log(`❌ Table "${table}": ${error.message}`);
            } else {
                console.log(`✅ Table "${table}": exists`);
            }
        } catch (e) {
            console.log(`❌ Table "${table}": ${e.message}`);
        }
    }
    
    // Check if trigger exists
    console.log('\n=== Checking Database Functions ===');
    try {
        const { data, error } = await supabase
            .rpc('handle_new_user');
    } catch (e) {
        if (e.message.includes('could not find function')) {
            console.log('❌ handle_new_user function: NOT FOUND');
            console.log('You need to run the complete_setup.sql file');
        } else {
            console.log('✅ handle_new_user function: exists');
        }
    }
}

checkDatabaseSetup();