// === 検索入力 ===
export interface SearchInput {
  productName: string;
  yearsToSell: number; // 売却予定年数（1〜20）
}

// === 減価タイムラインの1データポイント ===
export interface DepreciationPoint {
  yearsFromPurchase: number; // 購入からの経過年数
  buybackPriceYen: number; // その時点の買取価格
  retentionRate: number; // 残価率（%）= 買取価格 / 新品価格 * 100
  source: "actual" | "reference" | "estimated"; // データの出自
}

// === API基礎データ（年数非依存） ===
// Perplexity APIから返ってくる構造。年数に応じた計算はクライアント側で行う。
export interface AnalysisBaseData {
  productName: string; // 正式商品名
  category: string; // camera / smartphone / car / watch / etc.
  currentModel: {
    name: string;
    releaseYear: number;
    retailPriceYen: number; // 新品販売価格
    currentBuybackPriceYen: number; // 現在の買取相場
  };
  depreciationTimeline: DepreciationPoint[]; // 年数別の買取価格推移（核心データ）
  previousModel: {
    name: string;
    releaseYear: number;
    retailPriceYen: number; // 発売時価格
    currentBuybackPriceYen: number; // 現在の買取相場
    yearsElapsed: number;
    retentionRate: number; // 残価率（%）
  } | null;
  relatedProducts: {
    name: string;
    retailPriceYen: number;
    buybackPriceYen: number;
  }[];
  marketNotes: string; // 市場の特記事項
  dataConfidence: "high" | "medium" | "low"; // データの信頼度
  citations: { title: string; url: string }[]; // 情報源
}

// === 実質コスト計算結果 ===
export interface CostEstimate {
  estimatedBuybackPriceYen: number; // 推定買取価格
  actualCostYen: number; // 実質コスト = 購入価格 - 推定買取価格
  annualCostYen: number; // 年間コスト = 実質コスト / 年数
  retentionRate: number; // 残価率（%）
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

// === 料金プラン ===
export interface PricingPlan {
  name: string;
  priceYen: number; // 月額（0なら無料）
  features: string[];
  recommended: boolean;
}
