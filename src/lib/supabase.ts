import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vuqtlzincazrqyrcidkd.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1cXRsemluY2F6cnF5cmNpZGtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1ODMwMzIsImV4cCI6MjA4NDE1OTAzMn0.7TMnjnPz13z940aCR7onH47aDqp1NBDmSPu38K2PzSs'

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
