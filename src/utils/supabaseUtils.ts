export const getSupabaseUrl = () => {
  return import.meta.env.VITE_SUPABASE_URL || 'https://czrcrxgxvbmxycszvuag.supabase.co';
};

export const getSupabaseAnonKey = () => {
  return import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cmNyeGd4dmJteHljc3p2dWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ0MjI0MDAsImV4cCI6MjAxOTk5ODQwMH0.yrXJzT6zQEv4uVYoRiNZo5MWe4vvXNzOk1nPxL_qy0Q';
};