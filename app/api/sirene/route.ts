import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q || q.length < 3) {
    return NextResponse.json({ results: [] });
  }

  try {
    const res = await fetch(
      `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(q)}&page=1&per_page=5`
    );
    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }
    const data = await res.json();
    // Ne retourner que les entreprises actives
    const results = (data.results || []).map((r: Record<string, unknown>) => ({
      ...r,
      est_active: (r as { etat_administratif?: string }).etat_administratif === "A",
    }));
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
