import FaqAccordion from "@/components/FaqAccordion";
import { faqItems } from "@/lib/mock-data";

export default function FaqPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">
        よくある質問
      </h1>
      <FaqAccordion items={faqItems} showCategoryHeaders />
    </div>
  );
}
