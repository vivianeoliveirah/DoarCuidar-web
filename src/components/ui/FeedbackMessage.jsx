import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export default function FeedbackMessage({ feedback }) {
  if (!feedback) return null;

  const styles = {
    error: {
      className: "border-red-200 bg-red-50 text-red-800",
      Icon: XCircle,
      iconClassName: "text-red-600",
    },
    warning: {
      className: "border-amber-200 bg-amber-50 text-amber-900",
      Icon: AlertTriangle,
      iconClassName: "text-amber-600",
    },
    success: {
      className: "border-emerald-200 bg-emerald-50 text-emerald-900",
      Icon: CheckCircle2,
      iconClassName: "text-emerald-600",
    },
  };

  const style = styles[feedback.type] || styles.error;
  const { Icon } = style;

  return (
    <div
      className={`flex gap-3 rounded-2xl border p-3 text-sm leading-6 ${style.className}`}
      role={feedback.type === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      <Icon
        size={18}
        className={`mt-0.5 shrink-0 ${style.iconClassName}`}
        aria-hidden="true"
      />
      <div>
        {feedback.title && <p className="font-bold">{feedback.title}</p>}
        <p>{feedback.message}</p>
      </div>
    </div>
  );
}
