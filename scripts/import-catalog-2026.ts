/**
 * Import Catalogue 2026 Excel → Supabase
 *
 * Usage: npx tsx scripts/import-catalog-2026.ts
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import * as XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";
import * as path from "path";
import * as fs from "fs";

// Load .env.local manually
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const EXCEL_PATH = path.resolve(__dirname, "../public/catalogues/Catalogue 2026.xlsx");

// ══════════════════════════════════════════════════════════
// Colonnes RÉELLES en BDD (vérifiées via select * limit 1)
// ══════════════════════════════════════════════════════════
//
// aromes_fr:     application, aspect, base, calendrier_des_recoltes, cas_no, certifications, code,
//                conservateurs, description, dosage, famille_arome, flavouring_preparation, food_grade,
//                gamme, id, image_url, inci, nom_commercial, origin, profil_aromatique, saveur, statut,
//                tracabilite, typography_de_produit, valorisations
//
// cosmetique_fr: application, aspect, benefices, benefices_aqueux, benefices_huileux,
//                calendrier_des_recoltes, cas_no, certifications, code, conservateurs, description,
//                famille_cosmetique, flavouring_preparation, food_grade, gamme, id, image_url, inci,
//                nom_commercial, origine, partie_utilisee, solubilite, statut, tracabilite, type_de_peau,
//                typography_de_produit, valorisations
//
// parfum_fr:     Typography_de_produit, application, aspect, base, calendrier_des_recoltes,
//                calendrier_recoltes, cas_no, certifications, code, conservateurs, description,
//                famille_olfactive, flavouring_preparation, food_grade, id, image_url, inci,
//                nom_commercial, nom_latin, odeur, origin, profil_olfactif, statut, tracabilite, valorisations
// ══════════════════════════════════════════════════════════

// ── Performance mapping ──
const PERF_MAPPING = [
  { col: "perf_niveau_utilisation", name: "Niveau d'utilisation", ordre: 1, isText: true },
  { col: "perf_tenacite_buvard", name: "Ténacité sur buvard", ordre: 2, isText: true },
  { col: "perf_efficacite_combustion", name: "Efficacité de combustion", ordre: 3, isText: false },
  { col: "perf_substantivite_humide", name: "Amortissement de substance", ordre: 4, isText: false },
  { col: "perf_substantivite_seche", name: "Substance sèche", ordre: 5, isText: false },
  { col: "perf_substantivite_savon", name: "Éclosion dans le savon", ordre: 6, isText: false },
];

// ── Stability mapping ──
const STAB_MAPPING = [
  { col: "stab_ph2_nettoyant_acide", ph: "2", base: "Nettoyant acide", ordre: 1 },
  { col: "stab_ph3_assouplissant", ph: "3", base: "Adoucissant textile", ordre: 2 },
  { col: "stab_ph3_5_antisudorifique", ph: "3.5", base: "Anti-transpirant", ordre: 3 },
  { col: "stab_ph6_shampooing", ph: "6", base: "Shampooing", ordre: 4 },
  { col: "stab_ph9_apc", ph: "9", base: "APC", ordre: 5 },
  { col: "stab_ph9_detergent_liquide", ph: "9", base: "Lessive liquide pour le linge", ordre: 6 },
  { col: "stab_ph10_savon", ph: "10", base: "Savon", ordre: 7 },
  { col: "stab_ph10_5_detergent_poudre", ph: "10,5", base: "Lessive en poudre", ordre: 8 },
  { col: "stab_ph11_eau_javel", ph: "11", base: "Eau de Javel liquide", ordre: 9 },
];

function parseRating(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (!isNaN(n) && n >= 1 && n <= 5) return Math.round(n);
  const str = String(value);
  const stars = (str.match(/★/g) || []).length;
  if (stars >= 1 && stars <= 5) return stars;
  return null;
}

function clean(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s === "" ? null : s;
}

function cleanCode(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  // "-" n'est pas un vrai code
  return s === "" || s === "-" ? null : s;
}

function cleanObj(obj: Record<string, string | null>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null)
  ) as Record<string, string>;
}

/** Génère un code à partir du nom commercial */
function generateCode(name: string): string {
  return name
    .toUpperCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

/** Track used codes to avoid duplicates — adds suffix -2, -3... if needed */
const usedCodes = new Map<string, number>();
function uniqueCode(baseCode: string): string {
  const count = usedCodes.get(baseCode) || 0;
  usedCodes.set(baseCode, count + 1);
  if (count === 0) return baseCode;
  return `${baseCode}-${count + 1}`;
}

// ══════════════════════════════════════════════
// AROMES
// DB columns: code, nom_commercial, origin (PAS origine!), typography_de_produit (PAS typologie),
//             famille_arome, saveur, cas_no, aspect, gamme, tracabilite, inci, food_grade, etc.
// ══════════════════════════════════════════════
async function importAromes(wb: XLSX.WorkBook) {
  usedCodes.clear();
  console.log("\n🧪 Importing AROME_FR_SUPABASE...");
  const ws = wb.Sheets["AROME_FR_SUPABASE"];
  if (!ws) { console.error("  Sheet not found!"); return; }

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);
  console.log(`  Found ${rows.length} rows`);

  let upserted = 0, skipped = 0, errors = 0;

  for (const row of rows) {
    const nom = clean(row["nom_commercial"]);
    if (!nom) { skipped++; continue; }
    // Code unique = code fournisseur si dispo, sinon généré depuis le nom
    const codeFournisseur = cleanCode(row["code_fournisseurs"]);
    const code = uniqueCode(codeFournisseur || generateCode(nom));

    const product = cleanObj({
      code,
      code_fournisseurs: codeFournisseur,
      nom_commercial: nom,
      typography_de_produit: clean(row["typologie_produit"]),
      famille_arome: clean(row["famille_arome"]),
      saveur: clean(row["saveur"]),
      cas_no: clean(row["cas_no"]),
      aspect: clean(row["aspect"]),
      statut: "ACTIF",
    });

    const { error } = await supabase
      .from("aromes_fr")
      .insert(product);

    if (error) {
      if (errors < 3) console.error(`  ❌ ${code}: ${error.message}`);
      errors++;
    } else {
      upserted++;
    }
  }

  console.log(`  ✅ Upserted: ${upserted} | Skipped (no name & no code): ${skipped} | Errors: ${errors}`);
}

