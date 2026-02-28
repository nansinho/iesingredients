"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const logos = [
  { name: "Givaudan", src: "/images/logo-givaudan.png" },
  { name: "DSM-Firmenich", src: "/images/logo-dsm-firmenich.png" },
  { name: "MayFlower", src: "/images/logo-mayflower.jpg" },
  { name: "Sensient Beauty", src: "/images/logo-sensient.png" },
  { name: "Xinrui Aromatics", src: "/images/logo-xinrui.png" },
];

// Each position shows 2 different logos (front/back)
const flipPairs = [
  { front: logos[0], back: logos[3] }, // Givaudan ↔ Sensient
  { front: logos[1], back: logos[4] }, // DSM-Firmenich ↔ Xinrui
  { front: logos[2], back: logos[0] }, // MayFlower ↔ Givaudan
  { front: logos[3], back: logos[1] }, // Sensient ↔ DSM-Firmenich
  { front: logos[4], back: logos[2] }, // Xinrui ↔ MayFlower
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
    <div className="relative h-10 md:h-12" style={{ perspective: "600px" }}>
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
        {/* Front face */}
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Image
            src={front.src}
            alt={front.name}
            fill
            className="object-contain"
            style={{ filter: "brightness(0) invert(1)" }}
            sizes="20vw"
          />
        </div>
        {/* Back face */}
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
            style={{ filter: "brightness(0) invert(1)" }}
            sizes="20vw"
          />
        </div>
      </motion.div>
    </div>
  );
}

export function LogoMarquee() {
  return (
    <section className="bg-[#2E1F3D] py-10 md:py-12">
      <div className="w-[94%] mx-auto">
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
