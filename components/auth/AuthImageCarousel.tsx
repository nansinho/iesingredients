"use client";

import Image from "next/image";

export function AuthImageCarousel() {
  return (
    <div className="absolute inset-0">
      {/* Images with continuous zoom */}
      <div className="absolute inset-0 animate-slow-zoom">
        <Image
          src="/images/Login/1.jpg"
          alt="Champs de lavande en Provence"
          fill
          priority
          className="object-cover animate-crossfade-1"
          sizes="50vw"
        />
        <Image
          src="/images/Login/2.jpg"
          alt="Vignobles"
          fill
          className="object-cover animate-crossfade-2"
          sizes="50vw"
        />
        <Image
          src="/images/Login/3.jpg"
          alt="Ingrédients naturels"
          fill
          className="object-cover animate-crossfade-3"
          sizes="50vw"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/75 via-brand-primary/40 to-brand-accent/30" />

      {/* Slide 1 — "C'est ici... En Provence" */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center px-12">
          <p className="text-white/70 text-xl md:text-2xl font-light tracking-wide animate-text-1a">
            C&apos;est ici...
          </p>
          <p className="text-white text-3xl md:text-5xl font-semibold tracking-[-0.02em] mt-3 animate-text-1b">
            En Provence
          </p>
        </div>
      </div>

      {/* Slide 2 — "Où naissent Vos Inspirations" */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center px-12">
          <p className="text-white/70 text-xl md:text-2xl font-light tracking-wide animate-text-2a">
            Où naissent
          </p>
          <p className="text-white text-3xl md:text-5xl font-semibold tracking-[-0.02em] mt-3 animate-text-2b">
            Vos Inspirations
          </p>
        </div>
      </div>

      {/* Slide 3 — Logo IES Ingredients */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="animate-text-3">
          <Image
            src="/images/logo-ies.png"
            alt="IES Ingredients"
            width={280}
            height={112}
            className="w-auto h-16 md:h-20 brightness-0 invert"
          />
        </div>
      </div>
    </div>
  );
}
