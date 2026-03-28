import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Called daily by cron to check if companies are still active
// Protect with a secret token
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Get all profiles with a SIRET
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profiles } = await (supabase.from("profiles") as any)
    .select("id, siret, company, company_closed")
    .not("siret", "is", null)
    .neq("siret", "");

  if (!profiles || profiles.length === 0) {
    return NextResponse.json({ message: "No profiles with SIRET", checked: 0 });
  }

  let checked = 0;
  let changed = 0;

  for (const profile of profiles) {
    try {
      // Extract SIREN (first 9 digits) from SIRET
      const siren = profile.siret.replace(/\s/g, "").slice(0, 9);
      if (siren.length < 9) continue;

      const res = await fetch(
        `https://recherche-entreprises.api.gouv.fr/search?q=${siren}&page=1&per_page=1`
      );

      if (!res.ok) continue;

      const data = await res.json();
      const result = data.results?.[0];
      if (!result) continue;

      const isClosed = result.etat_administratif === "F";
      const wasClosed = profile.company_closed === true;

      if (isClosed !== wasClosed) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("profiles") as any)
          .update({ company_closed: isClosed })
          .eq("id", profile.id);
        changed++;
      }

      checked++;

      // Rate limit: max 1 request per 200ms to respect API limits
      await new Promise((r) => setTimeout(r, 200));
    } catch {
      // Continue to next profile
    }
  }

  return NextResponse.json({
    message: "SIRENE check complete",
    checked,
    changed,
    total: profiles.length,
  });
}
