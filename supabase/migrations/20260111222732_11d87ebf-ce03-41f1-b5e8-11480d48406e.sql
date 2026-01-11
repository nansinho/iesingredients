-- Ajouter les colonnes de performance par base/application pour parfum_fr
-- Chaque application a un pH, une base et une note d'odeur
ALTER TABLE public.parfum_fr 
-- Nettoyant acide (pH 2)
ADD COLUMN IF NOT EXISTS ph_nettoyant_acide text,
ADD COLUMN IF NOT EXISTS odeur_nettoyant_acide text,
-- Assouplissant textile (pH 3)
ADD COLUMN IF NOT EXISTS ph_assouplissant_textile text,
ADD COLUMN IF NOT EXISTS odeur_assouplissant_textile text,
-- Antisudorifique (pH 3.5)
ADD COLUMN IF NOT EXISTS ph_antisudorifique text,
ADD COLUMN IF NOT EXISTS odeur_antisudorifique text,
-- Shampooing (pH 6)
ADD COLUMN IF NOT EXISTS ph_shampooing text,
ADD COLUMN IF NOT EXISTS odeur_shampooing text,
-- APC (pH 9)
ADD COLUMN IF NOT EXISTS ph_apc text,
ADD COLUMN IF NOT EXISTS odeur_apc text,
-- Détergent liquide pour tissus (pH 9)
ADD COLUMN IF NOT EXISTS ph_detergent_liquide text,
ADD COLUMN IF NOT EXISTS odeur_detergent_liquide text,
-- Savon (pH 10)
ADD COLUMN IF NOT EXISTS ph_savon text,
ADD COLUMN IF NOT EXISTS odeur_savon text,
-- Détergent en poudre (pH 10.5)
ADD COLUMN IF NOT EXISTS ph_detergent_poudre text,
ADD COLUMN IF NOT EXISTS odeur_detergent_poudre text,
-- Eau de Javel (pH 11)
ADD COLUMN IF NOT EXISTS ph_eau_javel text,
ADD COLUMN IF NOT EXISTS odeur_eau_javel text;