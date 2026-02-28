"use client";

const logoPairs = [
  // Row 1
  { front: "COSMOS", back: "Croda" },
  { front: "ECOCERT", back: "Ashland" },
  { front: "L'Oréal", back: "Evonik" },
  { front: "Chanel", back: "LVMH" },
  { front: "Dior", back: "Estée Lauder" },
  { front: "Givaudan", back: "Robertet" },
  // Row 2
  { front: "Firmenich", back: "Mane" },
  { front: "Symrise", back: "Takasago" },
  { front: "DSM", back: "Sensient" },
  { front: "BASF", back: "Kerry" },
  { front: "IFF", back: "Lonza" },
  { front: "Seppic", back: "Clariant" },
];

export function LogoMarquee() {
  return (
    <section className="bg-cream-light py-10 md:py-12 border-b border-dark/5">
      <div className="w-[94%] mx-auto">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-dark/25 mb-8">
          Ils nous font confiance
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-5">
          {logoPairs.map((pair, i) => (
            <div
              key={pair.front}
              className="h-16 md:h-[72px]"
              style={{ perspective: "600px" }}
            >
              <div
                className="relative w-full h-full animate-logo-flip"
                style={{
                  transformStyle: "preserve-3d",
                  animationDelay: `${(i % 3) * 2.5}s`,
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-xl border border-dark/[0.06] bg-white/60"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <span className="text-[13px] sm:text-sm font-semibold uppercase tracking-[0.12em] text-dark/25 select-none whitespace-nowrap">
                    {pair.front}
                  </span>
                </div>
                {/* Back */}
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-xl border border-dark/[0.06] bg-white/60"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateX(180deg)",
                  }}
                >
                  <span className="text-[13px] sm:text-sm font-semibold uppercase tracking-[0.12em] text-dark/25 select-none whitespace-nowrap">
                    {pair.back}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
