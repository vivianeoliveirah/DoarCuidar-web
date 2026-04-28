export default function Panel({ title, description, action, children, className = "" }) {
  return (
    <section className={`rounded-[1.35rem] border border-slate-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.05)] ${className}`}>
      {(title || description || action) && (
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h2 className="text-base font-bold tracking-tight text-slate-950">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
            )}
          </div>
          {action}
        </div>
      )}

      <div className="p-5">{children}</div>
    </section>
  );
}
