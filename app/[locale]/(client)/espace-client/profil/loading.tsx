function Bone({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200/70 ${className}`} />;
}

export default function ProfilLoading() {
  return (
    <div className="w-full max-w-3xl">
      <Bone className="h-8 w-36 mb-2" />
      <Bone className="h-4 w-80 mb-8" />

      <div className="rounded-2xl bg-white p-6 space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <Bone className="h-16 w-16 rounded-full" />
          <Bone className="h-4 w-40" />
        </div>
        {/* Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Bone className="h-4 w-16 mb-2" />
            <Bone className="h-10 w-full rounded-xl" />
          </div>
          <div>
            <Bone className="h-4 w-20 mb-2" />
            <Bone className="h-10 w-full rounded-xl" />
          </div>
        </div>
        <div>
          <Bone className="h-4 w-12 mb-2" />
          <Bone className="h-10 w-full rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Bone className="h-4 w-24 mb-2" />
            <Bone className="h-10 w-full rounded-xl" />
          </div>
          <div>
            <Bone className="h-4 w-20 mb-2" />
            <Bone className="h-10 w-full rounded-xl" />
          </div>
        </div>
        <Bone className="h-10 w-40 rounded-xl" />
      </div>
    </div>
  );
}
