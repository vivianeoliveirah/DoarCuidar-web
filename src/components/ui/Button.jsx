export default function Button({ variant="brand", size="md", className="", ...props }) {
  const variants = {
    brand: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm disabled:opacity-50",
    outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50",
    dark: "bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-xl",
    md: "px-5 py-2.5 text-sm rounded-xl",
    lg: "px-8 py-3.5 text-base rounded-2xl"
  };

  return (
    <button 
      className={`transition-all active:scale-95 font-medium flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props} 
    />
  );
}