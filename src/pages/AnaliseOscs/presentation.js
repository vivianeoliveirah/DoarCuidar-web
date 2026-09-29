const ACTIVITY_AXIS_LABELS = new Map([
  ["Atividades de organizações religiosas", "Organizações religiosas"],
  [
    "Atividades de associações de defesa de direitos sociais",
    "Defesa de direitos sociais",
  ],
  [
    "Atividades associativas não especificadas anteriormente",
    "Outras atividades associativas",
  ],
  [
    "Atividades de organizações associativas ligadas à cultura e à arte",
    "Associações de cultura e arte",
  ],
  [
    "Atividades esportivas não especificadas anteriormente",
    "Outras atividades esportivas",
  ],
  ["Serviços de assistência social sem alojamento", "Assistência social sem alojamento"],
  [
    "Atividades de organizações associativas profissionais",
    "Associações profissionais",
  ],
  [
    "Atividades de organizações associativas patronais e empresariais",
    "Associações patronais e empresariais",
  ],
]);

function shortenLabel(value, size = 30) {
  const text = String(value || "");
  return text.length > size ? `${text.slice(0, size - 1)}…` : text;
}

export function getActivityAxisLabel(value) {
  const text = String(value || "");
  return ACTIVITY_AXIS_LABELS.get(text) || shortenLabel(text, 31);
}

export function getMatrixBranchLabel(value) {
  const normalizedValue = String(value ?? "").trim();
  if (normalizedValue === "1") return "Matriz";
  if (normalizedValue === "0") return "Filial";
  return normalizedValue;
}
