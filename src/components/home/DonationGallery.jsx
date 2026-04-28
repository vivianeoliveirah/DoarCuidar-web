import { ArrowRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const fallbackImages = [
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80",
];

const fallbackInstitutions = [
  {
    id: "fallback-amigos-do-bem",
    nome: "AMIGOS DO BEM",
    cnpj: "05.108.918/0001-72",
    uf: "SP",
    descricao:
      "Transforma vidas por meio de educação, geração de renda e projetos de desenvolvimento local para combater a fome e a miséria.",
  },
  {
    id: "fallback-lbv",
    nome: "SEDE CENTRAL DA LBV",
    cnpj: "33.915.604/0001-17",
    uf: "SP",
    descricao:
      "Promove desenvolvimento social, educação, cultura, assistência e iniciativas solidárias para comunidades em vulnerabilidade.",
  },
  {
    id: "fallback-lalec",
    nome: "LALEC",
    cnpj: "03.151.435/0001-25",
    uf: "SP",
    descricao:
      "Acolhe crianças em situação de vulnerabilidade com cuidado, segurança e apoio para seu desenvolvimento.",
  },
];

function isAmigosDoBem(instituicao) {
  const nome = `${instituicao?.nome || ""} ${instituicao?.razao_social || ""}`.toLowerCase();
  const cnpj = instituicao?.cnpj || "";

  return nome.includes("amigos do bem") || cnpj === "05.108.918/0001-72";
}

export default function DonationGallery({ instituicoes = [] }) {
  const navigate = useNavigate();
  const amigosDoBem = fallbackInstitutions[0];
  const source =
    instituicoes.length > 0
      ? [
          ...(instituicoes.some(isAmigosDoBem) ? [] : [amigosDoBem]),
          ...instituicoes,
        ]
      : fallbackInstitutions;

  const lista = source.slice(0, 3).map((inst, index) => ({
    id: inst.id,
    title: inst.nome,
    description: inst.descricao || "Sem descrição disponível.",
    image: inst.imagem_url || fallbackImages[index % fallbackImages.length],
    uf: inst.uf,
    cnpj: inst.cnpj,
    isFallback: String(inst.id).startsWith("fallback-"),
  }));

  return (
    <section className="bg-slate-50 pb-14 pt-10 sm:pb-16 sm:pt-12 lg:pb-20 lg:pt-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Instituições em destaque
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Conecte-se com quem já está fazendo a diferença.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/instituicoes")}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-600/15 transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            aria-label="Ver todas as instituições"
          >
            Ver todas
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {lista.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-[1.35rem] border border-slate-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(15,23,42,0.08)]"
            >
              <button
                type="button"
                onClick={() => (item.isFallback ? navigate("/instituicoes") : navigate(`/detalhes/${item.id}`))}
                className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-inset"
              >
                <div className="relative h-44 overflow-hidden sm:h-48">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm">
                    <MapPin size={12} aria-hidden="true" />
                    {item.uf || "-"}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-1 text-lg font-bold text-slate-950 transition group-hover:text-emerald-700">
                    {item.title}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-slate-500">
                    {item.cnpj || "CNPJ não informado"}
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </div>
              </button>

              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
                <button
                  type="button"
                  onClick={() => (item.isFallback ? navigate("/instituicoes") : navigate(`/detalhes/${item.id}`))}
                  className="text-sm font-bold text-emerald-700 hover:text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  Ver detalhes
                </button>
                <button
                  type="button"
                  onClick={() => (item.isFallback ? navigate("/instituicoes") : navigate(`/doar/${item.id}`))}
                  className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  Doar
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
