import { HeartHandshake } from "lucide-react";

export default function PurposeQuoteSection() {
  return (
    <section className="bg-white px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="motion-safe:animate-[purpose-quote-rise_700ms_ease-out_both] rounded-[1.5rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-5 py-7 text-center shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:px-8 sm:py-8 lg:px-10">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-emerald-100 bg-white text-emerald-700 shadow-sm">
            <HeartHandshake size={21} strokeWidth={1.8} aria-hidden="true" />
          </div>

          <blockquote className="mx-auto mt-5 max-w-3xl">
            <p className="text-balance text-base font-medium leading-8 text-slate-800 sm:text-lg sm:leading-8">
              “Perguntam-te que parte devem gastar (em caridade). Dize-lhes: Toda a caridade que fizerdes, deve ser para os pais, parentes, órfãos, necessitados e viajantes (desamparados). E sabei que todo o bem que fizerdes, Allah dele tomará consciência.”
            </p>

            <footer className="mt-5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-emerald-700 sm:text-xs">
              — 2ª Surata Al Bácara (A Vaca), 215
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
