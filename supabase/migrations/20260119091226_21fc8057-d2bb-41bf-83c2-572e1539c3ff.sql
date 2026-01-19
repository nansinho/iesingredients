-- parfum_fr : Ajouter politiques admin
CREATE POLICY "Admins can insert parfum"
  ON public.parfum_fr FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update parfum"
  ON public.parfum_fr FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete parfum"
  ON public.parfum_fr FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- cosmetique_fr : Ajouter politiques admin
CREATE POLICY "Admins can insert cosmetique"
  ON public.cosmetique_fr FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update cosmetique"
  ON public.cosmetique_fr FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete cosmetique"
  ON public.cosmetique_fr FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- aromes_fr : Ajouter politiques admin
CREATE POLICY "Admins can insert arome"
  ON public.aromes_fr FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update arome"
  ON public.aromes_fr FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete arome"
  ON public.aromes_fr FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));