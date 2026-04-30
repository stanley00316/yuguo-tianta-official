import HeroBanner from '@/components/home/HeroBanner';
import MissionSection from '@/components/home/MissionSection';
import NewsPreview from '@/components/home/NewsPreview';
import ProductPreview from '@/components/home/ProductPreview';
import GalleryPreview from '@/components/home/GalleryPreview';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* Hero Banner：第一眼看到的全版橫幅 */}
      <HeroBanner />

      {/* 三大使命亮點 */}
      <MissionSection />

      {/* 最新消息預覽 */}
      <NewsPreview />

      {/* 公益商品預覽 */}
      <ProductPreview />

      {/* 活動剪影預覽 */}
      <GalleryPreview />

      {/* 支持我們 CTA 區塊 */}
      <section
        className="py-14 sm:py-20 text-center"
        style={{
          background: 'linear-gradient(135deg, #FFF3E0 0%, #EDF6FF 100%)',
        }}
      >
        <div className="container-site">
          <div
            className="inline-flex items-center gap-1 text-sm font-semibold mb-4 px-3 py-1 rounded-full"
            style={{ background: '#FEF3C7', color: '#D97706' }}
          >
            🌟 一起讓世界更美好
          </div>
          <h2
            className="text-3xl sm:text-4xl font-black mb-4"
            style={{
              fontFamily: "'Nunito', 'Noto Sans TC', sans-serif",
              color: '#1A1A1A',
            }}
          >
            支持瑀過天泰，讓愛延續
          </h2>
          <p className="text-gray-500 text-base mb-8 max-w-lg mx-auto leading-relaxed">
            您的每一份支持，都是工坊夥伴繼續前行的力量。
            歡迎洽詢合作、購買商品或成為志工夥伴。
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn-primary">
              聯絡我們
            </Link>
            <Link href="/products" className="btn-secondary">
              選購公益商品
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
