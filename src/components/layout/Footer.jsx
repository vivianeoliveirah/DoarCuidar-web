import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-6">

      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
            <Heart size={16} fill="currentColor" />
          </div>

          <span className="font-bold text-slate-900 tracking-tight">
            Doar<span className="text-emerald-600">Cuidar</span>
          </span>
        </div>

        <p className="text-sm text-slate-500 italic">
          © 2026 DoarCuidar — Transformando o mundo através da solidariedade.
        </p>

      </div>

    </footer>
  );
}