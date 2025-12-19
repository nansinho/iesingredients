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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const { productCode, batchSize = 10, forceRetranslate = false }: TranslationRequest = await req.json();

    console.log(`Starting translation: productCode=${productCode}, batchSize=${batchSize}, forceRetranslate=${forceRetranslate}`);

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
      console.log("No French products found");
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
      console.log("All products already translated");
      return new Response(
        JSON.stringify({ message: "All products already translated", translated: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${productsToTranslate.length} products to translate`);

    const translatedProducts: string[] = [];

    for (const product of productsToTranslate) {
      try {
        // Build content to translate
        const fieldsToTranslate: Record<string, string> = {};
        
        for (const field of TRANSLATABLE_FIELDS) {
          const value = product[field];
          if (value && typeof value === 'string' && value.trim()) {
            fieldsToTranslate[field] = value;
          }
        }

        if (Object.keys(fieldsToTranslate).length === 0) {
          console.log(`Product ${product.code} has no fields to translate, copying as-is`);
          
          // Just copy the product without translation
          const englishProduct: Record<string, any> = {
            source_id: product.id,
            translated_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          
          for (const field of COPY_FIELDS) {
            if (product[field] !== undefined) {
              englishProduct[field] = product[field];
            }
          }

          await supabase
            .from('cosmetique_en')
            .upsert(englishProduct, { onConflict: 'code' });
          
          translatedProducts.push(product.code);
          continue;
        }

        console.log(`Translating product ${product.code}: ${product.nom_commercial}`);

        // Call Lovable AI for translation
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: `You are a professional translator specializing in cosmetics, perfumes, and food ingredients. Translate the following French content to English. 
                
IMPORTANT RULES:
- Maintain technical terminology accuracy
- Keep proper nouns and brand names unchanged
- Preserve formatting (commas, slashes, etc.)
- Return ONLY a valid JSON object with the same keys, containing the English translations
- Do NOT add any explanation or markdown, just the JSON object`
              },
              {
                role: "user",
                content: JSON.stringify(fieldsToTranslate)
              }
            ],
            temperature: 0.3,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`AI API error for product ${product.code}:`, response.status, errorText);
          
          if (response.status === 429) {
            console.log("Rate limited, stopping batch");
            break;
          }
          if (response.status === 402) {
            console.log("Payment required, stopping batch");
            break;
          }
          continue;
        }

        const aiData = await response.json();
        const translatedContent = aiData.choices?.[0]?.message?.content;

        if (!translatedContent) {
          console.error(`No translation content for product ${product.code}`);
          continue;
        }

        // Parse the translated JSON
        let translations: Record<string, string>;
        try {
          let cleanContent = translatedContent.trim();
          if (cleanContent.startsWith('```')) {
            cleanContent = cleanContent.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
          }
          translations = JSON.parse(cleanContent);
        } catch (parseError) {
          console.error(`Failed to parse translation for product ${product.code}:`, parseError, translatedContent);
          continue;
        }

        // Build English product record
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

        // Add translated fields
        for (const [key, value] of Object.entries(translations)) {
          if (TRANSLATABLE_FIELDS.includes(key) && value) {
            englishProduct[key] = value;
          }
        }

        // Upsert to English table
        const { error: upsertError } = await supabase
          .from('cosmetique_en')
          .upsert(englishProduct, { onConflict: 'code' });

        if (upsertError) {
          console.error(`Failed to upsert product ${product.code}:`, upsertError);
          continue;
        }

        console.log(`Successfully translated product ${product.code}`);
        translatedProducts.push(product.code);

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));

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
        productCodes: translatedProducts 
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
