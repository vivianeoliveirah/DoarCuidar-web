import { createElement } from "react";
import { CheckCircle, Heart, Search } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Explore",
    text: "Busque instituições por nome, estado ou CNPJ e compare informações essenciais.",
  },
  {
    icon: Heart,
    title: "Doe",
    text: "Escolha uma causa confiável e siga para o fluxo de contribuição.",
  },
  {
    icon: CheckCircle,
    title: "Transforme",
    text: "Acompanhe dados de impacto e transparência no painel analítico.",
  },
];

export default function ComoFunciona() {
  return (
    <section className="bg-gradient-to-br from-slate-950 to-slate-900 py-14 text-white sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-400">
            Transparência e simplicidade
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Como funciona o DoarCuidar
          </h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {steps.map(({ icon, title, text }) => (
            <article
              key={title}
              className="rounded-[1.35rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/10 transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              {createElement(icon, {
                className: "text-emerald-400",
                size: 28,
                "aria-hidden": true,
              })}
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
