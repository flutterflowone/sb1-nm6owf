import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ejarvuhlgjvzkqsftlwx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqYXJ2dWhsZ2p2emtxc2Z0bHd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4MzI2MDAsImV4cCI6MjA0MzQwODYwMH0.XpLK8xWS_vdOMon-t35bg4FGwYOOP7i6vX6roDvSKmU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);