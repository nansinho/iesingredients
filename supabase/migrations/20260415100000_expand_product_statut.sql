-- Élargit la contrainte statut sur les 6 tables produits
-- Statuts: ACTIF, INACTIF, BROUILLON, ARCHIVE, SUPPRIME

DO $$
DECLARE
  tbl text;
  con_name text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['aromes_fr', 'aromes_en', 'cosmetique_fr', 'cosmetique_en', 'parfum_fr', 'parfum_en']
  LOOP
    -- Skip if the table doesn't exist (e.g. _en variants not yet created)
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = tbl
    ) THEN
      RAISE NOTICE 'Skipping %: table does not exist', tbl;
      CONTINUE;
    END IF;

    -- Drop any existing CHECK constraint on statut
    FOR con_name IN
      SELECT conname
      FROM pg_constraint
      WHERE conrelid = ('public.' || tbl)::regclass
        AND contype = 'c'
        AND pg_get_constraintdef(oid) ILIKE '%statut%'
    LOOP
      EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT %I', tbl, con_name);
    END LOOP;

    -- Recreate with the new allowed values
    EXECUTE format(
      'ALTER TABLE public.%I ADD CONSTRAINT %I CHECK (statut IN (''ACTIF'', ''INACTIF'', ''BROUILLON'', ''ARCHIVE'', ''SUPPRIME''))',
      tbl,
      tbl || '_statut_check'
    );
  END LOOP;
END $$;
