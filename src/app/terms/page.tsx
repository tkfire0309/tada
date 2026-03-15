"use client";

import { useState } from "react";

const tabs = [
  { id: "terms", label: "利用規約" },
  { id: "privacy", label: "プライバシーポリシー" },
] as const;

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      {/* タブ */}
      <div className="flex gap-1 bg-card-bg rounded-xl p-1 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-sm rounded-lg font-medium transition ${
              activeTab === tab.id
                ? "bg-background shadow-sm text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "terms" ? (
        <article className="space-y-6 text-sm leading-relaxed text-muted">
          <h1 className="text-2xl font-bold text-foreground">利用規約</h1>
          <p>最終更新日：2026年3月15日</p>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground">
              第1条（適用）
            </h2>
            <p>
              本規約は、tada（以下「本サービス」）の利用に関する条件を定めるものです。ユーザーは本規約に同意した上で本サービスを利用するものとします。
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground">
              第2条（サービス内容）
            </h2>
            <p>
              本サービスは、商品の過去の価格推移と中古相場を基に実質コストを算出し、ユーザーに情報を提供するサービスです。提供される情報は参考値であり、実際の取引価格を保証するものではありません。
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground">
              第3条（利用料金）
            </h2>
            <p>
              本サービスには無料プランと有料プラン（Pro）があります。有料プランの料金は料金ページに記載のとおりとし、Stripe
              を通じた月額課金制となります。
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground">
              第4条（禁止事項）
            </h2>
            <p>
              ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>本サービスの運営を妨害する行為</li>
              <li>不正アクセスまたはそれに類する行為</li>
              <li>本サービスの情報を無断で商用利用する行為</li>
              <li>その他、運営者が不適切と判断する行為</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground">
              第5条（免責事項）
            </h2>
            <p>
              本サービスが提供する価格情報および分析結果は、AIによる推定値であり、正確性・完全性を保証するものではありません。本サービスの利用により生じた損害について、運営者は一切の責任を負いません。
            </p>
          </section>
        </article>
      ) : (
        <article className="space-y-6 text-sm leading-relaxed text-muted">
          <h1 className="text-2xl font-bold text-foreground">
            プライバシーポリシー
          </h1>
          <p>最終更新日：2026年3月15日</p>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground">
              1. 収集する情報
            </h2>
            <p>本サービスでは、以下の情報を収集する場合があります。</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Google OAuth
                によるログイン時のメールアドレスおよびプロフィール情報
              </li>
              <li>検索クエリの内容</li>
              <li>利用状況に関する匿名の統計データ</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground">
              2. 情報の利用目的
            </h2>
            <p>収集した情報は、以下の目的で利用します。</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>サービスの提供および改善</li>
              <li>利用状況の分析</li>
              <li>カスタマーサポート</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground">
              3. 第三者への提供
            </h2>
            <p>
              法令に基づく場合を除き、ユーザーの個人情報を第三者に提供することはありません。
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground">
              4. お問い合わせ
            </h2>
            <p>
              プライバシーに関するお問い合わせは、お問い合わせページよりご連絡ください。
            </p>
          </section>
        </article>
      )}
    </div>
  );
}
