export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">tada について</h1>

      <div className="space-y-8 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-base font-bold text-foreground mb-3">
            「高い」って、本当に高い？
          </h2>
          <p>
            128万円のカメラ。多くの人は「高い」と感じるでしょう。
            でも、そのカメラが8年後に100万円で売れるなら、実質28万円。年間たった3.5万円で使えた計算になります。
          </p>
          <p className="mt-3">
            一方、5万円のガジェットでも、1年後に価値がゼロになれば実質5万円。
            どちらが「本当に高い」買い物でしょうか？
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-3">
            tada が解決すること
          </h2>
          <p>
            tada
            は、過去の事実に基づいて「本当の値段」を明らかにします。前世代モデルの発売時価格と現在の中古相場を比較し、実質コストを計算。さらに、その傾向から未来の示唆を提供します。
          </p>
          <p className="mt-3">
            予測ではなく事実。tada
            は、あなたの買い物をより賢くするための「事実ベースの判断材料」を提供するサービスです。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-3">
            仕組み
          </h2>
          <p>
            商品名を入力すると、AI が Web
            上の複数の情報源を横断検索し、発売時価格・中古相場・ブランド傾向を総合的に分析します。結果はリアルタイムにストリーミング表示され、待ち時間を最小限に抑えています。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-3">
            開発者について
          </h2>
          <p>
            tada
            は、「買い物の意思決定をデータで支援したい」という個人開発者の想いから生まれました。まだ小さなサービスですが、少しでもあなたの買い物の参考になれば幸いです。
          </p>
        </section>
      </div>
    </div>
  );
}
