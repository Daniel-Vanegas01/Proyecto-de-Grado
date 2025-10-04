import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://omqwfvsvpksgyqzwmlxr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tcXdmdnN2cGtzZ3lxendtbHhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3Njk4ODUsImV4cCI6MjA3NDM0NTg4NX0.rQV2T6_ygCrN8sesQRGzkfhi4GKyEbP4bzWAPCP92uY";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
