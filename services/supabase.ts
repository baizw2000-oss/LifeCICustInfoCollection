import { createClient } from '@supabase/supabase-js';
import { ApplicationData } from '../types';

// ==========================================
// 🛠 SUPABASE CONFIGURATION
// ==========================================

// Helper to safely get env vars without crashing in browser
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) return process.env[key];
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) return import.meta.env[key];
  } catch (e) {
    return undefined;
  }
  return undefined;
};

// 🔴 CONFIGURATION
const SUPABASE_URL = getEnv('REACT_APP_SUPABASE_URL') || getEnv('VITE_SUPABASE_URL') || 'https://oikfmvcsasrmbdeivuiy.supabase.co';
const SUPABASE_ANON_KEY = getEnv('REACT_APP_SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_ANON_KEY') 
     || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pa2ZtdmNzYXNybWJkZWl2dWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTE5MTEsImV4cCI6MjA4MTY4NzkxMX0.IfYz5i9DICrelW8QvO78x1mjiq0YmFxArAlczcYpwSQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const uploadFile = async (file: File, path: string) => {
  try {
    if (!SUPABASE_URL.includes('supabase.co')) throw new Error("Supabase URL not configured");

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (error) throw error;
    return data?.path;
  } catch (error) {
    console.warn('File upload skipped or failed (non-critical):', error);
    // Return a mock path so the form can still submit even if file upload fails
    return `mock/path/${file.name}`;
  }
};

export const submitApplication = async (formData: ApplicationData, licenseFileUrl: string | null) => {
  try {
    // 1. Generate a unique Reference ID on the client side
    // This ensures we have an ID to track even if we don't read back from DB immediately
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14); // e.g. 20231025120000
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const referenceId = `APP-${timestamp}-${random}`;

    // 2. Prepare payload
    const payload = {
      ...formData,
      referenceId, // Store the ID in the JSON
      owner: {
        ...formData.owner,
        driversLicenseUrl: licenseFileUrl,
      },
      submittedAt: new Date().toISOString(),
    };

    // 3. Insert into Supabase (Table: lifeci_applications)
    // CRITICAL FIX: Removed .select() to prevent RLS "Select" permission errors.
    // We strictly perform an INSERT operation.
    const { error } = await supabase
      .from('lifeci_applications')
      .insert([
        { 
          form_data: payload,
          status: 'new'
        }
      ]);

    if (error) {
      console.error("Supabase DB Error:", error);
      throw error;
    }

    // 4. Trigger Email (Edge Function)
    // We pass the payload and our generated referenceId
    try {
        const { error: funcError } = await supabase.functions.invoke('send_lifeci_email', {
            body: { 
                record: payload,
                applicationId: referenceId 
            }
        });
        if (funcError) console.warn("Email function warning:", funcError);
    } catch (emailErr) {
        console.warn("Could not trigger email function (non-critical):", emailErr);
    }

    return { success: true, referenceId };

  } catch (error: any) {
    console.error('Submission error details:', error);
    return { 
        success: false, 
        error: error.message || error.error_description || "Unknown error" 
    };
  }
};