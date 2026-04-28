import { createElement } from "react";
import { Clock, FileQuestion, SearchX } from "lucide-react";

const problems = [
  {
    icon: SearchX,
    title: "Dificuldade para encontrar causas confiáveis",
    text: "Doadores precisam comparar instituições, áreas de atuação e informações básicas antes de contribuir.",
  },
  {
    icon: FileQuestion,
    title: "Pouca clareza sobre campanhas",
    text: "Instituições precisam apresentar dados simples para fortalecer a confiança de quem deseja ajudar.",
  },
  {
    icon: Clock,
    title: "Acompanhamento disperso",
    text: "Histórico, métricas e impacto ficam mais úteis quando estão reunidos em uma visão organizada.",
  },
];

export default function ProblemSection() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold text-emerald-700">Problema</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Doar deveria ser simples, claro e seguro.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            O DoarCuidar organiza informações essenciais para reduzir incertezas e aproximar doadores de instituições sérias.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {problems.map((item) => (
            <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                {createElement(item.icon, { size: 22, "aria-hidden": true })}
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
