"use client";

import { useState, useEffect, useCallback } from "react";
import { mockStreamTexts } from "@/lib/mock-data";

interface ResultStreamProps {
  isActive: boolean;
  onComplete: () => void;
}

export default function ResultStream({
  isActive,
  onComplete,
}: ResultStreamProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [phase, setPhase] = useState<"idle" | "fact" | "suggestion" | "trend" | "done">("idle");

  const streamText = useCallback(
    (text: string): Promise<void> => {
      return new Promise((resolve) => {
        let i = 0;
        const interval = setInterval(() => {
          if (i < text.length) {
            setDisplayedText((prev) => prev + text[i]);
            i++;
          } else {
            clearInterval(interval);
            resolve();
          }
        }, 15);
      });
    },
    []
  );

  useEffect(() => {
    if (!isActive) return;

    let cancelled = false;

    async function run() {
      setDisplayedText("");
      setPhase("fact");
      await streamText(mockStreamTexts.fact);
      if (cancelled) return;

      setDisplayedText((prev) => prev + "\n\n");
      setPhase("suggestion");
      await streamText(mockStreamTexts.suggestion);
      if (cancelled) return;

      setDisplayedText((prev) => prev + "\n\n");
      setPhase("trend");
      await streamText(mockStreamTexts.trend);
      if (cancelled) return;

      setPhase("done");
      onComplete();
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [isActive, streamText, onComplete]);

  if (phase === "idle") return null;

  return (
    <div className="w-full max-w-lg mx-auto mt-6">
      <div className="bg-card-bg border border-border rounded-2xl p-6 shadow-sm">
        {/* プログレスインジケーター */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">
            <div
              className={`w-2 h-2 rounded-full transition ${
                phase === "fact"
                  ? "bg-accent animate-pulse"
                  : "bg-accent"
              }`}
            />
            <div
              className={`w-2 h-2 rounded-full transition ${
                phase === "suggestion"
                  ? "bg-accent animate-pulse"
                  : phase === "trend" || phase === "done"
                  ? "bg-accent"
                  : "bg-border"
              }`}
            />
            <div
              className={`w-2 h-2 rounded-full transition ${
                phase === "trend"
                  ? "bg-accent animate-pulse"
                  : phase === "done"
                  ? "bg-accent"
                  : "bg-border"
              }`}
            />
          </div>
          <span className="text-xs text-muted">
            {phase === "fact" && "過去の事実を分析中..."}
            {phase === "suggestion" && "未来の示唆を生成中..."}
            {phase === "trend" && "ブランド傾向を比較中..."}
            {phase === "done" && "分析完了"}
          </span>
        </div>

        {/* テキスト表示 */}
        <div className="prose prose-sm max-w-none text-foreground">
          {displayedText.split("\n").map((line, i) => {
            if (line.startsWith("## ")) {
              return (
                <h2
                  key={i}
                  className="text-lg font-bold mt-4 mb-2 first:mt-0"
                >
                  {line.replace("## ", "")}
                </h2>
              );
            }
            if (line.startsWith("| ")) {
              return (
                <div key={i} className="text-xs font-mono text-muted">
                  {line}
                </div>
              );
            }
            if (line.startsWith("- ")) {
              return (
                <div key={i} className="ml-2 text-sm">
                  {renderBold(line)}
                </div>
              );
            }
            if (line.trim() === "") {
              return <div key={i} className="h-2" />;
            }
            return (
              <p key={i} className="text-sm leading-relaxed">
                {renderBold(line)}
              </p>
            );
          })}
          {phase !== "done" && (
            <span className="inline-block w-0.5 h-4 bg-foreground animate-pulse ml-0.5" />
          )}
        </div>
      </div>
    </div>
  );
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-accent">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
