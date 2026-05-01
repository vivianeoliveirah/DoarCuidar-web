import { ShieldCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 pb-10 pt-20 text-center sm:px-6 sm:pb-12 sm:pt-24 lg:pb-14 lg:pt-28">
        <p className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
          Doações com transparência
        </p>

        <h1 className="mt-9 max-w-5xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
          Encontre uma instituição
          <span className="block pt-2 text-emerald-600">
            e faça a diferença hoje
          </span>
        </h1>

        <p className="mt-7 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">
          Busque por nome, CNPJ ou estado, veja os detalhes e escolha como apoiar.
        </p>

        <figure className="mt-9 w-full max-w-3xl rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-5 py-7 shadow-2xl shadow-slate-200/70 sm:px-10">
          <blockquote>
            <p className="text-sm font-bold leading-8 text-slate-800 sm:text-base">
              "Perguntam-te que parte devem gastar (em caridade). Dize-lhes: Toda a caridade que fizerdes, deve ser para os pais, parentes, órfãos, necessitados e viajantes (desamparados). E sabei que todo o bem que fizerdes, Allah dele tomará consciência."
            </p>
          </blockquote>
          <figcaption className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
            2ª Surata Al Báqara - A Vaca 215
          </figcaption>
        </figure>

        <div className="mt-8 flex w-full max-w-2xl flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/instituicoes")}
            className="inline-flex min-h-14 flex-1 items-center justify-center rounded-full bg-emerald-600 px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-emerald-600/25 transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            aria-label="Explorar causas"
          >
            Explorar causas
          </button>
          <button
            type="button"
            onClick={() => document.getElementById("conhecer-projeto")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex min-h-14 flex-1 items-center justify-center rounded-full border border-emerald-200 bg-white px-7 py-3.5 text-base font-bold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            aria-label="Conhecer como funciona"
          >
            Como funciona
          </button>
        </div>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 text-sm font-semibold text-slate-700 sm:flex-row sm:gap-8">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            Dados verificados
          </span>
          <span className="inline-flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            Comunidade engajada
          </span>
        </div>
      </div>
    </section>
  );
}
