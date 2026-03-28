function Bone({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200/70 ${className}`} />;
}

export default function DemandesLoading() {
  return (
    <div className="w-full">
      <Bone className="h-8 w-48 mb-2" />
      <Bone className="h-4 w-72 mb-8" />

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Bone className="h-10 w-10 rounded-xl" />
                <div>
                  <Bone className="h-4 w-52 mb-1.5" />
                  <Bone className="h-3 w-20" />
                </div>
              </div>
              <Bone className="h-6 w-20 rounded-full" />
            </div>
            <div className="border-t border-brown/8 pt-3 space-y-2">
              <Bone className="h-3.5 w-64" />
              <Bone className="h-3.5 w-48" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
