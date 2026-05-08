export default function ChartSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-label="Carregando dados do dashboard">
      <span className="sr-only">Carregando dados do dashboard...</span>
      <div className="h-80 animate-pulse rounded-2xl bg-slate-100 p-6" aria-hidden="true">
        <div className="mb-8 h-4 w-40 rounded-full bg-slate-200" />
        <div className="flex h-56 items-end gap-3">
          {[45, 72, 58, 86, 64, 92, 76].map((height) => (
            <div
              key={height}
              className="flex-1 rounded-t-xl bg-slate-200"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
