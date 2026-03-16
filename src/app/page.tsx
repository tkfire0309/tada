"use client";

import { useState, useCallback } from "react";
import SearchForm from "@/components/SearchForm";
import ResultStream from "@/components/ResultStream";
import FeedCarousel from "@/components/FeedCarousel";
import FaqAccordion from "@/components/FaqAccordion";
import Link from "next/link";
import { faqItems } from "@/lib/mock-data";
import type { AnalysisBaseData } from "@/lib/types";

export default function Home() {
  const [isSearching, setIsSearching] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisBaseData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(productName: string) {
    setIsSearching(true);
    setError(null);
    setAnalysisData(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `API error: ${res.status}`);
      }

      const data: AnalysisBaseData = await res.json();
      setAnalysisData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "分析中にエラーが発生しました"
      );
    } finally {
      setIsSearching(false);
    }
  }

  const handleReset = useCallback(() => {
    setAnalysisData(null);
    setError(null);
  }, []);

  const topFaq = faqItems.slice(0, 3);

  return (
    <div>
      {/* Hero + 検索 */}
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            本当の値段、
            <br className="md:hidden" />
            知ってる？
          </h1>
          <p className="mt-4 text-muted text-sm md:text-base max-w-md mx-auto">
            商品名を入れるだけ。過去の事実から、
            <br className="hidden md:inline" />
            あなたの買い物の「実質コスト」を明らかにします。
          </p>
        </div>

        <div className="mt-10">
          <SearchForm onSearch={handleSearch} isLoading={isSearching} />
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="w-full max-w-lg mx-auto mt-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={handleReset}
                className="mt-3 text-xs text-muted hover:text-foreground transition underline underline-offset-2"
              >
                もう一度試す
              </button>
            </div>
          </div>
        )}

        {/* 分析中のローディング */}
        {isSearching && (
          <div className="w-full max-w-lg mx-auto mt-6">
            <div className="bg-card-bg border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted">
                  買取価格データを調査中...
                </span>
              </div>
              <p className="text-xs text-muted mt-3">
                マップカメラ・キタムラ等の買取価格を検索しています。10〜20秒ほどかかります。
              </p>
            </div>
          </div>
        )}

        {/* 結果表示 */}
        {analysisData && !isSearching && (
          <ResultStream data={analysisData} />
        )}
      </section>

      {/* フィードカルーセル */}
      <FeedCarousel />

      {/* FAQ セクション */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-6">よくある質問</h2>
          <FaqAccordion items={topFaq} />
          <div className="mt-6 text-center">
            <Link
              href="/faq"
              className="text-sm text-muted hover:text-foreground transition"
            >
              その他のよくある質問 &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold">
            本当の値段を
            <br />
            調べてみよう
          </h2>
          <p className="mt-3 text-sm text-muted">
            あなたの次の買い物、実質いくらになるか知っていますか？
          </p>
          <button className="mt-6 bg-foreground text-background px-8 py-3 rounded-full text-sm font-medium hover:opacity-90 transition">
            無料ではじめる
          </button>
        </div>
      </section>
    </div>
  );
}
