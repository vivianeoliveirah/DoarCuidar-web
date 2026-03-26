export default function InputTexto({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <input
        {...props}
        className="h-11 px-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
      />
    </div>
  );
}