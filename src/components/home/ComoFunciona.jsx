import { Search, Heart, CheckCircle } from "lucide-react";

export default function ComoFunciona() {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-4">

        <div className="text-center mb-12">
          <span className="text-emerald-400 text-sm font-semibold tracking-widest uppercase">
            Transparência e simplicidade
          </span>

          <h2 className="text-3xl font-bold mt-2">
            Como funciona o DoarCuidar
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-slate-800 p-6 rounded-2xl hover:scale-105 transition-all cursor-pointer">
            <Search className="text-emerald-400 mb-4" size={28} />
            <h3 className="font-bold text-lg">Explore</h3>
            <p className="text-slate-400 mt-2 text-sm">
              Encontre instituições verificadas através do CNPJ.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl hover:scale-105 transition-all cursor-pointer">
            <Heart className="text-emerald-400 mb-4" size={28} />
            <h3 className="font-bold text-lg">Doe</h3>
            <p className="text-slate-400 mt-2 text-sm">
              Escolha como ajudar e faça sua contribuição.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl hover:scale-105 transition-all cursor-pointer">
            <CheckCircle className="text-emerald-400 mb-4" size={28} />
            <h3 className="font-bold text-lg">Transforme</h3>
            <p className="text-slate-400 mt-2 text-sm">
              Veja o impacto real da sua doação.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}