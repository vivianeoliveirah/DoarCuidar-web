import { HeartHandshake } from "lucide-react";

export default function PurposeQuoteSection() {
  return (
    <section className="bg-white px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="motion-safe:animate-[purpose-quote-rise_700ms_ease-out_both] rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-5 py-7 text-center shadow-sm shadow-slate-950/5 sm:px-8 sm:py-8 lg:px-10">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-emerald-100 bg-white text-emerald-700 shadow-sm">
            <HeartHandshake size={21} strokeWidth={1.8} aria-hidden="true" />
          </div>

          <h2 className="mt-5 text-balance text-2xl font-extrabold text-slate-950 sm:text-3xl">
            Apoiar começa por conhecer.
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Encontre instituições, consulte informações públicas e escolha como
            contribuir por meio dos canais oficiais.
          </p>
        </div>
      </div>
    </section>
  );
}
