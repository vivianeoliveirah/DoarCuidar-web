import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

export default function Layout({ children, className = "" }) {
  const { pathname } = useLocation();
  const showSidebar = pathname !== "/";

  return (
    <div className={`min-h-screen bg-slate-50 ${showSidebar ? "lg:pl-72" : ""}`}>
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-emerald-600 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        Ir para o conteúdo principal
      </a>

      <Header />

      <main id="conteudo-principal" className={`min-h-screen w-full ${className}`}>
        {children}
      </main>

      <Footer />
    </div>
  );
}
