"use client";

import { useState, useMemo } from "react";
import type { AnalysisBaseData } from "@/lib/types";
import { interpolateBuyback, calcActualCost } from "@/lib/calc";

interface ResultStreamProps {
  data: AnalysisBaseData;
}

export default function ResultStream({ data }: ResultStreamProps) {
  // === 年数スライダー ===
  const [years, setYears] = useState(5);

  // === 価格編集 ===
  const [isEditing, setIsEditing] = useState(false);
  const [customPurchasePrice, setCustomPurchasePrice] = useState<number | null>(
    null
  );
  const [customSalePrice, setCustomSalePrice] = useState<number | null>(null);

  // AI算出値（timeline ベースの補間）
  const aiEstimatedBuyback = useMemo(
    () =>
      interpolateBuyback(
        data.depreciationTimeline,
        data.currentModel.retailPriceYen,
        years
      ),
    [data.depreciationTimeline, data.currentModel.retailPriceYen, years]
  );

  // 表示用の値（ユーザー編集 or AI算出）
  const purchasePrice = customPurchasePrice ?? data.currentModel.retailPriceYen;
  const salePrice = customSalePrice ?? aiEstimatedBuyback;
  const costEstimate = useMemo(
    () => calcActualCost(purchasePrice, salePrice, years),
    [purchasePrice, salePrice, years]
  );
  const isCustomized =
    customPurchasePrice !== null || customSalePrice !== null;

  function resetToAI() {
    setCustomPurchasePrice(null);
    setCustomSalePrice(null);
    setIsEditing(false);
  }

  const prev = data.previousModel;
  // retentionRate を正規化（0〜1 で来た場合は 100 倍して % にする）
  const prevRetentionRate = prev
    ? prev.retentionRate <= 1 && prev.retentionRate > 0
      ? Math.round(prev.retentionRate * 1000) / 10
      : Math.round(prev.retentionRate * 10) / 10
    : 0;
  const prevActualCost = prev
    ? prev.retailPriceYen - prev.currentBuybackPriceYen
    : 0;

  return (
    <div className="w-full max-w-lg mx-auto mt-6 space-y-4">
      {/* メインカード */}
      <div className="bg-card-bg border border-border rounded-2xl p-8 shadow-sm">
        {/* ヘッダー: 商品名 + 編集ボタン */}
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-muted">{years}年後に売却した場合</p>
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
            ¥{costEstimate.actualCostYen.toLocaleString()}
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
                onChange={(e) =>
                  setCustomPurchasePrice(Number(e.target.value))
                }
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
              ¥{costEstimate.annualCostYen.toLocaleString()}
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

        {/* データ信頼度 */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-[10px] text-muted">データ信頼度</span>
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
              data.dataConfidence === "high"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : data.dataConfidence === "medium"
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {data.dataConfidence === "high"
              ? "高"
              : data.dataConfidence === "medium"
                ? "中"
                : "低"}
          </span>
        </div>
      </div>

      {/* 市場特記事項 */}
      {data.marketNotes && (
        <div className="bg-card-bg border border-border rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-medium text-muted mb-1">市場メモ</p>
          <p className="text-xs text-foreground/80">{data.marketNotes}</p>
        </div>
      )}

      {/* 根拠カード群 */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted px-1">根拠</p>

        {/* カード1: 現行モデルの市場価格 */}
        <div className="bg-card-bg border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold">
              {data.currentModel.name}
            </span>
            <span className="text-[10px] text-muted bg-background px-2 py-0.5 rounded-md">
              現行モデル
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="bg-background rounded-lg p-2.5">
              <p className="text-muted mb-0.5">発売年</p>
              <p className="font-semibold">{data.currentModel.releaseYear}年</p>
            </div>
            <div className="bg-background rounded-lg p-2.5">
              <p className="text-muted mb-0.5">販売価格</p>
              <p className="font-semibold">
                ¥{data.currentModel.retailPriceYen.toLocaleString()}
              </p>
            </div>
            <div className="bg-background rounded-lg p-2.5">
              <p className="text-muted mb-0.5">買取相場</p>
              <p className="font-semibold">
                ¥{data.currentModel.currentBuybackPriceYen.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* カード2: 前世代モデルの実績 */}
        {prev && (
          <div className="bg-card-bg border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">{prev.name}</span>
              <span className="text-[10px] text-muted bg-background px-2 py-0.5 rounded-md">
                前世代モデル
              </span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(prevRetentionRate, 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-accent">
                {prevRetentionRate}%保持
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-background rounded-lg p-2.5">
                <p className="text-muted mb-0.5">発売時価格</p>
                <p className="font-semibold">
                  ¥{prev.retailPriceYen.toLocaleString()}
                </p>
              </div>
              <div className="bg-background rounded-lg p-2.5">
                <p className="text-muted mb-0.5">
                  {prev.yearsElapsed}年後の買取
                </p>
                <p className="font-semibold">
                  ¥{prev.currentBuybackPriceYen.toLocaleString()}
                </p>
              </div>
              <div className="bg-background rounded-lg p-2.5">
                <p className="text-muted mb-0.5">実質コスト</p>
                <p className="font-semibold">
                  ¥{prevActualCost.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ソースリンク */}
        {data.citations.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 px-1">
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
        )}
      </div>

      {/* 関連商品カード */}
      {data.relatedProducts.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted mb-2 px-1">
            同カテゴリの比較
          </p>
          <div className="grid grid-cols-3 gap-2">
            {data.relatedProducts.map((p) => {
              const relCost = p.retailPriceYen - p.buybackPriceYen;
              return (
                <div
                  key={p.name}
                  className="bg-card-bg border border-border rounded-xl p-3 text-center hover:shadow-sm transition"
                >
                  <p className="text-xs font-medium truncate">{p.name}</p>
                  <p className="text-[10px] text-muted mt-0.5">
                    ¥{p.retailPriceYen.toLocaleString()}
                  </p>
                  <p className="text-xs font-semibold text-accent mt-1">
                    買取 ¥{p.buybackPriceYen.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted mt-0.5">
                    差額 ¥{relCost.toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
