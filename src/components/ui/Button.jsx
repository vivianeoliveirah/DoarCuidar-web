export default function Button({ variant = "brand", size = "md", className = "", ...props }) {
  const variants = {
    brand: "bg-emerald-600 text-white shadow-lg shadow-emerald-600/15 hover:bg-emerald-700 disabled:opacity-50",
    outline: "border border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50",
    dark: "bg-slate-950 text-white shadow-lg shadow-slate-950/10 hover:bg-slate-800 disabled:opacity-50",
    danger: "bg-red-600 text-white shadow-lg shadow-red-600/15 hover:bg-red-700 disabled:opacity-50",
  };

  const sizes = {
    sm: "min-h-10 px-4 text-xs rounded-full",
    md: "min-h-11 px-5 text-sm rounded-full",
    lg: "min-h-13 px-8 text-base rounded-full",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-bold transition hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
