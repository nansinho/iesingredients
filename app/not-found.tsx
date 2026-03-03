import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--brand-primary)] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <p className="text-[var(--brand-accent)] text-sm uppercase tracking-widest font-medium mb-4">
          Erreur 404
        </p>
        <h1 className="font-playfair italic text-5xl md:text-[3.5rem] text-cream-light mb-6">
          Page introuvable
        </h1>
        <p className="text-cream-light/50 text-lg mb-10">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/fr"
          className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[var(--brand-accent)] text-white font-medium hover:bg-[var(--brand-accent-hover)] transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
