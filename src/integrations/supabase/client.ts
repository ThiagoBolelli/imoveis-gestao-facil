
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mvawienwbduzetszfvtq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12YXdpZW53YmR1emV0c3pmdnRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0ODEzMjcsImV4cCI6MjA2MTA1NzMyN30.Uo3OOYZmZKLsLj1aegZjT-hRwmLVTFBEGhnmgsMUcg8";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
