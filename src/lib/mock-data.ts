import type {
  AnalysisResult,
  AnalysisBaseData,
  FeedCardData,
  SuggestItem,
  FaqItem,
  PricingPlan,
} from "./types";

// === サジェスト候補 ===
export const suggestItems: SuggestItem[] = [
  { label: "iPhone 16 Pro", category: "スマートフォン" },
  { label: "Leica M11", category: "カメラ" },
  { label: "MacBook Pro 14インチ", category: "PC" },
  { label: "トヨタ GR86", category: "車" },
  { label: "Sony α7 IV", category: "カメラ" },
  { label: "iPad Pro 13インチ", category: "タブレット" },
  { label: "ロレックス サブマリーナ", category: "時計" },
  { label: "Canon EOS R5", category: "カメラ" },
  { label: "Tesla Model 3", category: "車" },
  { label: "AirPods Pro 2", category: "オーディオ" },
];

// === ダミー検索結果（Leica M11 を例に） ===
export const mockAnalysisResult: AnalysisResult = {
  input: {
    productName: "Leica M11",
    yearsToSell: 5,
  },
  previousModel: {
    modelName: "Leica M10",
    releaseYear: 2017,
    releasePriceYen: 1000000,
    currentUsedPriceYen: 800000,
    yearsElapsed: 8,
    actualCostYen: 200000,
    annualCostYen: 25000,
    retentionRate: 80,
  },
  futureSuggestion: {
    currentModelName: "Leica M11",
    currentPriceYen: 1280000,
    yearsToSell: 5,
    estimatedUsedPriceYen: 1020000,
    estimatedActualCostYen: 260000,
    estimatedAnnualCostYen: 52000,
  },
  brandTrends: [
    {
      brandName: "Leica",
      category: "カメラ",
      averageRetentionRate: 80,
      trend: "high",
    },
    {
      brandName: "Sony",
      category: "カメラ",
      averageRetentionRate: 55,
      trend: "medium",
    },
    {
      brandName: "Canon",
      category: "カメラ",
      averageRetentionRate: 50,
      trend: "medium",
    },
  ],
  citations: [
    "https://kakaku.com/",
    "https://www.mercari.com/",
    "https://www.yahoo-auction.jp/",
  ],
};

// === 年数非依存の基礎データ（v0.1 で API から返ってくる想定の構造） ===
export const mockBaseData: AnalysisBaseData = {
  productName: "Leica M11",
  currentPriceYen: 1280000,
  annualDepreciationRate: 0.0275, // 年間2.75%減価（M10の実績: 8年で20%減 → 年2.5%を少し上方修正）
  previousModel: {
    modelName: "Leica M10",
    releaseYear: 2017,
    releasePriceYen: 1000000,
    currentBuybackPriceYen: 750000, // 買取価格（中古販売相場80万円からショップマージンを引いた額）
    yearsElapsed: 8,
    retentionRate: 75, // 買取ベースの価値保持率
  },
  citations: [
    { title: "カメラのキタムラ 買取価格表", url: "https://www.kitamura.jp/service/sell/" },
    { title: "マップカメラ 買取見積", url: "https://www.mapcamera.com/sell" },
    { title: "フジヤカメラ 買取相場", url: "https://www.fujiya-camera.co.jp/" },
  ],
};

// === クライアント側の計算関数 ===
export function calcEstimate(
  purchasePrice: number,
  annualDepreciationRate: number,
  years: number
): { estimatedSalePrice: number; actualCost: number; annualCost: number } {
  const estimatedSalePrice = Math.round(
    purchasePrice * Math.pow(1 - annualDepreciationRate, years)
  );
  const actualCost = purchasePrice - estimatedSalePrice;
  const annualCost = years > 0 ? Math.round(actualCost / years) : 0;
  return { estimatedSalePrice, actualCost, annualCost };
}

// === ストリーミング中の分析ステップ（過程を見せる用） ===
export const mockStreamSteps = [
  "前世代モデルの情報を検索しています...",
  "Leica M10 の発売時価格を取得 — 100万円（2017年）",
  "買取相場を調査しています...",
  "Leica M10 の買取相場を取得 — 約75万円",
  "価値保持率を計算しています...",
  "Leica M11 の実質コストを推定しています...",
];

