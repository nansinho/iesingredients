import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Fields to translate (text fields only)
const TRANSLATABLE_FIELDS = [
  'nom_commercial',
  'description',
  'benefices',
  'benefices_aqueux',
  'benefices_huileux',
  'application',
  'type_de_peau',
  'aspect',
  'partie_utilisee',
  'solubilite',
  'conservateurs',
  'certifications',
  'valorisations',
  'tracabilite',
  'calendrier_des_recoltes',
];

// Fields to copy as-is (technical/non-translatable)
const COPY_FIELDS = [
  'code',
  'typologie_de_produit',
  'gamme',
  'origine',
  'cas_no',
  'inci',
  'flavouring_preparation',
  'statut',
];

interface TranslationRequest {
  productCode?: string;
  batchSize?: number;
  forceRetranslate?: boolean;
}

/**
 * Translate a single text from French to English using self-hosted LibreTranslate.
 */
async function translateText(text: string, libreTranslateUrl: string): Promise<string> {
  const response = await fetch(`${libreTranslateUrl}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: "fr",
      target: "en",
      format: "text",
    }),
  });

  if (!response.ok) {
    throw new Error(`LibreTranslate error: ${response.status}`);
  }

  const data = await response.json();
  return data.translatedText || text;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LIBRETRANSLATE_URL = Deno.env.get("LIBRETRANSLATE_URL") || "http://libretranslate:5000";
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const { productCode, batchSize = 10, forceRetranslate = false }: TranslationRequest = await req.json();

    console.log(`Starting translation via LibreTranslate: productCode=${productCode}, batchSize=${batchSize}, forceRetranslate=${forceRetranslate}`);

    // Get products from French table that need translation
    let query = supabase
      .from('cosmetique_fr')
      .select('*')
      .eq('statut', 'ACTIF');

    if (productCode) {
      query = query.eq('code', productCode);
    }

    query = query.limit(batchSize);

    const { data: frenchProducts, error: fetchError } = await query;

    if (fetchError) {
      console.error("Error fetching French products:", fetchError);
      throw new Error(`Failed to fetch products: ${fetchError.message}`);
    }

    if (!frenchProducts || frenchProducts.length === 0) {
      return new Response(
        JSON.stringify({ message: "No products to translate", translated: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get existing English translations
    const codes = frenchProducts.map(p => p.code).filter(Boolean);
    const { data: existingEnglish } = await supabase
      .from('cosmetique_en')
      .select('code, translated_at')
      .in('code', codes);

    const existingMap = new Map(existingEnglish?.map(e => [e.code, e.translated_at]) || []);

    // Filter products that need translation
    const productsToTranslate = forceRetranslate
      ? frenchProducts
      : frenchProducts.filter(p => !existingMap.has(p.code));

    if (productsToTranslate.length === 0) {
      return new Response(
        JSON.stringify({ message: "All products already translated", translated: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${productsToTranslate.length} products to translate`);

    const translatedProducts: string[] = [];

    for (const product of productsToTranslate) {
      try {
        const englishProduct: Record<string, any> = {
          source_id: product.id,
          translated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Copy non-translatable fields
        for (const field of COPY_FIELDS) {
          if (product[field] !== undefined) {
            englishProduct[field] = product[field];
          }
        }

        // Translate each field via self-hosted LibreTranslate
        let hasTranslations = false;
        for (const field of TRANSLATABLE_FIELDS) {
          const value = product[field];
          if (value && typeof value === 'string' && value.trim()) {
            try {
              englishProduct[field] = await translateText(value, LIBRETRANSLATE_URL);
              hasTranslations = true;
            } catch (err) {
              console.error(`Translation failed for field ${field} of product ${product.code}:`, err);
              englishProduct[field] = value; // Keep French as fallback
            }
          }
        }

        if (!hasTranslations) {
          console.log(`Product ${product.code} has no fields to translate, copying as-is`);
        } else {
          console.log(`Successfully translated product ${product.code}`);
        }

        // Upsert to English table
        const { error: upsertError } = await supabase
          .from('cosmetique_en')
          .upsert(englishProduct, { onConflict: 'code' });

        if (upsertError) {
          console.error(`Failed to upsert product ${product.code}:`, upsertError);
          continue;
        }

        translatedProducts.push(product.code);

        // Small delay to avoid overwhelming LibreTranslate
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (productError) {
        console.error(`Error translating product ${product.code}:`, productError);
        continue;
      }
    }

    console.log(`Translation complete: ${translatedProducts.length} products translated`);

    return new Response(
      JSON.stringify({
        message: "Translation complete",
        translated: translatedProducts.length,
        productCodes: translatedProducts,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in translate-products function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
