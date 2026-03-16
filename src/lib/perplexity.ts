import type { AnalysisBaseData, DepreciationPoint } from "./types";

const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";

// === カメラ特化型 JSON Schema ===
const CAMERA_ANALYSIS_SCHEMA = {
  type: "object" as const,
  required: [
    "productName",
    "currentModel",
    "depreciationTimeline",
    "previousModel",
    "relatedProducts",
    "marketNotes",
    "dataConfidence",
  ],
  properties: {
    productName: { type: "string" as const },
    currentModel: {
      type: "object" as const,
      required: [
        "name",
        "releaseYear",
        "retailPriceYen",
        "currentBuybackPriceYen",
      ],
      properties: {
        name: { type: "string" as const },
        releaseYear: { type: "integer" as const },
        retailPriceYen: { type: "integer" as const },
        currentBuybackPriceYen: { type: "integer" as const },
      },
    },
    depreciationTimeline: {
      type: "array" as const,
      items: {
        type: "object" as const,
        required: [
          "yearsFromPurchase",
          "buybackPriceYen",
          "retentionRate",
          "source",
        ],
        properties: {
          yearsFromPurchase: { type: "integer" as const },
          buybackPriceYen: { type: "integer" as const },
          retentionRate: { type: "number" as const },
          source: {
            type: "string" as const,
            enum: ["actual", "reference", "estimated"],
          },
        },
      },
    },
    previousModel: {
      type: ["object", "null"] as const,
      required: [
        "name",
        "releaseYear",
        "retailPriceYen",
        "currentBuybackPriceYen",
        "yearsElapsed",
        "retentionRate",
      ],
      properties: {
        name: { type: "string" as const },
        releaseYear: { type: "integer" as const },
        retailPriceYen: { type: "integer" as const },
        currentBuybackPriceYen: { type: "integer" as const },
        yearsElapsed: { type: "integer" as const },
        retentionRate: { type: "number" as const },
      },
    },
    relatedProducts: {
      type: "array" as const,
      items: {
        type: "object" as const,
        required: ["name", "retailPriceYen", "buybackPriceYen"],
        properties: {
          name: { type: "string" as const },
          retailPriceYen: { type: "integer" as const },
          buybackPriceYen: { type: "integer" as const },
        },
      },
    },
    marketNotes: { type: "string" as const },
    dataConfidence: {
      type: "string" as const,
      enum: ["high", "medium", "low"],
    },
  },
};

// === カメラ特化型プロンプト ===
function buildCameraPrompt(productName: string): string {
  return `あなたは日本のカメラ中古市場に精通したリサーチャーです。
以下のカメラについて、買取価格データを調査してJSON形式で返してください。

調査対象: ${productName}

## 参照すべき情報源（これらのサイトを優先的に参照すること）

### 新品価格の参照先
1. **価格.com** — カメラ > デジタル一眼カメラ の最安値
2. **マップカメラ** — 新品販売価格
3. **ヨドバシカメラ** — 販売価格（ポイント還元前の税込価格）

### 買取価格の参照先（最重要 — 中古「販売」価格ではなく「買取」価格）
1. **マップカメラ** — 「買取見積」ページの買取上限価格
2. **カメラのキタムラ** — 「買取価格検索」の買取上限価格
3. **フジヤカメラ** — 買取価格表

### 中古販売相場（参考値として）
- マップカメラ中古、カメラのキタムラ中古の販売価格
- ※買取価格が見つからない場合のみ、中古販売価格の60-70%を買取価格の目安とする

## 調査内容

### A. 現行モデル
- 正式名称（ボディ単体）
- 発売年
- 新品販売価格（価格.comの最安値、またはマップカメラの新品価格）
- 現在の買取上限価格（マップカメラまたはキタムラの買取価格）

### B. 買取価格の推移データ（最重要）
このカメラ、またはその前世代モデルの、年数経過による買取価格の推移を調べてください。

- **現行モデル自身のデータがある場合**: 発売からの経過年数ごとの買取価格。source は "actual"
- **前世代モデルのデータで補完する場合**: source は "reference"
- **データが不十分で推定する場合**: source は "estimated"

最低3データポイント、理想は5つ以上。

### C. 前世代モデル
前世代モデルの基本情報と現在の買取価格。存在しない場合は null。

### D. 同カテゴリの比較カメラ（3つ）
同じ価格帯・用途のカメラとその新品価格・買取価格。

### E. 市場の特記事項
値上がり傾向、ディスコン、限定モデルなど。なければ空文字列。

### F. データ信頼度
"high" = 買取価格が複数の信頼できるサイトで確認できた
"medium" = 一部推定あり
"low" = 大半が推定

## 価格の単位（絶対に守ること）

**全ての価格は「円」単位の整数で回答してください。**

「万円」→「円」の変換: 数字 × 10000

| 元の表記 | 正しい変換 |
|----------|-----------|
| 128万円 | 1280000 |
| 95万円 | 950000 |
| 65万円 | 650000 |
| 45万円 | 450000 |
| 30万円 | 300000 |
| 12.8万円 | 128000 |

**カメラの価格レンジ目安（この範囲外なら変換ミスの可能性大）:**
- エントリー機: 50,000円 〜 200,000円
- ミドル機: 200,000円 〜 500,000円
- フルサイズ機: 300,000円 〜 800,000円
- ハイエンド・プロ機: 500,000円 〜 1,500,000円
- ライカ等の高級機: 800,000円 〜 3,000,000円

**retentionRate（残価率）はパーセント（0〜100）で回答。75%なら 75。**`;
}

