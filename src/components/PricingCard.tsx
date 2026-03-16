import type { PricingPlan } from "@/lib/types";

interface PricingCardProps {
  plan: PricingPlan;
}

export default function PricingCard({ plan }: PricingCardProps) {
  return (
    <div
      className={`rounded-2xl border p-6 flex flex-col ${
        plan.recommended
          ? "border-accent shadow-lg ring-1 ring-accent/20"
          : "border-border"
      }`}
    >
      {plan.recommended && (
        <span className="text-xs font-medium text-accent mb-2">推奨</span>
      )}
      <h3 className="text-lg font-bold">{plan.name}</h3>
      <div className="mt-2 mb-4">
        <span className="text-3xl font-bold">
          {plan.priceYen === 0
            ? "¥0"
            : `¥${plan.priceYen.toLocaleString()}`}
        </span>
        <span className="text-sm text-muted"> / 月</span>
      </div>
      <ul className="space-y-2 flex-1">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="mt-0.5 flex-shrink-0 text-accent"
            >
              <path
                d="M3 8L6.5 11.5L13 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        className={`mt-6 w-full py-2.5 rounded-xl text-sm font-medium transition ${
          plan.recommended
            ? "bg-foreground text-background hover:opacity-90"
            : "border border-border hover:bg-card-bg"
        }`}
      >
        {plan.priceYen === 0 ? "無料ではじめる" : "Pro プランをはじめる"}
      </button>
    </div>
  );
}
