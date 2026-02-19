-- Permettre aux admins de lire tous les profils (nécessaire pour la page Utilisateurs admin)
CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
