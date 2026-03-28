function Bone({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200/70 ${className}`} />;
}

export default function SupportLoading() {
  return (
    <div className="w-full flex gap-0 h-[calc(100vh-10rem)]">
      {/* Left — ticket list */}
      <div className="w-80 shrink-0 border-r border-brown/8 p-4 space-y-3">
        <Bone className="h-10 w-full rounded-xl mb-4" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl p-3">
            <Bone className="h-9 w-9 rounded-lg" />
            <div className="flex-1">
              <Bone className="h-3.5 w-32 mb-1.5" />
              <Bone className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
      {/* Right — conversation */}
      <div className="flex-1 flex flex-col p-4">
        <div className="flex items-center gap-3 mb-4">
          <Bone className="h-6 w-48" />
          <Bone className="h-5 w-16 rounded-full" />
        </div>
        <div className="flex-1 rounded-2xl bg-white p-4 space-y-4">
          <div className="flex justify-start"><Bone className="h-16 w-[60%] rounded-2xl" /></div>
          <div className="flex justify-end"><Bone className="h-12 w-[50%] rounded-2xl" /></div>
          <div className="flex justify-start"><Bone className="h-20 w-[65%] rounded-2xl" /></div>
          <div className="flex justify-end"><Bone className="h-10 w-[40%] rounded-2xl" /></div>
        </div>
        <div className="flex gap-2 mt-4">
          <Bone className="h-11 flex-1 rounded-xl" />
          <Bone className="h-11 w-14 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
