import type { Metadata, Viewport } from "next";
import "./globals.css";
import FloatingLineOfficial from "@/components/layout/FloatingLineOfficial";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// 手機／平板正確縮放版面，並配合瀏海機型的 safe-area
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// 整站 SEO 基本設定
export const metadata: Metadata = {
  title: {
    default: "瑀過天泰關懷協會 | 試衣間身心障礙工坊",
    template: "%s | 瑀過天泰關懷協會",
  },
  description:
    "社團法人高雄市瑀過天泰關懷協會，試衣間身心障礙工坊。提供身心障礙者職業訓練與就業機會，用溫暖陪伴，讓每個人都被看見。",
  keywords: ["瑀過天泰", "身心障礙", "公益", "高雄", "工坊", "試衣間", "關懷協會"],
  openGraph: {
    siteName: "瑀過天泰關懷協會",
    locale: "zh_TW",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        {/* 整站頂部導覽 */}
        <Header />
        {/* 主要內容區域 */}
        <main className="flex-1">
          {children}
        </main>
        {/* 整站頁尾 */}
        <Footer />
        {/* 右下角浮動 LINE 官方帳號 */}
        <FloatingLineOfficial />
      </body>
    </html>
  );
}
