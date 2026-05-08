import { useId } from "react";

export default function SelectUF({ value, onChange, id }) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const ufs = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-sm font-semibold text-slate-700">
        Estado (UF)
      </label>
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      >
        <option value="">Todos os estados</option>
        {ufs.map((uf) => (
          <option key={uf} value={uf}>{uf}</option>
        ))}
      </select>
    </div>
  );
}
