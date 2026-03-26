import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Verifique se lucide-react está instalado

export default function CampoSenha({ label, value, onChange, id, placeholder = "••••••••" }) {
  const [mostrar, setMostrar] = useState(false);

  return (
    <div className="flex flex-col gap-1 w-full text-left">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={mostrar ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-11 w-full px-4 pr-12 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
          required
        />
        <button
          type="button"
          onClick={() => setMostrar(!mostrar)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-emerald-600 transition-colors"
          title={mostrar ? "Esconder senha" : "Mostrar senha"}
        >
          {mostrar ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}