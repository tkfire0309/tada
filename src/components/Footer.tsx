import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card-bg">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="font-bold text-sm mb-3">tada</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/" className="hover:text-foreground transition">
                  ホーム
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition"
                >
                  about
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-foreground transition"
                >
                  料金プラン
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="hover:text-foreground transition"
                >
                  更新情報
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-bold text-sm mb-3">サポート</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/faq" className="hover:text-foreground transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-foreground transition"
                >
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-foreground transition"
                >
                  利用規約
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-sm mb-3">リンク</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <span className="text-muted/50">Coming soon...</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted">
          &copy; 2026 tada. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
