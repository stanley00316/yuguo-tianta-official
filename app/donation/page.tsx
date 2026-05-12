import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "捐款支持",
  description:
    "社團法人高雄市瑀過天秦關懷協會捐款帳戶、服務主軸說明，與對外協力宣傳海報。",
};

// 與對外 DM 海報一致的法人全名（匯款戶名亦同）
const ORG_LEGAL_NAME = "社團法人高雄市瑀過天秦關懷協會";

// 海報上列出的服務／交流主軸（方便複製搜尋與無障礙閱讀）
const SERVICE_FOCUS_ITEMS = [
  "家庭關懷交流",
  "各類復健課程活動",
  "特殊兒家庭權益爭取",
  "整合全台課程資源交流",
] as const;

// 捐款支持頁：顯示官方海報並附文字版資訊，避免僅靠圖片無法複製帳號
export default function DonationPage() {
  return (
    <>
      <section
        className="relative overflow-hidden py-16 text-center"
        style={{ background: "linear-gradient(135deg, #E8F4FF 0%, #FFF9E6 100%)" }}
      >
        <div className="container-site relative z-10">
          <span
            className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: "#FEF3C7", color: "#B45309" }}
          >
            DONATION
          </span>
          <h1
            className="mb-3 text-3xl font-black sm:text-4xl"
            style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif" }}
          >
            捐款支持
          </h1>
          <p className="mx-auto max-w-lg text-base text-gray-600">
            以下為協會對外捐款 DM 資訊；您也可改以留言與我們聯繫其他支持方式。
          </p>
        </div>
      </section>

      <section className="flex-1 py-14" style={{ background: "#FAFAF7" }}>
        <div className="container-site mx-auto max-w-3xl space-y-10">
          <figure className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
            <Image
              src="/images/donation-support-poster.png"
              width={724}
              height={1024}
              className="h-auto w-full"
              sizes="(max-width: 768px) 100vw, 42rem"
              priority
              alt={`${ORG_LEGAL_NAME}捐款支持宣傳圖：含服務主軸與銀行匯款資料、歡迎加入我們QR示意。`}
            />
            <figcaption className="sr-only">
              {ORG_LEGAL_NAME}
              對外協力海報視覺，含捐款帳戶與服務說明；下方另有純文字版方便複製。
            </figcaption>
          </figure>

          <div
            className="space-y-8 rounded-2xl bg-white p-6 sm:p-8"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
          >
            <div>
              <h2 className="section-title mb-4">協會／服務主軸（文字版）</h2>
              <p className="leading-relaxed text-gray-700">{ORG_LEGAL_NAME}</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700">
                {SERVICE_FOCUS_ITEMS.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="section-title mb-4">匯款資料（文字版）</h2>
              <dl className="grid gap-3 text-gray-800 sm:grid-cols-[6rem_1fr]">
                <dt className="font-semibold text-gray-600">戶　名</dt>
                <dd>{ORG_LEGAL_NAME}</dd>
                <dt className="font-semibold text-gray-600">銀　行</dt>
                <dd>華南銀行（金融機構代號 008）</dd>
                <dt className="font-semibold text-gray-600">分　行</dt>
                <dd>大昌分行</dd>
                <dt className="font-semibold text-gray-600">帳　號</dt>
                <dd className="font-mono tracking-wide">709-100027717</dd>
              </dl>
              <p className="mt-6 text-sm text-gray-500">
                海報下方含「歡迎加入我們」與 QR 區塊，請以網頁上大圖或實體文宣為準；若連結異動請來電確認。
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <Link
                href="/contact"
                className="btn-secondary inline-flex w-full justify-center sm:w-auto"
              >
                需要留言協助？前往聯絡我們
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
