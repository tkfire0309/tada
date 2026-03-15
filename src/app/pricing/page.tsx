import PricingCard from "@/components/PricingCard";
import { pricingPlans } from "@/lib/mock-data";

export default function PricingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl font-bold">料金プラン</h1>
        <p className="mt-3 text-sm text-muted">
          あなたに合ったプランを選びましょう
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-xl mx-auto">
        {pricingPlans.map((plan) => (
          <PricingCard key={plan.name} plan={plan} />
        ))}
      </div>

      <div className="mt-12 text-center text-xs text-muted space-y-1">
        <p>Pro プランは 1〜30 回目を sonar-pro、31〜100 回目を sonar モデルで分析します。</p>
        <p>いつでもプラン変更・解約が可能です。</p>
      </div>
    </div>
  );
}
