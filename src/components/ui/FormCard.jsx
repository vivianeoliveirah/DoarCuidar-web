// src/components/ui/FormCard.jsx
export default function FormCard({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden max-w-2xl mx-auto">
      <div className="px-6 pt-8 pb-6 border-b border-slate-50">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-slate-500 mt-1 text-sm">{subtitle}</p>}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}