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
    console.log('Received sync-products request');
    
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
    console.log(`Processing ${products.length} item(s)`);

    // Détecter un payload n8n mal configuré (souvent {"":""})
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

    // Mapping (tolérant aux variantes avec/sans accents et majuscules)
    // NOUVEAU: On récupère aussi la colonne "Statut" depuis le Sheet
    const mappedProducts = products.map((p: any) => {
      // Récupérer le statut depuis le Sheet (ACTIF, SUPPRIMER, INACTIF, etc.)
      const rawStatut = get(p, ["Statut", "statut", "Status", "status"]);
      // Normaliser: si vide ou absent -> ACTIF par défaut
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
        nom_commercial: get(p, ["Nom Commercial", "Nom commercial", "Nom commercial ", "nom_commercial", "nom commercial", "Nom"]),
        typologie_de_produit: get(p, ["Typologie de produit", "typologie_de_produit", "typologie", "Typologie"]),
        gamme: get(p, ["Gamme", "gamme"]),
        origine: get(p, ["Origine", "origine"]),
        tracabilite: get(p, ["Traçabilité", "Tracabilite", "tracabilite", "traçabilité"]),
        code: get(p, ["Code", "code"]),
        cas_no: get(p, ["CAS No.", "CAS N°", "CAS No", "CAS", "cas_no", "cas"]),
        inci: get(p, ["INCI", "inci"]),
        flavouring_preparation: get(p, ["Flavouring preparation", "flavouring_preparation"]),
        benefices_aqueux: get(p, ["Bénéfices Aqueux", "Benefices Aqueux", "benefices_aqueux"]),
        benefices_huileux: get(p, ["Bénéfices Huileux", "Benefices Huileux", "benefices_huileux"]),
        benefices: get(p, ["Bénéfices", "Benefices", "benefices"]),
        solubilite: get(p, ["Solubilité", "Solubilite", "solubilite"]),
        partie_utilisee: get(p, ["Partie utilisée", "Partie utilisee", "partie_utilisee"]),
        description: get(p, ["Description", "description"]),
        aspect: get(p, ["Aspect", "aspect"]),
        conservateurs: get(p, ["Conservateurs", "conservateurs"]),
        application: get(p, ["Application", "application"]),
        type_de_peau: get(p, ["Type de peau", "type_de_peau"]),
        calendrier_des_recoltes: get(p, ["Calendrier des récoltes", "Calendrier des recoltes", "calendrier_des_recoltes"]),
        certifications: get(p, ["Certifications", "certifications"]),
        valorisations: get(p, ["Valorisations", "valorisations"]),
        statut: statut, // NOUVEAU: statut basé sur la colonne du Sheet
      };
    });

    // Éviter d'insérer des lignes totalement vides (ignorer le statut pour ce check)
    const nonEmpty = mappedProducts.filter((mp) => {
      const { statut, ...rest } = mp;
      return Object.values(rest).some((v) => v !== null);
    });

    if (nonEmpty.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: "Aucune colonne reconnue dans le payload : toutes les valeurs sont null.",
        received_keys_sample: keys0,
        hint: "Vérifie que les en-têtes Google Sheets correspondent (ex: 'Nom commercial', 'Typologie de produit', etc.).",
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Séparer les produits actifs et les produits à supprimer
    const activeProducts = nonEmpty.filter(p => p.statut === 'ACTIF' || p.statut === 'INACTIF');
    const deletedProducts = nonEmpty.filter(p => p.statut === 'SUPPRIME');

    console.log(`Produits actifs/inactifs: ${activeProducts.length}, Produits marqués SUPPRIME: ${deletedProducts.length}`);
    console.log('Sample mapped product:', JSON.stringify(nonEmpty[0]));

    let upsertedCount = 0;
    let deletedCount = 0;

    // 1. Upsert des produits actifs/inactifs
    if (activeProducts.length > 0) {
      const { data, error } = await supabase
        .from('cosmetique_fr')
        .upsert(activeProducts, { onConflict: 'code' })
        .select();

      if (error) {
        console.error('Supabase upsert error:', error);
        throw error;
      }

      upsertedCount = data?.length || 0;
      console.log(`Upsert réussi: ${upsertedCount} produit(s)`);
    }

    // 2. Supprimer (vraiment) les produits marqués SUPPRIME
    if (deletedProducts.length > 0) {
      const codesToDelete = deletedProducts.map(p => p.code).filter(Boolean);
      console.log(`Codes à supprimer: ${codesToDelete.join(', ')}`);

      const { error: deleteError } = await supabase
        .from('cosmetique_fr')
        .delete()
        .in('code', codesToDelete);

      if (deleteError) {
        console.error('Erreur suppression:', deleteError);
      } else {
        deletedCount = codesToDelete.length;
        console.log(`Supprimé ${deletedCount} produit(s)`);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      upserted: upsertedCount,
      deleted: deletedCount,
      message: `${upsertedCount} produit(s) mis à jour, ${deletedCount} supprimé(s)`
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in sync-products:', errorMessage);
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
