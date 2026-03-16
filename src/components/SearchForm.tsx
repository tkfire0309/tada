"use client";

import { useState, useRef, useEffect } from "react";
import { suggestItems } from "@/lib/mock-data";

interface SearchFormProps {
  onSearch: (productName: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [productName, setProductName] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = suggestItems.filter((item) =>
    item.label.toLowerCase().includes(productName.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggest(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productName.trim()) return;
    setShowSuggest(false);
    onSearch(productName.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <div className="bg-card-bg border border-border rounded-2xl p-6 shadow-sm space-y-4">
        {/* 商品名 */}
        <div ref={wrapperRef} className="relative">
          <label className="block text-xs text-muted mb-1.5">商品名</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => {
              setProductName(e.target.value);
              setShowSuggest(e.target.value.length > 0);
            }}
            onFocus={() => {
              if (productName.length > 0) setShowSuggest(true);
            }}
            placeholder="カメラ名を入力（例: Leica M11, Sony α7 IV）"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
          />
          {/* サジェスト */}
          {showSuggest && filtered.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-background border border-border rounded-xl shadow-lg overflow-hidden">
              {filtered.slice(0, 5).map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="w-full text-left px-4 py-2.5 hover:bg-card-bg transition flex justify-between items-center"
                  onClick={() => {
                    setProductName(item.label);
                    setShowSuggest(false);
                  }}
                >
                  <span className="text-sm">{item.label}</span>
                  <span className="text-xs text-muted">{item.category}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={isLoading || !productName.trim()}
          className="w-full py-3 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading ? "調査中..." : "調べる"}
        </button>
      </div>
    </form>
  );
}
