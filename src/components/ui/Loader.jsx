export default function Loader({ text = "Carregando..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10" role="status" aria-live="polite">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" aria-hidden="true"></div>
      <p className="mt-3 text-slate-500">{text}</p>
    </div>
  );
}
