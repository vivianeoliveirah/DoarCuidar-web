import { ShieldCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-slate-50 py-8">
      
      <div className="max-w-5xl mx-auto px-4 text-center">

        {/* TÍTULO */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
          Encontre uma instituição
          <span className="block text-emerald-600 mt-2">
            e faça a diferença hoje
          </span>
        </h1>

        {/* SUBTEXTO */}
        <p className="text-slate-600 mt-4">
          Consulte CNPJ oficial, filtre por estado e conecte-se com causas reais.
        </p>

        {/* FRASE */}
        <div className="mt-6 flex justify-center">
          <div className="max-w-2xl w-full bg-white/80 backdrop-blur rounded-xl px-6 py-4 border border-slate-200 shadow-sm">

            <p className="text-slate-700 text-sm leading-relaxed text-center italic">
              “Toda a caridade que fizerdes deve ser para os pais, parentes,
              órfãos, necessitados e viajantes. E todo o bem que fizerdes,
              será reconhecido.”
            </p>

            <span className="block text-xs text-slate-400 mt-2 text-center">
              2ª Surata Al Báçara – A Vaca 215
            </span>

          </div>
        </div>

        {/* BOTÕES */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">

          <button
            onClick={() => navigate("/buscar")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition-all hover:scale-105"
          >
            Explorar causas
          </button>

          <button
            onClick={() => navigate("/cadastro-instituicao")}
            className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-xl font-semibold transition-all"
          >
            Cadastrar ONG
          </button>

        </div>

        {/* INFO */}
        <div className="mt-5 flex items-center justify-center gap-6 text-sm text-slate-600">

          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Dados verificados
          </span>

          <span className="inline-flex items-center gap-2">
            <Users className="h-4 w-4" aria-hidden="true" />
            Comunidade engajada
          </span>

        </div>

      </div>
    </section>
  );
}