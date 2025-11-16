'use server';

import { createClient } from './server';
import { cookies } from 'next/headers';

export async function uploadFile(file: File, bucket: string): Promise<{ publicUrl: string | null; error: any | null }> {
  console.log(`Uploading file ${file.name} to bucket ${bucket}...`);

  try {
    const supabase = await createClient();
    
    // Generate unique filename to prevent conflicts
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    
    // Convert File to ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { publicUrl: null, error };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return { publicUrl: publicUrlData.publicUrl, error: null };
  } catch (error) {
    console.error('Upload error:', error);
    return { publicUrl: null, error };
  }
}