// === retentionRate 正規化 ===
function normalizeRetentionRate(rate: number): number {
  if (rate > 0 && rate <= 1) return Math.round(rate * 1000) / 10;
  return Math.round(rate * 10) / 10;
}

// === 価格サニティチェック（カメラ用） ===
// カメラのボディ単体で妥当な価格レンジ: 3万円〜300万円
const CAMERA_PRICE_RANGE = { min: 30000, max: 3000000 };

function detectPriceMagnitudeError(priceYen: number): number {
  if (priceYen > CAMERA_PRICE_RANGE.max) {
    // 10で割って範囲内に入るか試す
    const divided = Math.round(priceYen / 10);
    if (divided >= CAMERA_PRICE_RANGE.min && divided <= CAMERA_PRICE_RANGE.max) {
      return divided;
    }
  }
  return priceYen;
}

function correctAllPrices(data: {
  currentModel: { retailPriceYen: number; currentBuybackPriceYen: number };
  depreciationTimeline: { buybackPriceYen: number; retentionRate: number; yearsFromPurchase: number; source: string }[];
  previousModel: { retailPriceYen: number; currentBuybackPriceYen: number; retentionRate: number } | null;
  relatedProducts: { retailPriceYen: number; buybackPriceYen: number }[];
}): boolean {
  const retail = data.currentModel.retailPriceYen;

  // retailPrice がレンジ外（10倍ズレ）かチェック
  if (retail <= CAMERA_PRICE_RANGE.max) return false; // 問題なし

  const corrected = detectPriceMagnitudeError(retail);
  if (corrected === retail) return false; // 補正できなかった

  // 全価格を 1/10 に補正
  const factor = corrected / retail;
  console.warn(
    `[Price Auto-Correct] Detected 10x price error. retailPrice ${retail} → ${corrected}. Applying factor ${factor} to all prices.`
  );

  data.currentModel.retailPriceYen = Math.round(data.currentModel.retailPriceYen * factor);
  data.currentModel.currentBuybackPriceYen = Math.round(data.currentModel.currentBuybackPriceYen * factor);

  for (const point of data.depreciationTimeline) {
    point.buybackPriceYen = Math.round(point.buybackPriceYen * factor);
  }

  if (data.previousModel) {
    data.previousModel.retailPriceYen = Math.round(data.previousModel.retailPriceYen * factor);
    data.previousModel.currentBuybackPriceYen = Math.round(data.previousModel.currentBuybackPriceYen * factor);
  }

  for (const p of data.relatedProducts) {
    p.retailPriceYen = Math.round(p.retailPriceYen * factor);
    p.buybackPriceYen = Math.round(p.buybackPriceYen * factor);
  }

  return true;
}

// === メイン関数 ===
export async function analyzeProduct(
  productName: string
): Promise<{ data: AnalysisBaseData; rawCitations: string[] }> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new Error("PERPLEXITY_API_KEY is not set");
  }

  const response = await fetch(PERPLEXITY_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar",
      messages: [
        {
          role: "system",
          content:
            "あなたは日本のカメラ中古市場に精通したリサーチャーです。マップカメラ、カメラのキタムラ、フジヤカメラ等の実際の買取価格データに基づいて正確な情報を提供してください。",
        },
        {
          role: "user",
          content: buildCameraPrompt(productName),
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "camera_analysis",
          strict: true,
          schema: CAMERA_ANALYSIS_SCHEMA,
        },
      },
      search_recency_filter: "year",
      search_language_filter: ["ja"],
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Perplexity API error: ${response.status} ${response.statusText} - ${errorBody}`
    );
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Perplexity API returned empty content");
  }

  const parsed = JSON.parse(content);
  const citations: string[] = result.citations ?? [];

  // --- サーバー側データ正規化 ---

  // 1. 価格の10倍ズレを自動補正
  const wasCorrected = correctAllPrices(parsed);

  // 2. retentionRate の正規化
  const normalizedTimeline: DepreciationPoint[] = (parsed.depreciationTimeline ?? []).map(
    (point: { yearsFromPurchase: number; buybackPriceYen: number; retentionRate: number; source: string }) => ({
      ...point,
      retentionRate: normalizeRetentionRate(point.retentionRate),
    })
  );

  const normalizedPrevModel = parsed.previousModel
    ? {
        ...parsed.previousModel,
        retentionRate: normalizeRetentionRate(parsed.previousModel.retentionRate),
      }
    : null;

  // 3. depreciationTimeline のソート（yearsFromPurchase 昇順）
  normalizedTimeline.sort((a, b) => a.yearsFromPurchase - b.yearsFromPurchase);

  // 4. AnalysisBaseData 型に変換
  const data: AnalysisBaseData = {
    productName: parsed.productName,
    category: "camera",
    currentModel: parsed.currentModel,
    depreciationTimeline: normalizedTimeline,
    previousModel: normalizedPrevModel,
    relatedProducts: parsed.relatedProducts ?? [],
    marketNotes: parsed.marketNotes ?? "",
    dataConfidence: wasCorrected
      ? "low" // 価格補正が入った場合は信頼度を下げる
      : parsed.dataConfidence ?? "medium",
    citations: citations.map((url: string, i: number) => ({
      title: `出典 ${i + 1}`,
      url,
    })),
  };

  // 5. デバッグログ
  console.log(
    `[Analyze] ${data.productName}: retail=¥${data.currentModel.retailPriceYen.toLocaleString()}, buyback=¥${data.currentModel.currentBuybackPriceYen.toLocaleString()}, timeline=${data.depreciationTimeline.length} points, confidence=${data.dataConfidence}${wasCorrected ? " (price auto-corrected)" : ""}`
  );

  return { data, rawCitations: citations };
}
