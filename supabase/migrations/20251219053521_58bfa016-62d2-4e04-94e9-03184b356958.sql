-- Supprimer les données de test (CINDY, 212121, entrées sans code)
DELETE FROM public.cosmetique_fr 
WHERE nom_commercial IN ('CINDY', '212121') 
   OR code IS NULL 
   OR code = '' 
   OR gamme = 'CINDY';