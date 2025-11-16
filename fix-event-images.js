import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixEventImages() {
  try {
    // Find events with example.com URLs
    const { data: events, error: fetchError } = await supabase
      .from('events')
      .select('id, title, cover_image')
      .like('cover_image', '%example.com%');

    if (fetchError) {
      console.error('Error fetching events:', fetchError);
      return;
    }

    console.log(`Found ${events?.length || 0} events with example.com URLs`);

    if (events && events.length > 0) {
      // Update these events to have null cover_image
      const eventIds = events.map(event => event.id);
      
      const { error: updateError } = await supabase
        .from('events')
        .update({ cover_image: null })
        .in('id', eventIds);

      if (updateError) {
        console.error('Error updating events:', updateError);
        return;
      }

      console.log(`Updated ${events.length} events to remove example.com URLs`);
      events.forEach(event => {
        console.log(`- Event: ${event.title} (ID: ${event.id})`);
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

fixEventImages();