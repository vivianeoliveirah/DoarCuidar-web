import { useMemo } from "react";

import Layout from "../../components/layout/Layout";
import HeroSection from "../../components/home/HeroSection";
import DonationGallery from "../../components/home/DonationGallery";
import ComoFunciona from "../../components/home/ComoFunciona";
import TransparencySection from "../../components/transparencia/TransparencySection";
import { useApiResource } from "../../hooks/useApiResource";
import { api } from "../../services/api";

function asInstitutionList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function isAmigosDoBem(instituicao) {
  return `${instituicao?.nome || ""} ${instituicao?.razao_social || ""}`
    .toLowerCase()
    .includes("amigos do bem");
}

export default function Home() {
  const { data: instituicoes } = useApiResource(api.getInstituicoes, {
    initialData: [],
    select: asInstitutionList,
  });

  const destaques = useMemo(() => {
    const amigosDoBem = instituicoes.find(isAmigosDoBem);
    const demais = instituicoes.filter((item) => !isAmigosDoBem(item));

    return [...(amigosDoBem ? [amigosDoBem] : []), ...demais].slice(0, 3);
  }, [instituicoes]);

  return (
    <Layout className="bg-white">
      <HeroSection />
      <DonationGallery instituicoes={destaques} />
      <TransparencySection />
      <div id="conhecer-projeto">
        <ComoFunciona />
      </div>
    </Layout>
  );
}
