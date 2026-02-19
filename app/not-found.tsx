import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-forest-950 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <p className="text-gold-400 text-sm uppercase tracking-widest font-medium mb-4">
          Erreur 404
        </p>
        <h1 className="font-serif text-5xl md:text-6xl text-white mb-6">
          Page introuvable
        </h1>
        <p className="text-cream-300 text-lg mb-10">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/fr"
          className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-gold-500 text-forest-900 font-medium hover:bg-gold-400 transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
