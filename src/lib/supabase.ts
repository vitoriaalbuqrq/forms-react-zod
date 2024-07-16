import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    'https://txconhshicsxwlzrdrun.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4Y29uaHNoaWNzeHdsenJkcnVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMDkwODU1MCwiZXhwIjoyMDM2NDg0NTUwfQ.R8g0LbrH7-bxrqx-eacAXrkZk1a9LHFZP3Gq4nXQJjw'
)