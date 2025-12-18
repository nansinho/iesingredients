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

    // Mapping (tolérant aux variantes avec/sans accents)
    const mappedProducts = products.map((p: any) => ({
      nom_commercial: get(p, ["Nom commercial", "Nom commercial ", "nom_commercial", "nom commercial", "Nom"]) ,
      typologie_de_produit: get(p, ["Typologie de produit", "typologie_de_produit", "typologie", "Typologie"]),
      gamme: get(p, ["Gamme", "gamme"]),
      origine: get(p, ["Origine", "origine"]),
      tracabilite: get(p, ["Traçabilité", "Tracabilite", "tracabilite", "traçabilité"]),
      code: get(p, ["Code", "code"]),
      cas_no: get(p, ["CAS N°", "CAS No", "CAS", "cas_no", "cas"]),
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
    }));

    // Éviter d'insérer des lignes totalement vides
    const nonEmpty = mappedProducts.filter((mp) => Object.values(mp).some((v) => v !== null));
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

    console.log('Mapped products (sample):', JSON.stringify(nonEmpty[0]));

    const { data, error } = await supabase
      .from('cosmetique_fr')
      .insert(nonEmpty)
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    console.log(`Successfully inserted ${data?.length} product(s)`);

    return new Response(JSON.stringify({ 
      success: true, 
      inserted: data?.length,
      products: data
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
