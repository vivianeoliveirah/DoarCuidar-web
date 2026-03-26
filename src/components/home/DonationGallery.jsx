import { useNavigate } from "react-router-dom";

// 🔥 imagens fallback (caso ONG não tenha imagem)
const imagens = [
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80",
];

export default function DonationGallery({ instituicoes = [] }) {
  const navigate = useNavigate();

  const lista = instituicoes.map((inst, index) => ({
    id: inst.id,
    title: inst.nome,
    description: inst.descricao || "Sem descrição",
    image: imagens[index % imagens.length],
    logo: inst.logo_url,
    uf: inst.uf,
    cnpj: inst.cnpj,
  }));

  return (
    <section className="py-16 bg-white">

      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Instituições em destaque
          </h2>

          <p className="text-slate-500 mt-2">
            Conecte-se com quem já está fazendo a diferença.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {lista.map((item) => (

            <div
              key={item.id}
              onClick={() => navigate(`/detalhes/${item.id}`)}
              className="group cursor-pointer rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >

              {/* IMAGEM */}
              <div className="relative h-48">

                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* LOGO (se existir) */}
                {item.logo && (
                  <div className="absolute top-3 left-3">
                    <img
                      src={item.logo}
                      alt="logo"
                      className="w-12 h-12 rounded-xl object-cover bg-white p-1 shadow"
                    />
                  </div>
                )}

                {/* UF */}
                <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs px-2 py-1 rounded-lg">
                  {item.uf}
                </div>

              </div>

              {/* CONTEÚDO */}
              <div className="p-5 bg-white">

                <h3 className="font-bold text-lg text-slate-900 line-clamp-1">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 mb-2">
                  {item.cnpj}
                </p>

                <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                  {item.description}
                </p>

                <div className="flex justify-between items-center">

                  {/* DETALHES */}
                  <span className="text-emerald-600 font-semibold text-sm">
                    Ver detalhes →
                  </span>

                  {/* DOAR */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/doar/${item.id}`);
                    }}
                    className="text-xs text-emerald-600 hover:underline"
                  >
                    Doar
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}