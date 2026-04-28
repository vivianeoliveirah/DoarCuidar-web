import { createElement } from "react";
import { BarChart3, CheckCircle2, HeartHandshake, ShieldCheck } from "lucide-react";

const benefits = [
  "Instituições organizadas por dados cadastrais e localização.",
  "Histórico de doações acessível para acompanhamento do doador.",
  "Indicadores visuais para entender evolução e impacto.",
  "Fluxo simples para cadastrar, buscar e apoiar campanhas.",
];

export default function DarkBenefitsSection() {
  return (
    <section className="bg-slate-950 py-20 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold text-emerald-400">Benefícios</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Uma experiência pensada para confiança e continuidade.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            A plataforma une navegação clara, dados de instituições e visualizações analíticas para que cada contribuição seja acompanhada com mais segurança.
          </p>

          <ul className="mt-8 space-y-4">
            {benefits.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-slate-200">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/30">
          <div className="rounded-[1.5rem] bg-slate-900 p-5 ring-1 ring-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm font-semibold text-emerald-400">Dashboard DoarCuidar</p>
                <h3 className="mt-1 text-xl font-bold">Impacto social</h3>
              </div>
              <ShieldCheck className="text-emerald-400" aria-hidden="true" />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { icon: HeartHandshake, label: "Doações", value: "R$ 48k" },
                { icon: BarChart3, label: "Evolução", value: "+24%" },
                { icon: ShieldCheck, label: "Transparência", value: "Alta" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/10 p-4">
                  {createElement(item.icon, {
                    size: 18,
                    className: "text-emerald-400",
                    "aria-hidden": true,
                  })}
                  <p className="mt-4 text-xs text-slate-400">{item.label}</p>
                  <strong className="mt-1 block text-lg">{item.value}</strong>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-white/10 p-4">
              <div className="flex h-44 items-end gap-3" aria-hidden="true">
                {[42, 58, 50, 74, 68, 88, 76].map((height, index) => (
                  <span
                    key={`${height}-${index}`}
                    className="flex-1 rounded-t-xl bg-emerald-400"
                    style={{ height: `${height}%`, opacity: 0.55 + index * 0.06 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
