import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import { supabase } from "../../services/supabase";

import {
  MapPin,
  Building2,
  Mail,
  Phone,
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  Heart,
} from "lucide-react";

export default function DetalhesInstituicao() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [instituicao, setInstituicao] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      setLoading(true);

      const { data, error } = await supabase
        .from("instituicoes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erro ao carregar instituição:", error);
        setInstituicao(null);
      } else {
        setInstituicao(data);
      }

      setLoading(false);
    }

    carregar();
  }, [id]);

  // 🔄 Loading melhor
  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20 text-slate-400">
          Carregando instituição...
        </div>
      </Layout>
    );
  }

  // ❌ Caso não encontre
  if (!instituicao) {
    return (
      <Layout>
        <div className="text-center py-20 text-red-500">
          Instituição não encontrada.
        </div>
      </Layout>
    );
  }

  return (
    <Layout className="bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* VOLTAR */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-8"
        >
          <ArrowLeft size={20} />
          Voltar para a busca
        </button>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ESQUERDA */}
          <div className="lg:col-span-2 space-y-8">

            {/* HEADER */}
            <div className="bg-white rounded-3xl p-8 border">
              <div className="flex gap-6">

                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Building2 size={40} />
                </div>

                <div>
                  <span className="text-sm text-slate-400">
                    CNPJ {instituicao.cnpj || "Não informado"}
                  </span>

                  <h1 className="text-3xl font-bold mt-2">
                    {instituicao.nome || "Sem nome"}
                  </h1>

                  <div className="flex gap-4 mt-3 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} /> {instituicao.uf || "—"}
                    </span>

                    <span className="flex items-center gap-1">
                      <ShieldCheck size={16} /> Ativa
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* DESCRIÇÃO */}
            <div className="bg-white rounded-3xl p-8 border">
              <h2 className="text-xl font-bold mb-4">
                Sobre a Instituição
              </h2>

              <p className="text-slate-600">
                {instituicao.descricao || "Esta instituição ainda não possui descrição."}
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-6">

                {/* EMAIL */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="flex items-center gap-2">
                    <Mail size={16} />
                    {instituicao.email || "Não informado"}
                  </p>
                </div>

                {/* TELEFONE (AGORA DINÂMICO) */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400">Telefone</p>
                  <p className="flex items-center gap-2">
                    <Phone size={16} />
                    {instituicao.telefone || "Não informado"}
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* DIREITA */}
          <div>
            <div className="bg-white rounded-3xl p-8 text-center shadow-lg">

              <Heart size={40} className="mx-auto text-pink-500 mb-4" />

              <h3 className="font-bold text-lg">
                Faça uma Doação
              </h3>

              <p className="text-sm text-slate-500 mb-6">
                Ajude {instituicao.nome}
              </p>

              {/* PIX */}
              <Button
                className="w-full mb-3"
                onClick={() => navigate(`/doar/${instituicao.id}`)}
              >
                Doar via PIX
              </Button>

              {/* SITE */}
              {instituicao.site ? (
                <a href={instituicao.site} target="_blank">
                  <Button variant="outline" className="w-full">
                    <ExternalLink size={16} /> Visitar site
                  </Button>
                </a>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Site não disponível
                </Button>
              )}

            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}