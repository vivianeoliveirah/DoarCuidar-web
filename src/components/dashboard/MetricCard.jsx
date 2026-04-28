export default function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "emerald",
}) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    red: "bg-red-50 text-red-700 ring-red-100",
    sky: "bg-sky-50 text-sky-700 ring-sky-100",
  };

  return (
    <article className="rounded-[1.35rem] border border-slate-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <strong className="mt-2 block text-2xl font-extrabold tracking-tight text-slate-950">
            {value}
          </strong>
        </div>

        {Icon && (
          <span
            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${tones[tone]}`}
            aria-hidden="true"
          >
            <Icon size={20} />
          </span>
        )}
      </div>

      {description && (
        <p className="mt-4 text-sm leading-6 text-slate-600">{description}</p>
      )}
    </article>
  );
}
