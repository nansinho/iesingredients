import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const productCodes = ["1394793", "9023501"];

    // Delete existing data for these products
    await supabase.from("parfum_performance").delete().in("product_code", productCodes);
    await supabase.from("parfum_stabilite").delete().in("product_code", productCodes);

    // PETIOLE (1394793) - Performance data
    const petiolePerformance = [
      { product_code: "1394793", ordre: 1, option_name: "Niveau d'utilisation", performance_value: "Jusqu'à 3%", performance_rating: null },
      { product_code: "1394793", ordre: 2, option_name: "Ténacité sur buvard", performance_value: "1 Jour", performance_rating: null },
      { product_code: "1394793", ordre: 3, option_name: "Efficacité de combustion", performance_value: null, performance_rating: 5 },
      { product_code: "1394793", ordre: 4, option_name: "Substantivité humide", performance_value: null, performance_rating: 3 },
      { product_code: "1394793", ordre: 5, option_name: "Substantivité sèche", performance_value: null, performance_rating: 3 },
      { product_code: "1394793", ordre: 6, option_name: "Substantivité en savon", performance_value: null, performance_rating: 5 },
    ];

    // PETIOLE (1394793) - Stability data
    const petioleStability = [
      { product_code: "1394793", ordre: 1, ph_value: "2", base_name: "Nettoyant acide", odeur_rating: 3 },
      { product_code: "1394793", ordre: 2, ph_value: "3", base_name: "Assouplissant textile", odeur_rating: 5 },
      { product_code: "1394793", ordre: 3, ph_value: "3,5", base_name: "Antisudorifique", odeur_rating: 5 },
      { product_code: "1394793", ordre: 4, ph_value: "6", base_name: "Shampooing", odeur_rating: 5 },
      { product_code: "1394793", ordre: 5, ph_value: "9", base_name: "APC", odeur_rating: 5 },
      { product_code: "1394793", ordre: 6, ph_value: "9", base_name: "Détergent liquide pour tissus", odeur_rating: 3 },
      { product_code: "1394793", ordre: 7, ph_value: "10", base_name: "Savon", odeur_rating: 5 },
      { product_code: "1394793", ordre: 8, ph_value: "10,5", base_name: "Détergent en poudre", odeur_rating: 3 },
      { product_code: "1394793", ordre: 9, ph_value: "11", base_name: "Eau de Javel", odeur_rating: 3 },
    ];

    // STEMONE (9023501) - Performance data
    const stemonePerformance = [
      { product_code: "9023501", ordre: 1, option_name: "Niveau d'utilisation", performance_value: "0,1% - 5%", performance_rating: null },
      { product_code: "9023501", ordre: 2, option_name: "Ténacité sur buvard", performance_value: "16 Heures", performance_rating: null },
      { product_code: "9023501", ordre: 3, option_name: "Efficacité de combustion", performance_value: null, performance_rating: 5 },
      { product_code: "9023501", ordre: 4, option_name: "Substantivité humide", performance_value: null, performance_rating: 1 },
      { product_code: "9023501", ordre: 5, option_name: "Substantivité sèche", performance_value: null, performance_rating: 1 },
      { product_code: "9023501", ordre: 6, option_name: "Substantivité en savon", performance_value: null, performance_rating: 5 },
    ];

    // STEMONE (9023501) - Stability data
    const stemoneStability = [
      { product_code: "9023501", ordre: 1, ph_value: "2", base_name: "Nettoyant acide", odeur_rating: 5 },
      { product_code: "9023501", ordre: 2, ph_value: "3", base_name: "Assouplissant textile", odeur_rating: 5 },
      { product_code: "9023501", ordre: 3, ph_value: "3,5", base_name: "Antisudorifique", odeur_rating: 5 },
      { product_code: "9023501", ordre: 4, ph_value: "6", base_name: "Shampooing", odeur_rating: 5 },
      { product_code: "9023501", ordre: 5, ph_value: "9", base_name: "APC", odeur_rating: 5 },
      { product_code: "9023501", ordre: 6, ph_value: "9", base_name: "Détergent liquide pour tissus", odeur_rating: 5 },
      { product_code: "9023501", ordre: 7, ph_value: "10", base_name: "Savon", odeur_rating: 5 },
      { product_code: "9023501", ordre: 8, ph_value: "10,5", base_name: "Détergent en poudre", odeur_rating: 5 },
      { product_code: "9023501", ordre: 9, ph_value: "11", base_name: "Eau de Javel", odeur_rating: 3 },
    ];

    // Insert all performance data
    const { error: perfError } = await supabase
      .from("parfum_performance")
      .insert([...petiolePerformance, ...stemonePerformance]);

    if (perfError) throw perfError;

    // Insert all stability data
    const { error: stabError } = await supabase
      .from("parfum_stabilite")
      .insert([...petioleStability, ...stemoneStability]);

    if (stabError) throw stabError;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Data inserted successfully for PETIOLE (1394793) and STEMONE (9023501)",
        performance_rows: petiolePerformance.length + stemonePerformance.length,
        stability_rows: petioleStability.length + stemoneStability.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
