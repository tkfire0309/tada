"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/types";

interface FaqAccordionProps {
  items: FaqItem[];
  showCategoryHeaders?: boolean;
}

export default function FaqAccordion({
  items,
  showCategoryHeaders = false,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categoryLabels: Record<string, string> = {
    service: "サービスについて",
    pricing: "料金・お支払いについて",
    other: "その他",
  };

  // カテゴリ別にグルーピング
  const grouped = showCategoryHeaders
    ? (["service", "pricing", "other"] as const).map((cat) => ({
        category: cat,
        label: categoryLabels[cat],
        items: items.filter((item) => item.category === cat),
      }))
    : [{ category: "all" as const, label: "", items }];

  let globalIndex = 0;

  return (
    <div className="space-y-6">
      {grouped.map((group) => {
        if (group.items.length === 0) return null;
        return (
          <div key={group.category}>
            {showCategoryHeaders && group.label && (
              <h3 className="text-sm font-bold text-muted mb-3">
                {group.label}
              </h3>
            )}
            <div className="space-y-2">
              {group.items.map((item) => {
                const idx = globalIndex++;
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-border rounded-xl overflow-hidden"
                  >
                    <button
                      className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-card-bg transition"
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                    >
                      <span className="text-sm font-medium pr-4">
                        {item.question}
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className={`flex-shrink-0 text-muted transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-sm text-muted leading-relaxed">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
