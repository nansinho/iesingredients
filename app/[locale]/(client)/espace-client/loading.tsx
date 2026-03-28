function Bone({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200/70 ${className}`} />;
}

export default function DashboardLoading() {
  return (
    <div className="w-full">
      {/* Welcome */}
      <Bone className="h-8 w-64 mb-2" />
      <Bone className="h-4 w-96 mb-8" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl bg-white p-5">
            <Bone className="h-12 w-12 rounded-xl" />
            <div>
              <Bone className="h-4 w-24 mb-2" />
              <Bone className="h-7 w-12" />
            </div>
          </div>
        ))}
      </div>

      {/* Cart section */}
      <Bone className="h-5 w-48 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl bg-white p-4">
            <Bone className="h-10 w-10 rounded-xl" />
            <div className="flex-1">
              <Bone className="h-4 w-32 mb-1.5" />
              <Bone className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent requests */}
      <Bone className="h-5 w-40 mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl bg-white p-4">
            <Bone className="h-10 w-10 rounded-xl" />
            <div className="flex-1">
              <Bone className="h-4 w-48 mb-1.5" />
              <Bone className="h-3 w-24" />
            </div>
            <Bone className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
