import type { FeedCardData } from "@/lib/types";

interface FeedCardProps {
  card: FeedCardData;
}

export default function FeedCard({ card }: FeedCardProps) {
  const isNegative = card.annualCostYen < 0;
  const costText = isNegative
    ? `+${Math.abs(card.annualCostYen).toLocaleString()}円/年`
    : `${card.annualCostYen.toLocaleString()}円/年`;

  return (
    <div className="flex-shrink-0 w-56 bg-card-bg border border-border rounded-xl p-4 hover:shadow-md hover:scale-[1.02] transition">
      <p className="text-sm font-medium truncate">{card.productName}</p>
      <p
        className={`text-lg font-bold mt-1 ${
          isNegative ? "text-green-600 dark:text-green-400" : "text-accent"
        }`}
      >
        実質 {costText}
      </p>
      <p className="text-xs text-muted mt-2">{card.userName}</p>
    </div>
  );
}
