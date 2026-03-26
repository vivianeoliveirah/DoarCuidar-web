export default function CauseCard({ cause }) {
  return (
    <div className="group relative h-80 overflow-hidden rounded-3xl shadow-lg hover:-translate-y-1 transition-all duration-300">

      <img
        src={cause.image}
        alt={cause.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end">

        <h3 className="text-white text-xl font-bold mb-2">
          {cause.title}
        </h3>

        <p className="text-slate-200 text-sm mb-3">
          {cause.description}
        </p>

        <span className="text-emerald-400 flex items-center font-semibold">
          Ajudar agora →
        </span>

      </div>

    </div>
  );
}