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
    console.log('Payload received:', JSON.stringify(payload).substring(0, 500));
    
    // Support tableau ou objet unique
    const products = Array.isArray(payload) ? payload : [payload];
    console.log(`Processing ${products.length} product(s)`);
    
    // Mapping des colonnes Google Sheets → Supabase
    const mappedProducts = products.map(p => ({
      nom_commercial: p["Nom commercial"] || null,
      typologie_de_produit: p["Typologie de produit"] || null,
      gamme: p["Gamme"] || null,
      origine: p["Origine"] || null,
      tracabilite: p["Traçabilité"] || null,
      code: p["Code"] || null,
      cas_no: p["CAS N°"] || null,
      inci: p["INCI"] || null,
      flavouring_preparation: p["Flavouring preparation"] || null,
      benefices_aqueux: p["Bénéfices Aqueux"] || null,
      benefices_huileux: p["Bénéfices Huileux"] || null,
      benefices: p["Bénéfices"] || null,
      solubilite: p["Solubilité"] || null,
      partie_utilisee: p["Partie utilisée"] || null,
      description: p["Description"] || null,
      aspect: p["Aspect"] || null,
      conservateurs: p["Conservateurs"] || null,
      application: p["Application"] || null,
      type_de_peau: p["Type de peau"] || null,
      calendrier_des_recoltes: p["Calendrier des récoltes"] || null,
      certifications: p["Certifications"] || null,
      valorisations: p["Valorisations"] || null,
    }));

    console.log('Mapped products:', JSON.stringify(mappedProducts[0]));

    const { data, error } = await supabase
      .from('cosmetique_fr')
      .insert(mappedProducts)
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
    
  } catch (error) {
    console.error('Error in sync-products:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
