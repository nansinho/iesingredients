-- Ajouter les colonnes de performance détaillées pour parfum_fr
ALTER TABLE public.parfum_fr 
ADD COLUMN IF NOT EXISTS option_1 text,
ADD COLUMN IF NOT EXISTS performance_1 text,
ADD COLUMN IF NOT EXISTS option_2 text,
ADD COLUMN IF NOT EXISTS performance_2 text,
ADD COLUMN IF NOT EXISTS option_3 text,
ADD COLUMN IF NOT EXISTS performance_3 text,
ADD COLUMN IF NOT EXISTS option_4 text,
ADD COLUMN IF NOT EXISTS performance_4 text,
ADD COLUMN IF NOT EXISTS option_5 text,
ADD COLUMN IF NOT EXISTS performance_5 text,
ADD COLUMN IF NOT EXISTS option_6 text,
ADD COLUMN IF NOT EXISTS performance_6 text;