// ══════════════════════════════════════════════
// COSMETIQUES
// DB columns: code, nom_commercial, origine (avec "e"!), typography_de_produit,
//             famille_cosmetique, calendrier_des_recoltes, etc.
// ══════════════════════════════════════════════
async function importCosmetiques(wb: XLSX.WorkBook) {
  usedCodes.clear();
  console.log("\n✨ Importing COSMETIQUE_FR_SUPABASE...");
  const ws = wb.Sheets["COSMETIQUE_FR_SUPABASE"];
  if (!ws) { console.error("  Sheet not found!"); return; }

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);
  console.log(`  Found ${rows.length} rows`);

  let upserted = 0, skipped = 0, errors = 0;

  for (const row of rows) {
    const nom = clean(row["nom_commercial"]);
    if (!nom) { skipped++; continue; }
    const codeFournisseur = cleanCode(row["code_fournisseurs"]);
    const code = uniqueCode(codeFournisseur || generateCode(nom));

    const product = cleanObj({
      code,
      code_fournisseurs: codeFournisseur,
      nom_commercial: nom,
      typography_de_produit: clean(row["typologie_produit"]),
      famille_cosmetique: clean(row["famille_cosmetique"]),
      origine: clean(row["origine"]),
      tracabilite: clean(row["tracabilite"]),
      cas_no: clean(row["cas_no"]),
      inci: clean(row["inci"]),
      benefices_aqueux: clean(row["benefices_aqueux"]),
      benefices_huileux: clean(row["benefices_huileux"]),
      benefices: clean(row["benefices"]),
      solubilite: clean(row["solubilite"]),
      partie_utilisee: clean(row["partie_utilisee"]),
      description: clean(row["description"]),
      aspect: clean(row["aspect"]),
      conservateurs: clean(row["conservateurs"]),
      application: clean(row["application"]),
      type_de_peau: clean(row["type_de_peau"]),
      calendrier_des_recoltes: clean(row["calendrier_recoltes"]),
      certifications: clean(row["certifications"]),
      valorisations: clean(row["valorisations"]),
      statut: "ACTIF",
    });

    const { error } = await supabase
      .from("cosmetique_fr")
      .insert(product);

    if (error) {
      if (errors < 3) console.error(`  ❌ ${code}: ${error.message}`);
      errors++;
    } else {
      upserted++;
    }
  }

  console.log(`  ✅ Upserted: ${upserted} | Skipped (no name & no code): ${skipped} | Errors: ${errors}`);
}

