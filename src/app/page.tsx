"use client";

import { useState, useCallback } from "react";
import SearchForm from "@/components/SearchForm";
import ResultStream from "@/components/ResultStream";
import FeedCarousel from "@/components/FeedCarousel";
import FaqAccordion from "@/components/FaqAccordion";
import Link from "next/link";
import { faqItems } from "@/lib/mock-data";

export default function Home() {
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  function handleSearch(_productName: string) {
    setIsSearching(true);
    setHasSearched(true);
  }

  const handleComplete = useCallback(() => {
    setIsSearching(false);
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

        <ResultStream isActive={hasSearched} onComplete={handleComplete} />
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
