-- Schedule daily translation at 2 AM UTC
SELECT cron.schedule(
  'translate-products-daily',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://urgmkyhvwpxxzldnebvm.supabase.co/functions/v1/translate-products',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyZ21reWh2d3B4eHpsZG5lYnZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODA4MzcsImV4cCI6MjA4MTU1NjgzN30.46jRLdb39toa_ssAQwrfNnJL3-knmO18cIaDG-Zj7-g"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);