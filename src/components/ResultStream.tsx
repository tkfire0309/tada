"use client";

import { useState, useEffect, useCallback } from "react";
import {
  mockAnalysisResult,
  mockStreamSteps,
  relatedProducts,
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

  const runAnalysis = useCallback(() => {
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
        // 少し間を置いて結論表示に切り替え
        setTimeout(() => {
          setPhase("done");
          onComplete();
        }, 600);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (!isActive || phase !== "idle") return;
    const cleanup = runAnalysis();
    return cleanup;
  }, [isActive, phase, runAnalysis]);

  if (phase === "idle") return null;

  const result = mockAnalysisResult;
  const { futureSuggestion, previousModel } = result;

  // === 分析中の表示 ===
  if (phase === "analyzing") {
    return (
      <div className="w-full max-w-lg mx-auto mt-6">
        <div className="bg-card-bg border border-border rounded-2xl p-6 shadow-sm">
          {/* プログレス */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted">
              分析中... ({currentStep}/{mockStreamSteps.length})
            </span>
          </div>

          {/* ステップログ */}
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

  // === 分析完了：結論ファーストの表示 ===
  return (
    <div className="w-full max-w-lg mx-auto mt-6 space-y-4">
      {/* メインカード：結論ドカン */}
      <div className="bg-card-bg border border-border rounded-2xl p-8 shadow-sm text-center">
        <p className="text-xs text-muted mb-1">
          {futureSuggestion.yearsToSell}年後に売却した場合
        </p>
        <h2 className="text-xl font-bold mb-4">
          {futureSuggestion.currentModelName}
        </h2>

        {/* メイン数字 */}
        <div className="mb-6">
          <p className="text-xs text-muted mb-1">実質コスト</p>
          <p className="text-4xl font-bold text-accent tracking-tight">
            ¥{futureSuggestion.estimatedActualCostYen.toLocaleString()}
          </p>
        </div>

        {/* サマリー3列 */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
          <div>
            <p className="text-[10px] text-muted mb-0.5">購入価格</p>
            <p className="text-sm font-semibold">
              ¥{futureSuggestion.currentPriceYen.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted mb-0.5">推定売却価格</p>
            <p className="text-sm font-semibold">
              ¥{futureSuggestion.estimatedUsedPriceYen.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted mb-0.5">年間コスト</p>
            <p className="text-sm font-semibold text-accent">
              ¥{futureSuggestion.estimatedAnnualCostYen.toLocaleString()}
              <span className="text-[10px] text-muted font-normal">/年</span>
            </p>
          </div>
        </div>
      </div>

      {/* 根拠カード：前モデルの事実 */}
      <div className="bg-card-bg border border-border rounded-2xl p-5 shadow-sm">
        <p className="text-xs font-medium text-muted mb-3">
          根拠：前世代モデルの実績
        </p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold">
            {previousModel.modelName}
          </span>
          <span className="text-xs text-muted">
            {previousModel.releaseYear}年発売
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          {/* ビジュアルバー */}
          <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-1000"
              style={{ width: `${previousModel.retentionRate}%` }}
            />
          </div>
          <span className="text-xs font-medium text-accent">
            {previousModel.retentionRate}%保持
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-background rounded-lg p-2.5">
            <p className="text-muted mb-0.5">発売時価格</p>
            <p className="font-semibold">
              ¥{previousModel.releasePriceYen.toLocaleString()}
            </p>
          </div>
          <div className="bg-background rounded-lg p-2.5">
            <p className="text-muted mb-0.5">
              {previousModel.yearsElapsed}年後の中古相場
            </p>
            <p className="font-semibold">
              ¥{previousModel.currentUsedPriceYen.toLocaleString()}
            </p>
          </div>
        </div>

        <p className="text-xs text-muted mt-3 leading-relaxed">
          {previousModel.modelName} は{previousModel.yearsElapsed}
          年間で実質
          <span className="font-medium text-foreground">
            ¥{previousModel.actualCostYen.toLocaleString()}
          </span>
          （年間 ¥{previousModel.annualCostYen.toLocaleString()}
          ）で使えた計算になります。この傾向をもとに{" "}
          {futureSuggestion.currentModelName} の実質コストを推定しています。
        </p>
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
