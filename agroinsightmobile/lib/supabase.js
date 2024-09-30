// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://blgknppxinismmbibzfm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsZ2tucHB4aW5pc21tYmliemZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYwNDczMzEsImV4cCI6MjA0MTYyMzMzMX0.U0W6-buzTmijAG6Tg2s_cxH_39xtjS5OxfZRWyaHF0M';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
