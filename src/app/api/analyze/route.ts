import { NextRequest, NextResponse } from "next/server";
import { analyzeProduct } from "@/lib/perplexity";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productName } = body;

    if (!productName || typeof productName !== "string") {
      return NextResponse.json(
        { error: "productName is required" },
        { status: 400 }
      );
    }

    const trimmed = productName.trim();
    if (trimmed.length === 0 || trimmed.length > 200) {
      return NextResponse.json(
        { error: "productName must be 1-200 characters" },
        { status: 400 }
      );
    }

    const { data } = await analyzeProduct(trimmed);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Analysis API error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
