import { feedCards } from "@/lib/mock-data";
import FeedCard from "./FeedCard";

export default function FeedCarousel() {
  // カードを2回繰り返して無限スクロール風に
  const doubled = [...feedCards, ...feedCards];

  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <h2 className="text-xl font-bold">みんなの検索</h2>
        <p className="text-sm text-muted mt-1">
          最近調べられた商品の実質コスト
        </p>
      </div>

      <div className="relative">
        <div className="flex gap-4 px-4 animate-scroll-left w-max">
          {doubled.map((card, i) => (
            <FeedCard key={`${card.id}-${i}`} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
