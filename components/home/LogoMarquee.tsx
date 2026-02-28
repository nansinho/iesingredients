"use client";

import Image from "next/image";

const partners = [
  { name: "Givaudan", src: "/images/logo-givaudan.png", invert: true },
  { name: "DSM-Firmenich", src: "/images/logo-dsm-firmenich.png", invert: true },
  { name: "MayFlower", src: "/images/logo-mayflower.jpg", invert: false },
  { name: "Sensient Beauty", src: "/images/logo-sensient.png", invert: true },
  { name: "Xinrui Aromatics", src: "/images/logo-xinrui.png", invert: false },
];

export function LogoMarquee() {
  return (
    <section className="bg-cream-light py-10 md:py-12 border-b border-dark/5">
      <div className="w-[94%] mx-auto">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-dark/25 mb-8">
          Ils nous font confiance
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="relative h-12 md:h-14 w-28 md:w-36 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
            >
              <Image
                src={partner.src}
                alt={partner.name}
                fill
                className="object-contain"
                style={partner.invert ? { filter: "brightness(0)" } : undefined}
                sizes="(max-width: 768px) 112px, 144px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
