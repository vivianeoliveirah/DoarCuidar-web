import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Database,
  FileCheck2,
  Scale,
  Search,
} from "lucide-react";

import Layout from "../../components/layout/Layout";

const validationSteps = [
  {
    title: "Identificação formal",
    text: "O CNPJ funciona como ponto de partida para localizar a instituição e apresentar seus dados básicos.",
    icon: FileCheck2,
  },
  {
    title: "Consulta em bases públicas",
    text: "O protótipo consulta fontes públicas, como BrasilAPI e CNPJ.ws, para exibir informações institucionais.",
    icon: Database,
  },
  {
    title: "Busca por nome, CNPJ e estado",
    text: "A listagem permite filtrar instituições por nome, CNPJ e UF para facilitar a comparação antes da decisão.",
    icon: Building2,
  },
  {
    title: "Escolha consciente",
    text: "Depois de encontrar uma instituição, a pessoa acessa os detalhes e decide se quer apoiar pelos canais oficiais.",
    icon: Search,
  },
];

const principles = [
  "Busca por CNPJ, nome e estado.",
  "Detalhes institucionais antes da decisão.",
  "Apoio financeiro fora da plataforma.",
];

const indicators = [
  { label: "Base", value: "CNPJ", icon: FileCheck2 },
  { label: "Filtro", value: "Nome/CNPJ/UF", icon: Search },
  { label: "Consulta", value: "BrasilAPI/CNPJ.ws", icon: Database },
];

export default function Transparencia() {
  return (
    <Layout className="bg-white">
      <section className="border-b border-slate-200 bg-gradient-to-b from-emerald-50/70 via-white to-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.72fr] lg:items-center lg:py-16">
          <div>
            <p className="inline-flex rounded-full border border-emerald-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 shadow-sm">
              Transparência e validação
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              Como o DoarCuidar ajuda na escolha de uma instituição.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              A plataforma ajuda a encontrar instituições por nome, CNPJ e estado,
              mostra dados institucionais para comparação e deixa a decisão de apoio
              com o doador. O DoarCuidar não realiza pagamento nem transfere valores.
            </p>

            <ul className="mt-7 grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-3">
              {principles.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                <Scale size={22} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-950">Modelo do protótipo</p>
                <p className="text-sm text-slate-500">Busca, detalhes e decisão</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {indicators.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                    <item.icon className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                    {item.label}
                  </span>
                  <strong className="text-sm text-slate-950">{item.value}</strong>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-14" aria-label="Etapas de verificacao institucional">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">
            Processo de verificação
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">
            Da busca até a decisão de apoiar.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {validationSteps.map((item, index) => (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <item.icon size={21} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Etapa {index + 1}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:py-14">
          <article>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">
              Metodologia dos dados
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">
              O que a validação confirma e o que ela não confirma.
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
              <p>
                As informações chegam da API do projeto e podem ser complementadas por
                consulta pública de CNPJ. A busca permite comparar nome, CNPJ, UF,
                descrição e canais oficiais antes de qualquer decisão.
              </p>
              <p>
                O login cria uma sessão para acessar a área pessoal e, quando usado,
                registrar um apoio no histórico. Esse registro é apenas acompanhamento:
                a contribuição financeira deve acontecer fora do DoarCuidar, pelos
                canais oficiais da instituição escolhida.
              </p>
            </div>
          </article>

          <aside className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
            <div className="flex items-center gap-3 font-bold">
              <AlertTriangle size={22} aria-hidden="true" />
              Limitações do protótipo
            </div>
            <p className="mt-4 text-sm leading-7">
              O DoarCuidar não processa pagamentos, não substitui auditoria jurídica
              e não garante sozinho a idoneidade de uma instituição. A proposta é
              facilitar a busca, organizar detalhes importantes e apoiar uma decisão
              mais informada.
            </p>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
