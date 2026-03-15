// === 検索入力 ===
export interface SearchInput {
  productName: string;
  yearsToSell: number; // 売却予定年数（1〜20）
}

// === 前世代モデル情報（過去の事実） ===
export interface PreviousModelFact {
  modelName: string; // 例: "Leica M10"
  releaseYear: number; // 例: 2017
  releasePriceYen: number; // 発売時価格（円）
  currentUsedPriceYen: number; // 現在の中古相場（円）
  yearsElapsed: number; // 経過年数
  actualCostYen: number; // 実質コスト = 発売時価格 - 中古相場
  annualCostYen: number; // 年間コスト = 実質コスト / 経過年数
  retentionRate: number; // 価値保持率（%）= 中古相場 / 発売時価格 * 100
}

// === 未来の示唆 ===
export interface FutureSuggestion {
  currentModelName: string; // 例: "Leica M11"
  currentPriceYen: number; // 現在の販売価格
  yearsToSell: number; // ユーザー指定の売却年数
  estimatedUsedPriceYen: number; // 推定中古価格
  estimatedActualCostYen: number; // 推定実質コスト
  estimatedAnnualCostYen: number; // 推定年間コスト
}

// === ブランド傾向 ===
export interface BrandTrend {
  brandName: string; // 例: "Leica"
  category: string; // 例: "カメラ"
  averageRetentionRate: number; // 平均価値保持率（%）
  trend: "high" | "medium" | "low"; // 値崩れしにくさ
}

// === 検索結果全体 ===
export interface AnalysisResult {
  input: SearchInput;
  previousModel: PreviousModelFact;
  futureSuggestion: FutureSuggestion;
  brandTrends: BrandTrend[];
  citations: string[]; // 情報源URL
}

// === フィードカード ===
export interface FeedCardData {
  id: string;
  productName: string;
  annualCostYen: number; // 実質コスト/年
  userName: string; // 検索したユーザー名（匿名可）
  searchedAt: string; // ISO 8601
}

// === サジェスト候補 ===
export interface SuggestItem {
  label: string; // 表示テキスト
  category: string; // カテゴリ（カメラ、スマホ、車 etc.）
}

// === FAQ ===
export interface FaqItem {
  question: string;
  answer: string;
  category: "service" | "pricing" | "other";
}

// === API基礎データ（年数非依存） ===
// APIから返ってくるのはこの形式。年数に応じた計算はクライアント側で行う。
export interface AnalysisBaseData {
  productName: string; // 検索対象商品名
  currentPriceYen: number; // 現在の販売価格
  annualDepreciationRate: number; // 年間減価率（0〜1）前モデル実績から算出
  previousModel: {
    modelName: string;
    releaseYear: number;
    releasePriceYen: number; // 発売時価格
    currentBuybackPriceYen: number; // 現在の買取相場
    yearsElapsed: number;
    retentionRate: number; // 価値保持率（%）
  };
  citations: { title: string; url: string }[]; // 情報源（タイトル+URL）
}

// === 料金プラン ===
export interface PricingPlan {
  name: string;
  priceYen: number; // 月額（0なら無料）
  features: string[];
  recommended: boolean;
}
