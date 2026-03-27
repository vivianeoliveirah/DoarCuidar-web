import Layout from "../../components/layout/Layout";
import HeroSection from "../../components/home/HeroSection";
import DonationGallery from "../../components/home/DonationGallery";
import ComoFunciona from "../../components/home/ComoFunciona";

import { useEffect, useState } from "react";
import { api } from "../../services/api"; // 🔥 NOVO

export default function Home() {
  const [instituicoes, setInstituicoes] = useState([]);

  useEffect(() => {
    async function carregar() {
      try {
        const data = await api.getInstituicoes();

        // 🔥 pegando só 3 (igual antes)
        setInstituicoes(data.slice(0, 3));

      } catch (error) {
        console.error("Erro ao carregar Home:", error);
        setInstituicoes([]);
      }
    }

    carregar();
  }, []);

  return (
    <Layout>

      <HeroSection />

      {/* 🔥 continua igual, só mudou a fonte de dados */}
      <DonationGallery instituicoes={instituicoes} />

      <ComoFunciona />

    </Layout>
  );
}