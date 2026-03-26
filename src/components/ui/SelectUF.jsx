export default function SelectUF({ value, onChange }) {
  const ufs = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700">Estado (UF)</label>
      <select
        value={value}
        onChange={onChange}
        className="h-11 px-4 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
      >
        <option value="">Todos os estados</option>
        {ufs.map((uf) => (
          <option key={uf} value={uf}>{uf}</option>
        ))}
      </select>
    </div>
  );
}