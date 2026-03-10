"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const logos = [
  { name: "Givaudan", src: "/images/logo-givaudan.svg" },
  { name: "DSM-Firmenich", src: "/images/logo-dsm-firmenich.svg" },
  { name: "MayFlower", src: "/images/logo-mayflower.svg" },
  { name: "Sensient Beauty", src: "/images/logo-sensient.svg" },
  { name: "Xinrui Aromatics", src: "/images/logo-xinrui.svg" },
];

const flipPairs = [
  { front: logos[0], back: logos[3] },
  { front: logos[1], back: logos[4] },
  { front: logos[2], back: logos[0] },
  { front: logos[3], back: logos[1] },
  { front: logos[4], back: logos[2] },
];

function FlipCard({
  front,
  back,
  delay,
}: {
  front: (typeof logos)[0];
  back: (typeof logos)[0];
  delay: number;
}) {
  return (
    <div className="relative h-14 md:h-20" style={{ perspective: "600px" }}>
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateX: [0, 0, 180, 180, 360] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          delay,
          ease: "easeInOut",
          times: [0, 0.38, 0.5, 0.88, 1.0],
        }}
      >
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Image
            src={front.src}
            alt={front.name}
            fill
            className="object-contain"
            sizes="20vw"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateX(180deg)",
          }}
        >
          <Image
            src={back.src}
            alt={back.name}
            fill
            className="object-contain"
            sizes="20vw"
          />
        </div>
      </motion.div>
    </div>
  );
}

export function LogoMarquee() {
  return (
    <section className="bg-[var(--brand-primary)] py-6 md:py-8">
      <div className="w-[94%] max-w-7xl mx-auto">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-8">
          Ils nous font confiance
        </p>
        <div className="grid grid-cols-3 md:grid-cols-5 items-center gap-y-8">
          {flipPairs.map((pair, i) => (
            <FlipCard
              key={pair.front.name + pair.back.name}
              front={pair.front}
              back={pair.back}
              delay={i * 0.8}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
