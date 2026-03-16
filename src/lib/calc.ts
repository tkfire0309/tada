import type { DepreciationPoint, CostEstimate } from "./types";

/**
 * depreciationTimeline のデータポイント間を線形補間して、
 * 任意の年数での推定買取価格を算出する。
 */
export function interpolateBuyback(
  timeline: DepreciationPoint[],
  retailPriceYen: number,
  targetYears: number
): number {
  if (timeline.length === 0) return 0;

  // 年数でソート
  const sorted = [...timeline].sort(
    (a, b) => a.yearsFromPurchase - b.yearsFromPurchase
  );

  // 0年目（購入時）のデータポイントがなければ追加
  if (sorted[0].yearsFromPurchase > 0) {
    sorted.unshift({
      yearsFromPurchase: 0,
      buybackPriceYen: retailPriceYen,
      retentionRate: 100,
      source: "actual",
    });
  }

  // ちょうど一致するデータポイントがあればそのまま返す
  const exact = sorted.find((p) => p.yearsFromPurchase === targetYears);
  if (exact) return exact.buybackPriceYen;

  // targetYears が最小値より小さい場合
  if (targetYears < sorted[0].yearsFromPurchase) {
    return sorted[0].buybackPriceYen;
  }

  // targetYears が最大値より大きい場合 → 最後の2点から外挿
  if (targetYears > sorted[sorted.length - 1].yearsFromPurchase) {
    if (sorted.length >= 2) {
      const a = sorted[sorted.length - 2];
      const b = sorted[sorted.length - 1];
      const slope =
        (b.buybackPriceYen - a.buybackPriceYen) /
        (b.yearsFromPurchase - a.yearsFromPurchase);
      const extrapolated = Math.round(
        b.buybackPriceYen + slope * (targetYears - b.yearsFromPurchase)
      );
      return Math.max(0, extrapolated);
    }
    return sorted[sorted.length - 1].buybackPriceYen;
  }

  // 2点間の線形補間
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (
      targetYears >= a.yearsFromPurchase &&
      targetYears <= b.yearsFromPurchase
    ) {
      const ratio =
        (targetYears - a.yearsFromPurchase) /
        (b.yearsFromPurchase - a.yearsFromPurchase);
      return Math.round(
        a.buybackPriceYen + ratio * (b.buybackPriceYen - a.buybackPriceYen)
      );
    }
  }

  return sorted[sorted.length - 1].buybackPriceYen;
}

/**
 * 実質コスト・年間コストを算出する。
 */
export function calcActualCost(
  purchasePrice: number,
  estimatedBuybackPrice: number,
  years: number
): CostEstimate {
  const actualCostYen = purchasePrice - estimatedBuybackPrice;
  const annualCostYen = years > 0 ? Math.round(actualCostYen / years) : 0;
  const retentionRate =
    purchasePrice > 0
      ? Math.round((estimatedBuybackPrice / purchasePrice) * 1000) / 10
      : 0;

  return {
    estimatedBuybackPriceYen: estimatedBuybackPrice,
    actualCostYen,
    annualCostYen,
    retentionRate,
  };
}
