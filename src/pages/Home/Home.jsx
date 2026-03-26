import Layout from "../../components/layout/Layout";
import HeroSection from "../../components/home/HeroSection";
import DonationGallery from "../../components/home/DonationGallery";
import ComoFunciona from "../../components/home/ComoFunciona";

import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

export default function Home() {
  const [instituicoes, setInstituicoes] = useState([]);

  useEffect(() => {
    async function carregar() {
      const { data, error } = await supabase
        .from("instituicoes")
        .select("*")
        .limit(3);

      if (error) {
        console.error("Erro ao carregar Home:", error);
      } else {
        setInstituicoes(data);
      }
    }

    carregar();
  }, []);

  return (
    <Layout>

      <HeroSection />

      {/* 🔥 AGORA SIM DINÂMICO */}
      <DonationGallery instituicoes={instituicoes} />

      <ComoFunciona />

    </Layout>
  );
}