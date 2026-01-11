import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received sync-parfums request');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const payload = await req.json();
    const payloadStr = JSON.stringify(payload);
    console.log('Payload received:', payloadStr.substring(0, 1000));

    const extractItems = (input: any): any[] => {
      if (Array.isArray(input)) return input;
      if (!input || typeof input !== 'object') return [];
      if (Array.isArray(input.items)) return input.items.map((it: any) => it?.json ?? it);
      if (Array.isArray(input.data)) return input.data.map((it: any) => it?.json ?? it);
      if (input.json && typeof input.json === 'object') return [input.json];
      return [input];
    };

    const get = (obj: any, keys: string[]) => {
      for (const k of keys) {
        const v = obj?.[k];
        if (v !== undefined && v !== '') return v;
      }
      return null;
    };

    const products = extractItems(payload);
    console.log(`Processing ${products.length} parfum(s)`);

    // Détecter un payload n8n mal configuré
    const keys0 = products[0] ? Object.keys(products[0]) : [];
    if (products.length === 0 || (keys0.length === 1 && keys0[0] === '')) {
      return new Response(JSON.stringify({
        success: false,
        error: "Payload vide ou mal formé depuis n8n.",
        hint: "Dans le node HTTP Request, mets Body Content Type = JSON et Body = {{$json}} (mode RAW/JSON), pas en paramètres.",
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Mapping spécifique pour les parfums
    const mappedProducts = products.map((p: any) => {
      // Récupérer le statut depuis le Sheet
      const rawStatut = get(p, ["Statut", "statut", "Status", "status"]);
      let statut = 'ACTIF';
      if (rawStatut) {
        const normalized = String(rawStatut).toUpperCase().trim();
        if (normalized === 'SUPPRIMER' || normalized === 'SUPPRIME' || normalized === 'DELETE' || normalized === 'DELETED') {
          statut = 'SUPPRIME';
        } else if (normalized === 'INACTIF' || normalized === 'INACTIVE') {
          statut = 'INACTIF';
        } else {
          statut = 'ACTIF';
        }
      }

      return {
        nom_commercial: get(p, ["Nom Commercial", "Nom commercial", "nom_commercial", "nom commercial", "Nom"]),
        typologie_de_produit: get(p, ["Typologie de produit", "typologie_de_produit", "typologie", "Typologie"]) || 'PARFUM',
        famille_olfactive: get(p, ["Famille olfactive", "famille_olfactive", "Famille Olfactive"]),
        origine: get(p, ["Origine", "origine"]),
        tracabilite: get(p, ["Traçabilité", "Tracabilite", "tracabilite", "traçabilité"]),
        code: get(p, ["Code", "code"]),
        cas_no: get(p, ["CAS No.", "CAS N°", "CAS No", "CAS", "cas_no", "cas"]),
        nom_latin: get(p, ["Nom latin", "nom_latin", "Nom Latin"]),
        food_grade: get(p, ["FOOD GRADE", "Food Grade", "food_grade"]),
        flavouring_preparation: get(p, ["Flavouring preparation", "flavouring_preparation"]),
        profil_olfactif: get(p, ["Profil olfactif", "profil_olfactif", "Profil Olfactif"]),
        description: get(p, ["Description", "description"]),
        aspect: get(p, ["Aspect", "aspect"]),
        calendrier_des_recoltes: get(p, ["Calendrier des récoltes", "Calendrier des recoltes", "calendrier_des_recoltes"]),
        performance: get(p, ["Performance", "performance"]),
        ph: get(p, ["pH", "ph", "PH"]),
        base: get(p, ["Base", "base"]),
        odeur: get(p, ["Odeur", "odeur"]),
        certifications: get(p, ["Certifications", "certifications"]),
        valorisations: get(p, ["Valorisations", "valorisations"]),
        statut: statut,
      };
    });

    // Éviter d'insérer des lignes totalement vides
    const nonEmpty = mappedProducts.filter((mp) => {
      const { statut, ...rest } = mp;
      return Object.values(rest).some((v) => v !== null);
    });

    if (nonEmpty.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: "Aucune colonne reconnue dans le payload : toutes les valeurs sont null.",
        received_keys_sample: keys0,
        hint: "Vérifie que les en-têtes Google Sheets correspondent (ex: 'Nom commercial', 'Famille olfactive', etc.).",
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Dédupliquer par code (garder la première occurrence)
    const deduplicatedMap = new Map<string, typeof nonEmpty[0]>();
    for (const p of nonEmpty) {
      const key = String(p.code || p.nom_commercial || Math.random());
      if (!deduplicatedMap.has(key)) {
        deduplicatedMap.set(key, p);
      }
    }
    const deduplicated = Array.from(deduplicatedMap.values());
    console.log(`Après déduplication: ${deduplicated.length} parfum(s) uniques (avant: ${nonEmpty.length})`);

    // Séparer les produits actifs et les produits à supprimer
    const activeProducts = deduplicated.filter(p => p.statut === 'ACTIF' || p.statut === 'INACTIF');
    const deletedProducts = deduplicated.filter(p => p.statut === 'SUPPRIME');

    console.log(`Parfums actifs/inactifs: ${activeProducts.length}, Parfums marqués SUPPRIME: ${deletedProducts.length}`);
    console.log('Sample mapped parfum:', JSON.stringify(deduplicated[0]));

    let upsertedCount = 0;
    let deletedCount = 0;

    // 1. Upsert des parfums actifs/inactifs dans parfum_fr
    if (activeProducts.length > 0) {
      const { data, error } = await supabase
        .from('parfum_fr')
        .upsert(activeProducts, { onConflict: 'code' })
        .select();

      if (error) {
        console.error('Supabase upsert error:', error);
        throw error;
      }

      upsertedCount = data?.length || 0;
      console.log(`Upsert réussi: ${upsertedCount} parfum(s)`);
    }

    // 2. Supprimer les parfums marqués SUPPRIME
    if (deletedProducts.length > 0) {
      const codesToDelete = deletedProducts.map(p => p.code).filter(Boolean);
      console.log(`Codes à supprimer: ${codesToDelete.join(', ')}`);

      const { error: deleteError } = await supabase
        .from('parfum_fr')
        .delete()
        .in('code', codesToDelete);

      if (deleteError) {
        console.error('Erreur suppression:', deleteError);
      } else {
        deletedCount = codesToDelete.length;
        console.log(`Supprimé ${deletedCount} parfum(s)`);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      upserted: upsertedCount,
      deleted: deletedCount,
      message: `${upsertedCount} parfum(s) mis à jour, ${deletedCount} supprimé(s)`
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in sync-parfums:', errorMessage);
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
