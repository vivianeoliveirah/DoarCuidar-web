import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Heart size={16} fill="currentColor" aria-hidden="true" />
          </div>

          <span className="font-bold tracking-tight text-slate-950">
            Doar<span className="text-emerald-600">Cuidar</span>
          </span>
        </div>

        <p className="text-center text-sm text-slate-500">
          © 2026 DoarCuidar — Transformando o mundo através da solidariedade.
        </p>
      </div>
    </footer>
  );
}
