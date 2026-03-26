import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children, className = "" }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      <Header />

      {/* CONTEÚDO */}
      <main className={`flex-1 w-full ${className}`}>
        {children}
      </main>

      <Footer />

    </div>
  );
}