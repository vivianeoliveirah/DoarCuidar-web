export default function Loader({ text = "Carregando..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-3 text-slate-500">{text}</p>
    </div>
  );
}