export default function FormCard({ title, subtitle, children }) {
  return (
    <section className="mx-auto max-w-2xl overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.07)]">
      <div className="border-b border-slate-100 px-6 pb-6 pt-8 sm:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950">{title}</h2>
        {subtitle && <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>}
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </section>
  );
}
