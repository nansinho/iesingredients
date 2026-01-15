-- Add performance_value column for text values (like "Jusqu'à 3%", "1 Jour")
ALTER TABLE parfum_performance 
ADD COLUMN IF NOT EXISTS performance_value TEXT;

COMMENT ON COLUMN parfum_performance.performance_value IS 'Valeur textuelle optionnelle (ex: "Jusqu''à 3%", "1 Jour")';