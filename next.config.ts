import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // 設定 Turbopack root 為本專案目錄，避免中文資料夾名稱造成的 byte boundary 錯誤
  turbopack: {
    root: path.resolve(__dirname),
  },
  // 全站基本安全標頭（不依賴外部 CDN 時可放心套用）
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
