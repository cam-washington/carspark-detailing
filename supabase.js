// Supabase connection for carsparkdetailing.com
// The anon key is a PUBLIC publishable key — safe to ship in client code.
// Data is protected by Row Level Security (see supabase/migrations/0001_init.sql).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.110.2";

const SUPABASE_URL = "https://vgiabjaurhfbhwroiaqe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnaWFiamF1cmhmYmh3cm9pYXFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MTIyMjgsImV4cCI6MjA5OTE4ODIyOH0.bDjHTc_XBa-IWN1tXJTuzRquZHUjAq2Ru6UW4RYt_Xg";

export const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.sb = sb; // exposed for console testing / future form wiring
