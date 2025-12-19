import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Fields to translate
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

interface TranslationRequest {
  productId?: number;
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

    const { productId, batchSize = 10, forceRetranslate = false }: TranslationRequest = await req.json();

    console.log(`Starting translation: productId=${productId}, batchSize=${batchSize}, forceRetranslate=${forceRetranslate}`);

    // Build query
    let query = supabase
      .from('cosmetique_fr')
      .select('*')
      .eq('statut', 'ACTIF');

    if (productId) {
      query = query.eq('id', productId);
    } else if (!forceRetranslate) {
      query = query.or('is_translated.is.null,is_translated.eq.false');
    }

    query = query.limit(batchSize);

    const { data: products, error: fetchError } = await query;

    if (fetchError) {
      console.error("Error fetching products:", fetchError);
      throw new Error(`Failed to fetch products: ${fetchError.message}`);
    }

    if (!products || products.length === 0) {
      console.log("No products to translate");
      return new Response(
        JSON.stringify({ message: "No products to translate", translated: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${products.length} products to translate`);

    const translatedProducts = [];

    for (const product of products) {
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
          console.log(`Product ${product.id} has no fields to translate, marking as translated`);
          await supabase
            .from('cosmetique_fr')
            .update({ is_translated: true, translated_at: new Date().toISOString() })
            .eq('id', product.id);
          continue;
        }

        console.log(`Translating product ${product.id}: ${product.nom_commercial}`);

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
          console.error(`AI API error for product ${product.id}:`, response.status, errorText);
          
          if (response.status === 429) {
            console.log("Rate limited, stopping batch");
            break;
          }
          continue;
        }

        const aiData = await response.json();
        const translatedContent = aiData.choices?.[0]?.message?.content;

        if (!translatedContent) {
          console.error(`No translation content for product ${product.id}`);
          continue;
        }

        // Parse the translated JSON
        let translations: Record<string, string>;
        try {
          // Clean the response (remove markdown code blocks if present)
          let cleanContent = translatedContent.trim();
          if (cleanContent.startsWith('```')) {
            cleanContent = cleanContent.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
          }
          translations = JSON.parse(cleanContent);
        } catch (parseError) {
          console.error(`Failed to parse translation for product ${product.id}:`, parseError, translatedContent);
          continue;
        }

        // Build update object
        const updateData: Record<string, any> = {
          is_translated: true,
          translated_at: new Date().toISOString(),
        };

        for (const [key, value] of Object.entries(translations)) {
          if (TRANSLATABLE_FIELDS.includes(key) && value) {
            updateData[`${key}_en`] = value;
          }
        }

        // Update product
        const { error: updateError } = await supabase
          .from('cosmetique_fr')
          .update(updateData)
          .eq('id', product.id);

        if (updateError) {
          console.error(`Failed to update product ${product.id}:`, updateError);
          continue;
        }

        console.log(`Successfully translated product ${product.id}`);
        translatedProducts.push(product.id);

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (productError) {
        console.error(`Error translating product ${product.id}:`, productError);
        continue;
      }
    }

    console.log(`Translation complete: ${translatedProducts.length} products translated`);

    return new Response(
      JSON.stringify({ 
        message: "Translation complete", 
        translated: translatedProducts.length,
        productIds: translatedProducts 
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
