-- 1. Supprimer les doublons en gardant le plus récent (id le plus élevé)
DELETE FROM public.cosmetique_fr a
USING public.cosmetique_fr b
WHERE a.code = b.code 
  AND a.code IS NOT NULL
  AND a.id < b.id;

-- 2. Ajouter la contrainte UNIQUE sur le champ code
ALTER TABLE public.cosmetique_fr 
ADD CONSTRAINT cosmetique_fr_code_unique UNIQUE (code);