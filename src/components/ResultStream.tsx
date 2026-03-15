"use client";

import { useState, useEffect, useMemo } from "react";
import {
  mockBaseData,
  mockStreamSteps,
  relatedProducts,
  calcEstimate,
} from "@/lib/mock-data";

interface ResultStreamProps {
  isActive: boolean;
  onComplete: () => void;
}

export default function ResultStream({
  isActive,
  onComplete,
}: ResultStreamProps) {
  const [phase, setPhase] = useState<"idle" | "analyzing" | "done">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState<string[]>([]);

  // === 年数スライダー ===
  const [years, setYears] = useState(5);

  // === 価格編集 ===
  const [isEditing, setIsEditing] = useState(false);
  const [customPurchasePrice, setCustomPurchasePrice] = useState<number | null>(null);
  const [customSalePrice, setCustomSalePrice] = useState<number | null>(null);

  const data = mockBaseData;

  // AI算出値
  const aiEstimate = useMemo(
    () => calcEstimate(data.currentPriceYen, data.annualDepreciationRate, years),
    [data.currentPriceYen, data.annualDepreciationRate, years]
  );

  // 表示用の値（ユーザー編集 or AI算出）
  const purchasePrice = customPurchasePrice ?? data.currentPriceYen;
  const salePrice = customSalePrice ?? aiEstimate.estimatedSalePrice;
  const actualCost = purchasePrice - salePrice;
  const annualCost = years > 0 ? Math.round(actualCost / years) : 0;
  const isCustomized = customPurchasePrice !== null || customSalePrice !== null;

  function resetToAI() {
    setCustomPurchasePrice(null);
    setCustomSalePrice(null);
    setIsEditing(false);
  }

  // 分析アニメーション
  useEffect(() => {
    if (!isActive || phase !== "idle") return;

    setPhase("analyzing");
    setCurrentStep(0);
    setVisibleSteps([]);

    let step = 0;
    const interval = setInterval(() => {
      if (step < mockStreamSteps.length) {
        setVisibleSteps((prev) => [...prev, mockStreamSteps[step]]);
        setCurrentStep(step + 1);
        step++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setPhase("done");
          onComplete();
        }, 600);
      }
    }, 800);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  if (phase === "idle") return null;

  const prev = data.previousModel;
  const prevActualCost = prev.releasePriceYen - prev.currentBuybackPriceYen;
  const prevAnnualCost = Math.round(prevActualCost / prev.yearsElapsed);

  // === 分析中の表示 ===
  if (phase === "analyzing") {
    return (
      <div className="w-full max-w-lg mx-auto mt-6">
        <div className="bg-card-bg border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted">
              分析中... ({currentStep}/{mockStreamSteps.length})
            </span>
          </div>
          <div className="space-y-2">
            {visibleSteps.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-2 animate-[fadeIn_0.3s_ease-out]"
              >
                <span className="text-accent mt-0.5 text-xs">&#10003;</span>
                <span className="text-xs text-muted">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // === 分析完了：結論ファースト ===
  return (
    <div className="w-full max-w-lg mx-auto mt-6 space-y-4">
      {/* メインカード */}
      <div className="bg-card-bg border border-border rounded-2xl p-8 shadow-sm">
        {/* ヘッダー: 商品名 + 編集ボタン */}
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-muted">
            {years}年後に売却した場合
          </p>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-[10px] text-muted hover:text-foreground transition px-2 py-1 rounded-lg hover:bg-background"
          >
            {isEditing ? "完了" : "価格を編集"}
          </button>
        </div>
        <h2 className="text-xl font-bold mb-4 text-center">
          {data.productName}
        </h2>

        {/* メイン数字 */}
        <div className="mb-5 text-center">
          <p className="text-xs text-muted mb-1">実質コスト</p>
          <p className="text-4xl font-bold text-accent tracking-tight">
            ¥{actualCost.toLocaleString()}
          </p>
          {isCustomized && (
            <button
              onClick={resetToAI}
              className="mt-2 text-[10px] text-muted hover:text-foreground transition underline underline-offset-2"
            >
              AIの算出結果に戻す
            </button>
          )}
        </div>

        {/* サマリー3列 — 編集モード対応 */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-[10px] text-muted mb-0.5">購入価格</p>
            {isEditing ? (
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setCustomPurchasePrice(Number(e.target.value))}
                className="w-full text-sm font-semibold text-center bg-background border border-border rounded-lg px-1 py-1 focus:outline-none focus:ring-1 focus:ring-accent/40"
              />
            ) : (
              <p className="text-sm font-semibold">
                ¥{purchasePrice.toLocaleString()}
              </p>
            )}
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted mb-0.5">推定売却価格</p>
            {isEditing ? (
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setCustomSalePrice(Number(e.target.value))}
                className="w-full text-sm font-semibold text-center bg-background border border-border rounded-lg px-1 py-1 focus:outline-none focus:ring-1 focus:ring-accent/40"
              />
            ) : (
              <p className="text-sm font-semibold">
                ¥{salePrice.toLocaleString()}
              </p>
            )}
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted mb-0.5">年間コスト</p>
            <p className="text-sm font-semibold text-accent">
              ¥{annualCost.toLocaleString()}
              <span className="text-[10px] text-muted font-normal">/年</span>
            </p>
          </div>
        </div>

        {/* 年数スライダー */}
        <div className="mt-5 pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-muted">売却予定年数</p>
            <p className="text-sm font-semibold">{years}年</p>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            value={years}
            onChange={(e) => {
              setYears(Number(e.target.value));
              // 年数変更時はカスタム売却価格をリセット（購入価格は保持）
              setCustomSalePrice(null);
            }}
            className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-accent"
          />
          <div className="flex justify-between text-[10px] text-muted mt-1">
            <span>1年</span>
            <span>10年</span>
            <span>20年</span>
          </div>
        </div>
      </div>

      {/* 根拠カード */}
      <div className="bg-card-bg border border-border rounded-2xl p-5 shadow-sm">
        <p className="text-xs font-medium text-muted mb-3">
          根拠：前世代モデルの買取実績
        </p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold">{prev.modelName}</span>
          <span className="text-xs text-muted">{prev.releaseYear}年発売</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-1000"
              style={{ width: `${prev.retentionRate}%` }}
            />
          </div>
          <span className="text-xs font-medium text-accent">
            {prev.retentionRate}%保持
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-background rounded-lg p-2.5">
            <p className="text-muted mb-0.5">発売時価格</p>
            <p className="font-semibold">
              ¥{prev.releasePriceYen.toLocaleString()}
            </p>
          </div>
          <div className="bg-background rounded-lg p-2.5">
            <p className="text-muted mb-0.5">
              {prev.yearsElapsed}年後の買取相場
            </p>
            <p className="font-semibold">
              ¥{prev.currentBuybackPriceYen.toLocaleString()}
            </p>
          </div>
        </div>

        <p className="text-xs text-muted mt-3 leading-relaxed">
          {prev.modelName} は{prev.yearsElapsed}年間で実質
          <span className="font-medium text-foreground">
            ¥{prevActualCost.toLocaleString()}
          </span>
          （年間 ¥{prevAnnualCost.toLocaleString()}
          ）で使えた計算になります。この買取実績をもとに{" "}
          {data.productName} の実質コストを推定しています。
        </p>

        {/* ソースリンク */}
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-[10px] text-muted mb-1.5">参考情報</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {data.citations.map((cite, i) => (
              <a
                key={i}
                href={cite.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-muted hover:text-foreground transition underline underline-offset-2"
              >
                {cite.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 関連商品カード */}
      <div>
        <p className="text-xs font-medium text-muted mb-2 px-1">
          同カテゴリの実質コスト
        </p>
        <div className="grid grid-cols-3 gap-2">
          {relatedProducts.map((p) => (
            <div
              key={p.productName}
              className="bg-card-bg border border-border rounded-xl p-3 text-center hover:shadow-sm transition"
            >
              <p className="text-xs font-medium truncate">{p.productName}</p>
              <p className="text-sm font-bold text-accent mt-1">
                ¥{p.annualCostYen.toLocaleString()}
                <span className="text-[10px] text-muted font-normal">
                  /年
                </span>
              </p>
              <p className="text-[10px] text-muted mt-0.5">{p.category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
