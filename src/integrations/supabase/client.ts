// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hictgxjavizoycelkzmy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpY3RneGphdml6b3ljZWxrem15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMTU4NzEsImV4cCI6MjA1MTg5MTg3MX0.57Pqk0_RfFa49Gkogh5Mi8fZ9o_N9D91Nu9dBqbksAM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);