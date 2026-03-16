const entries = [
  {
    version: "v0.0",
    date: "2026-03-15",
    title: "UI プロトタイプ公開",
    description:
      "ダミーデータによる UI プロトタイプを公開しました。検索フォーム、ストリーミング風表示、フィードカルーセル、各ページの基本レイアウトを確認できます。",
  },
  {
    version: "v0.1",
    date: "Coming soon",
    title: "MVP リリース（API 連携）",
    description:
      "Perplexity Sonar API と連携し、実際の価格データを取得・分析する機能を実装予定です。",
  },
  {
    version: "v0.2",
    date: "Coming soon",
    title: "認証・課金機能",
    description:
      "Google OAuth によるログインと Stripe による月額課金機能を追加予定です。",
  },
];

export default function ChangelogPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">更新情報</h1>

      <div className="space-y-8">
        {entries.map((entry) => (
          <article
            key={entry.version}
            className="border-l-2 border-border pl-6 relative"
          >
            <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-accent" />
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono bg-card-bg border border-border px-2 py-0.5 rounded-md">
                {entry.version}
              </span>
              <span className="text-xs text-muted">{entry.date}</span>
            </div>
            <h2 className="text-base font-bold">{entry.title}</h2>
            <p className="mt-1 text-sm text-muted leading-relaxed">
              {entry.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
