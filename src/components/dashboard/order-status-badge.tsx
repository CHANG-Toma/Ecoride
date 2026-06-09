type OrderStatus =
  | "en_attente"
  | "confirmee"
  | "en_preparation"
  | "expediee"
  | "livree"
  | "annulee"
  | string;

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  en_attente: { label: "En attente", color: "#b45309", bg: "#fef3c7" },
  confirmee: { label: "Confirmée", color: "#1d4ed8", bg: "#dbeafe" },
  en_preparation: { label: "En préparation", color: "#6d28d9", bg: "#ede9fe" },
  expediee: { label: "Expédiée", color: "#0369a1", bg: "#e0f2fe" },
  livree: { label: "Livrée", color: "#15803d", bg: "#dcfce7" },
  annulee: { label: "Annulée", color: "#b91c1c", bg: "#fee2e2" },
};

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    color: "#64748b",
    bg: "#f1f5f9",
  };

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ color: config.color, background: config.bg }}
    >
      {config.label}
    </span>
  );
}
