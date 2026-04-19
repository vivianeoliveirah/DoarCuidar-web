import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// TROQUE O "@" PELO CAMINHO RELATIVO:
import Layout from "../../components/layout/Layout";
import Breadcrumb from "../../components/ui/Breadcrumb";
import FormCard from "../../components/ui/FormCard";
import InputTexto from "../../components/ui/InputTexto";
import Button from "../../components/ui/Button";
import { api } from "../../services/api"; // Verifique se services está na src

export default function Doar() {
  const { id } = useParams(); // Pega o ID da URL
  const navigate = useNavigate();
  
  const [instituicao, setInstituicao] = useState(null);
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);

  // Busca os detalhes da instituição ao carregar
  useEffect(() => {
    async function carregarDados() {
      try {
        const dados = await api.getInstituicaoById(id);
        setInstituicao(dados);
      } catch {
        // Se falhar ou não achar na API, podemos simular um dado básico
        setInstituicao({ nome: "Instituição Selecionada", id });
      }
    }
    carregarDados();
  }, [id]);

  const handleDoar = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        instituicaoId: id,
        valor: parseFloat(valor),
        data: new Date().toISOString()
      };

      await api.postDoacao(payload);
      alert("Obrigado pela sua doação! Você será redirecionado.");
      navigate("/buscar");
    } catch {
      alert("Erro ao processar doação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!instituicao) return <Layout>Carregando...</Layout>;

  return (
    <Layout className="py-12 bg-slate-50">
      <div className="max-w-xl mx-auto px-4">

        <Breadcrumb items={[
          { label: "Buscar Instituições", href: "/buscar" },
          { label: instituicao.nome, href: `/detalhes/${id}` },
          { label: "Doar" }
        ]} />

        <FormCard 
          title="Confirmar Doação" 
          subtitle={`Você está doando para: ${instituicao.nome}`}
        >
          <form onSubmit={handleDoar} className="space-y-6">
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 mb-4">
              <p className="text-sm text-emerald-800 text-center font-medium">
                Sua doação ajuda a manter projetos de impacto social ativos.
              </p>
            </div>

            <InputTexto
              label="Valor da Doação (R$)"
              type="number"
              placeholder="Ex: 50.00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
              min="1"
              step="0.01"
            />

            <div className="grid grid-cols-3 gap-2">
              {[20, 50, 100].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setValor(v.toString())}
                  className="py-2 rounded-xl border border-slate-200 text-slate-600 hover:border-emerald-600 hover:text-emerald-600 transition-all font-medium active:scale-95"
                >
                  R$ {v}
                </button>
              ))}
            </div>

            <Button 
              type="submit" 
              variant="brand" 
              className="w-full h-11.5"
              disabled={loading}
            >
              {loading ? "Processando..." : "Confirmar e Pagar"}
            </Button>

            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="w-full text-sm text-slate-500 hover:underline"
            >
              Cancelar e voltar
            </button>
          </form>
        </FormCard>
      </div>
    </Layout>
  );
}