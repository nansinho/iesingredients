"use client";

const brands = [
  "COSMOS",
  "ECOCERT",
  "L'Oréal",
  "Chanel",
  "Dior",
  "Givaudan",
  "Firmenich",
  "Symrise",
  "DSM",
  "BASF",
  "IFF",
  "Seppic",
];

export function LogoMarquee() {
  return (
    <section className="bg-cream-light py-5 border-b border-dark/5 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Duplicate for seamless loop */}
        {[...brands, ...brands].map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="mx-8 sm:mx-12 text-[13px] sm:text-sm font-semibold uppercase tracking-[0.15em] text-dark/20 select-none"
          >
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
}