// ══════════════════════════════════════════════
// PARFUMS
// DB columns: code, nom_commercial, origin (PAS origine!), Typography_de_produit (majuscule T!),
//             famille_olfactive, calendrier_des_recoltes, calendrier_recoltes, etc.
// PAS de colonne: origine, ph, base (dans la migration mais pas visible)
// ══════════════════════════════════════════════
async function importParfums(wb: XLSX.WorkBook) {
  usedCodes.clear();
  console.log("\n🌸 Importing PARFUM_FR_SUPABASE...");
  const ws = wb.Sheets["PARFUM_FR_SUPABASE"];
  if (!ws) { console.error("  Sheet not found!"); return; }

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);
  console.log(`  Found ${rows.length} rows`);

  let upserted = 0, skipped = 0, errors = 0;
  let perfInserted = 0, stabInserted = 0;

  for (const row of rows) {
    const nom = clean(row["nom_commercial"]);
    if (!nom) { skipped++; continue; }
    const codeFournisseur = cleanCode(row["code_fournisseurs"]);
    const code = uniqueCode(codeFournisseur || generateCode(nom));

    const product = cleanObj({
      code,
      code_fournisseurs: codeFournisseur,
      nom_commercial: nom,
      // "Typography_de_produit" avec T majuscule dans parfum_fr!
      "Typography_de_produit": clean(row["typologie_produit"]),
      famille_olfactive: clean(row["famille_olfactive"]),
      origin: clean(row["origine"]),  // "origin" PAS "origine" dans parfum_fr!
      cas_no: clean(row["cas_no"]),
      inci: clean(row["inci"]),
      nom_latin: clean(row["nom_latin"]),
      food_grade: clean(row["food_grade"]),
      flavouring_preparation: clean(row["flavouring_preparation"]),
      profil_olfactif: clean(row["profil_olfactif"]),
      description: clean(row["description"]),
      aspect: clean(row["aspect"]),
      calendrier_des_recoltes: clean(row["calendrier_recoltes"]),
      calendrier_recoltes: clean(row["calendrier_recoltes"]),
      certifications: clean(row["certifications"]),
      valorisations: clean(row["valorisations"]),
      statut: "ACTIF",
    });

    const { error } = await supabase
      .from("parfum_fr")
      .insert(product);

    if (error) {
      if (errors < 3) console.error(`  ❌ ${code}: ${error.message}`);
      errors++;
      continue;
    }
    upserted++;

    // ── Performance data ──
    const perfRows = PERF_MAPPING
      .map((m) => {
        const val = row[m.col];
        if (val === null || val === undefined || val === "") return null;
        return {
          product_code: code,
          option_name: m.name,
          ordre: m.ordre,
          performance_value: m.isText ? clean(val) : null,
          performance_rating: m.isText ? null : parseRating(val),
        };
      })
      .filter(Boolean);

    if (perfRows.length > 0) {
      await supabase.from("parfum_performance").delete().eq("product_code", code);
      const { error: perfError } = await supabase.from("parfum_performance").insert(perfRows);
      if (perfError) {
        if (perfInserted === 0) console.error(`  ⚠️ Perf ${code}: ${perfError.message}`);
      } else {
        perfInserted += perfRows.length;
      }
    }

    // ── Stability data ──
    const stabRows = STAB_MAPPING
      .map((m) => {
        const val = row[m.col];
        const rating = parseRating(val);
        if (rating === null) return null;
        return {
          product_code: code,
          base_name: m.base,
          ph_value: m.ph,
          odeur_rating: rating,
          ordre: m.ordre,
        };
      })
      .filter(Boolean);

    if (stabRows.length > 0) {
      await supabase.from("parfum_stabilite").delete().eq("product_code", code);
      const { error: stabError } = await supabase.from("parfum_stabilite").insert(stabRows);
      if (stabError) {
        if (stabInserted === 0) console.error(`  ⚠️ Stab ${code}: ${stabError.message}`);
      } else {
        stabInserted += stabRows.length;
      }
    }
  }

  console.log(`  ✅ Upserted: ${upserted} | Skipped (no name & no code): ${skipped} | Errors: ${errors}`);
  console.log(`  📊 Performance rows: ${perfInserted} | Stability rows: ${stabInserted}`);
}

// ── Main ──
async function main() {
  console.log("📦 Reading Excel file...");
  const wb = XLSX.readFile(EXCEL_PATH);
  console.log(`  Sheets: ${wb.SheetNames.join(", ")}`);

  // Purge tables first for exact counts
  console.log("\n🗑️  Purging existing data...");
  await supabase.from("parfum_performance").delete().neq("id", 0);
  await supabase.from("parfum_stabilite").delete().neq("id", 0);
  await supabase.from("aromes_fr").delete().neq("id", 0);
  await supabase.from("cosmetique_fr").delete().neq("id", 0);
  await supabase.from("parfum_fr").delete().neq("id", 0);
  console.log("  Done.");

  await importAromes(wb);
  await importCosmetiques(wb);
  await importParfums(wb);

  // Verify counts
  console.log("\n📊 Vérification des compteurs...");
  for (const table of ["aromes_fr", "cosmetique_fr", "parfum_fr"]) {
    const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
    console.log(`  ${table}: ${count}`);
  }

  console.log("\n🎉 Import terminé !");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