// === 関連商品カード（結果画面下部に表示） ===
export const relatedProducts = [
  { productName: "Sony α7 IV", annualCostYen: 45000, category: "カメラ" },
  { productName: "Canon EOS R5", annualCostYen: 52000, category: "カメラ" },
  { productName: "Nikon Z8", annualCostYen: 48000, category: "カメラ" },
];

// === フィードカード ===
export const feedCards: FeedCardData[] = [
  {
    id: "1",
    productName: "iPhone 15 Pro",
    annualCostYen: 32000,
    userName: "ユーザーA",
    searchedAt: "2026-03-15T10:30:00Z",
  },
  {
    id: "2",
    productName: "MacBook Air M2",
    annualCostYen: 28000,
    userName: "ユーザーB",
    searchedAt: "2026-03-15T09:15:00Z",
  },
  {
    id: "3",
    productName: "ロレックス デイトナ",
    annualCostYen: -50000,
    userName: "ユーザーC",
    searchedAt: "2026-03-14T22:00:00Z",
  },
  {
    id: "4",
    productName: "トヨタ ランドクルーザー",
    annualCostYen: 120000,
    userName: "ユーザーD",
    searchedAt: "2026-03-14T18:45:00Z",
  },
  {
    id: "5",
    productName: "Sony α7C II",
    annualCostYen: 45000,
    userName: "ユーザーE",
    searchedAt: "2026-03-14T15:30:00Z",
  },
  {
    id: "6",
    productName: "iPad Pro M4",
    annualCostYen: 22000,
    userName: "ユーザーF",
    searchedAt: "2026-03-14T12:00:00Z",
  },
  {
    id: "7",
    productName: "ポルシェ 911",
    annualCostYen: 350000,
    userName: "ユーザーG",
    searchedAt: "2026-03-13T20:00:00Z",
  },
  {
    id: "8",
    productName: "AirPods Max",
    annualCostYen: 18000,
    userName: "ユーザーH",
    searchedAt: "2026-03-13T16:30:00Z",
  },
];

// === FAQ ===
export const faqItems: FaqItem[] = [
  {
    question: "tada とはどんなサービスですか？",
    answer:
      "tada は商品名を入力するだけで「本当の値段（実質コスト）」がわかるサービスです。前世代モデルの発売時価格と現在の中古相場を比較し、実際にいくらで使えたのかを事実として提示します。",
    category: "service",
  },
  {
    question: "どんな商品を調べられますか？",
    answer:
      "カメラ、スマートフォン、PC、車、時計など、中古市場が存在するあらゆる商品を調べることができます。特にリセールバリューが高い商品カテゴリで威力を発揮します。",
    category: "service",
  },
  {
    question: "表示される価格情報は正確ですか？",
    answer:
      "Web上の複数の情報源（価格.com、メルカリ、ヤフオク等）をAIが横断検索し、総合的な相場を算出しています。あくまで参考値としてご利用ください。",
    category: "service",
  },
  {
    question: "無料プランと Pro プランの違いは何ですか？",
    answer:
      "無料プランは1日5回まで検索できます。Pro プラン（月額980円）は1日100回まで検索でき、最初の30回はより高精度なAIモデルで分析します。",
    category: "pricing",
  },
  {
    question: "Pro プランの解約はいつでもできますか？",
    answer:
      "はい、いつでも解約可能です。解約後は当月末まで Pro プランの機能をご利用いただけます。",
    category: "pricing",
  },
  {
    question: "アカウント登録は必要ですか？",
    answer:
      "無料プランは登録不要でご利用いただけます。Pro プランをご利用の場合は Google アカウントでのログインが必要です。",
    category: "other",
  },
  {
    question: "検索結果は保存されますか？",
    answer:
      "現在、検索結果の保存機能は提供していません。将来的に検索履歴やお気に入り機能の追加を予定しています。",
    category: "other",
  },
];

// === 料金プラン ===
export const pricingPlans: PricingPlan[] = [
  {
    name: "無料",
    priceYen: 0,
    features: [
      "1日5回まで検索",
      "sonar モデルによる分析",
      "ストリーミング表示",
      "アカウント登録不要",
    ],
    recommended: false,
  },
  {
    name: "Pro",
    priceYen: 980,
    features: [
      "1日100回まで検索",
      "sonar-pro モデル（30回/日まで）",
      "sonar モデル（31〜100回/日）",
      "ストリーミング表示",
      "優先サポート",
    ],
    recommended: true,
  },
];
