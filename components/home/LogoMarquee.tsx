"use client";

import Image from "next/image";

const partners = [
  { name: "Givaudan", src: "/images/logo-givaudan.png" },
  { name: "DSM-Firmenich", src: "/images/logo-dsm-firmenich.png" },
  { name: "MayFlower", src: "/images/logo-mayflower.jpg" },
  { name: "Sensient Beauty", src: "/images/logo-sensient.png" },
  { name: "Xinrui Aromatics", src: "/images/logo-xinrui.png" },
];

export function LogoMarquee() {
  return (
    <section className="bg-[#2E1F3D] py-10 md:py-12">
      <div className="w-[94%] mx-auto">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-8">
          Ils nous font confiance
        </p>
        <div className="grid grid-cols-3 md:grid-cols-5 items-center gap-y-8">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="relative h-10 md:h-12 opacity-70 hover:opacity-100 transition-opacity duration-300"
            >
              <Image
                src={partner.src}
                alt={partner.name}
                fill
                className="object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
                sizes="(max-width: 768px) 33vw, 20vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
