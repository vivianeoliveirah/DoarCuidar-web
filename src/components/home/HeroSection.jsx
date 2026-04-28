import { ShieldCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-10 pt-14 text-center sm:px-6 sm:pb-12 sm:pt-16 lg:pb-14 lg:pt-20">
        <p className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
          Doações com transparência
        </p>

        <h1 className="mt-7 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          Encontre uma instituição
          <span className="mt-2 block text-emerald-600">
            e faça a diferença hoje
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          Consulte CNPJ oficial, filtre por estado e conecte-se com causas reais.
        </p>

        <figure className="mt-8 w-full max-w-3xl rounded-[1.5rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-5 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:px-8">
          <blockquote>
            <p className="text-base font-medium leading-8 text-slate-700">
              “Perguntam-te que parte devem gastar (em caridade). Dize-lhes: Toda a
              caridade que fizerdes, deve ser para os pais, parentes, órfãos,
              necessitados e viajantes (desamparados). E sabei que todo o bem que
              fizerdes, Allah dele tomará consciência.”
            </p>
          </blockquote>
          <figcaption className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            2ª Surata Al Báçara – A Vaca 215
          </figcaption>
        </figure>

        <div className="mt-8 flex w-full max-w-xl flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/instituicoes")}
            className="inline-flex min-h-13 flex-1 items-center justify-center rounded-full bg-emerald-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            aria-label="Explorar instituições para doar"
          >
            Explorar causas
          </button>
          <button
            type="button"
            onClick={() => document.getElementById("conhecer-projeto")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex min-h-13 flex-1 items-center justify-center rounded-full border border-emerald-200 bg-white px-7 py-3.5 text-base font-bold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            aria-label="Conhecer como funciona o DoarCuidar"
          >
            Como funciona
          </button>
        </div>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 text-sm font-semibold text-slate-600 sm:flex-row sm:gap-8">
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
