import { createElement } from "react";
import { Building2, ClipboardCheck, HeartHandshake, LineChart } from "lucide-react";

const indicators = [
  {
    icon: Building2,
    value: "Instituições",
    title: "encontradas",
    text: "Dados essenciais reunidos para facilitar comparação e escolha.",
  },
  {
    icon: ClipboardCheck,
    value: "CNPJ",
    title: "consultado",
    text: "A consulta pública ajuda a apresentar informações institucionais.",
  },
  {
    icon: HeartHandshake,
    value: "Apoios",
    title: "registrados",
    text: "Histórico organizado para acompanhar intenções de apoio.",
  },
  {
    icon: LineChart,
    value: "Dados",
    title: "analisados",
    text: "Indicadores visuais ajudam a entender cobertura e completude.",
  },
];

export default function TransparencySection() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">
              Transparência e dados
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Informação clara para apoiar com mais confiança.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              O DoarCuidar organiza dados de instituições, CNPJ e canais oficiais para que a decisão de apoio seja mais consciente.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {indicators.map((item) => (
              <article
                key={`${item.value}-${item.title}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  {createElement(item.icon, { size: 20, strokeWidth: 1.9, "aria-hidden": true })}
                </span>
                <strong className="mt-5 block text-2xl font-extrabold tracking-tight text-slate-950">
                  {item.value}
                </strong>
                <p className="mt-1 text-sm font-bold text-emerald-700">{item.title}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
