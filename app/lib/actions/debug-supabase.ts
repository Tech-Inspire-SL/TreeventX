'use server';

export async function debugSupabaseConfig() {
    console.log('=== Supabase Config Debug (Server Side) ===');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY (first 20):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20));
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    // Test creating a client
    const { createClient } = require('@supabase/supabase-js');
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.log('❌ Missing environment variables!');
        return { error: 'Missing environment variables' };
    }
    
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
        
        console.log('✅ Supabase client created successfully');
        
        // Test a simple auth operation
        const testEmail = `servertest${Date.now()}@example.com`;
        const { data, error } = await supabase.auth.signUp({
            email: testEmail,
            password: 'testpassword123'
        });
        
        if (error) {
            console.log('❌ Server-side signup test failed:', error.message);
            return { error: error.message };
        }
        
        console.log('✅ Server-side signup test succeeded');
        console.log('User created:', !!data.user);
        console.log('Session created:', !!data.session);
        
        return { success: true, userCreated: !!data.user, sessionCreated: !!data.session };
        
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        console.log('❌ Server-side test exception:', errorMessage);
        return { error: errorMessage };
    }
}