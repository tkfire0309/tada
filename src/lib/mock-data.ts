import type {
  FeedCardData,
  SuggestItem,
  FaqItem,
  PricingPlan,
} from "./types";

// === サジェスト候補（カメラ特化） ===
export const suggestItems: SuggestItem[] = [
  { label: "Leica M11", category: "カメラ" },
  { label: "Sony α7 IV", category: "カメラ" },
  { label: "Canon EOS R5", category: "カメラ" },
  { label: "Nikon Z8", category: "カメラ" },
  { label: "Fujifilm X-T5", category: "カメラ" },
  { label: "Sony α7C II", category: "カメラ" },
  { label: "Canon EOS R6 Mark II", category: "カメラ" },
  { label: "Leica Q3", category: "カメラ" },
  { label: "Nikon Z6 III", category: "カメラ" },
  { label: "Sony α9 III", category: "カメラ" },
];

// === フィードカード ===
export const feedCards: FeedCardData[] = [
  {
    id: "1",
    productName: "Leica M11",
    annualCostYen: 33000,
    userName: "ユーザーA",
    searchedAt: "2026-03-16T10:30:00Z",
  },
  {
    id: "2",
    productName: "Sony α7 IV",
    annualCostYen: 45000,
    userName: "ユーザーB",
    searchedAt: "2026-03-16T09:15:00Z",
  },
  {
    id: "3",
    productName: "Canon EOS R5",
    annualCostYen: 52000,
    userName: "ユーザーC",
    searchedAt: "2026-03-15T22:00:00Z",
  },
  {
    id: "4",
    productName: "Nikon Z8",
    annualCostYen: 48000,
    userName: "ユーザーD",
    searchedAt: "2026-03-15T18:45:00Z",
  },
  {
    id: "5",
    productName: "Fujifilm X-T5",
    annualCostYen: 35000,
    userName: "ユーザーE",
    searchedAt: "2026-03-15T15:30:00Z",
  },
  {
    id: "6",
    productName: "Sony α9 III",
    annualCostYen: 85000,
    userName: "ユーザーF",
    searchedAt: "2026-03-15T12:00:00Z",
  },
  {
    id: "7",
    productName: "Leica Q3",
    annualCostYen: 42000,
    userName: "ユーザーG",
    searchedAt: "2026-03-14T20:00:00Z",
  },
  {
    id: "8",
    productName: "Canon EOS R6 Mark II",
    annualCostYen: 38000,
    userName: "ユーザーH",
    searchedAt: "2026-03-14T16:30:00Z",
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
