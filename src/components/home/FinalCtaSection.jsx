import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FinalCtaSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl rounded-[1.75rem] border border-emerald-100 bg-gradient-to-br from-emerald-600 to-emerald-700 px-6 py-10 text-center text-white shadow-[0_24px_70px_rgba(5,150,105,0.22)] sm:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-100">
          Comece agora
        </p>
        <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          Encontre uma causa e transforme intenção em cuidado.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-emerald-50">
          Apoie instituições sociais cadastradas e acompanhe uma experiência pensada para solidariedade, transparência e impacto humano.
        </p>
        <button
          type="button"
          onClick={() => navigate("/instituicoes")}
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-emerald-700 shadow-lg shadow-emerald-950/10 transition hover:-translate-y-0.5 hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-700"
          aria-label="Buscar instituições para apoiar"
        >
          Buscar instituições
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
