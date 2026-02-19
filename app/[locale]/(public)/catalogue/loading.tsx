export default function CatalogueLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <section className="bg-forest-950 pt-28 sm:pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-4 w-24 bg-white/10 rounded animate-pulse mb-4" />
          <div className="h-10 w-64 bg-white/10 rounded animate-pulse mb-4" />
          <div className="h-5 w-96 bg-white/10 rounded animate-pulse" />
        </div>
      </section>

      {/* Filters skeleton */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="max-w-7xl mx-auto flex gap-4">
          <div className="h-10 w-64 bg-forest-100 rounded-xl animate-pulse" />
          <div className="h-10 w-40 bg-forest-100 rounded-xl animate-pulse" />
        </div>
      </section>

      {/* Grid skeleton */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-forest-100 overflow-hidden"
              >
                <div className="aspect-[4/3] bg-forest-50 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-3 w-16 bg-forest-100 rounded animate-pulse" />
                  <div className="h-5 w-full bg-forest-100 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-forest-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
