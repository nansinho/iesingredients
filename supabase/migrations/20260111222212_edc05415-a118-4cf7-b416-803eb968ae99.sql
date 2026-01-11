-- Ajouter une contrainte unique sur la colonne 'code' pour permettre l'upsert
ALTER TABLE public.parfum_fr ADD CONSTRAINT parfum_fr_code_unique UNIQUE (code);