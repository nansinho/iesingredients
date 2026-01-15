-- Add admin role to the existing user
INSERT INTO public.user_roles (user_id, role)
VALUES ('aaa7ee33-78a8-4e1b-8490-2f4315a4a3f8', 'admin')
ON CONFLICT DO NOTHING;