export default function ContactPage() {
  const email = "takumarublog@gmail.com";
  const subject = encodeURIComponent("tada へのお問い合わせ");
  const body = encodeURIComponent(
    `【お問い合わせ内容】\n\n\n【ご利用のプラン】\n無料 / Pro\n\n【その他】\n`
  );
  const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">お問い合わせ</h1>

      <div className="space-y-6 text-sm text-muted leading-relaxed">
        <p>
          tada に関するご質問・ご要望・不具合報告は、以下のメールアドレスまでお気軽にご連絡ください。
        </p>

        <div className="bg-card-bg border border-border rounded-2xl p-6">
          <p className="text-xs text-muted mb-2">メールアドレス</p>
          <p className="text-base font-medium text-foreground">{email}</p>
          <a
            href={mailtoLink}
            className="inline-block mt-4 bg-foreground text-background px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition"
          >
            メールを送る
          </a>
        </div>

        <div className="pt-4">
          <h2 className="text-base font-bold text-foreground mb-3">
            お問い合わせの際のお願い
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>ご利用中のプラン（無料 / Pro）</li>
            <li>問題が発生した場合は、その手順や状況の詳細</li>
            <li>ご利用のブラウザ・OS</li>
          </ul>
          <p className="mt-3">
            通常、2営業日以内にご返信いたします。
          </p>
        </div>
      </div>
    </div>
  );
}
