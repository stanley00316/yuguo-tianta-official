import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '關於我們',
  description: '認識社團法人高雄市瑀過天泰關懷協會，了解我們的使命、服務對象與組織架構。',
};

export default function AboutPage() {
  // 組織核心價值
  const values = [
    { icon: '❤️', label: '用愛關懷', desc: '以真誠的心對待每一位夥伴，讓他們感受到被尊重與重視。' },
    { icon: '💪', label: '賦能增能', desc: '透過職業訓練，讓身心障礙者具備獨立生活與工作的能力。' },
    { icon: '🌉', label: '搭建橋樑', desc: '連結社會資源，讓企業與身障夥伴找到彼此合適的合作機會。' },
    { icon: '🎨', label: '創意展能', desc: '鼓勵夥伴發揮創意，將才能轉化為具有市場價值的公益商品。' },
  ];

  // 服務項目
  const services = [
    { title: '試衣間職訓服務', desc: '提供服飾整理、折疊、分類、陳列等實務技能培訓，協助身心障礙者熟悉零售服務業工作流程。', icon: '👗', color: '#FFF3E0', border: '#F5A623' },
    { title: '手工藝工坊', desc: '帶領夥伴學習刺繡、手作皂、布製品等手工藝技能，並將成品轉化為公益商品對外販售。', icon: '✂️', color: '#E8F4FD', border: '#4A90D9' },
    { title: '就業輔導媒合', desc: '與友善企業合作，為完成訓練的夥伴媒合適合的職缺，並提供後續就業追蹤支持。', icon: '🤝', color: '#E8F8E8', border: '#5CB85C' },
    { title: '家庭支持服務', desc: '同時關注身障者家庭的需求，提供喘息服務資訊及照顧者支持，減輕家庭負擔。', icon: '🏠', color: '#FCE4EC', border: '#E84040' },
  ];

  return (
    <>
      {/* 頁面 Banner */}
      <section
        className="relative py-16 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FFF8EC 0%, #EDF6FF 100%)' }}
      >
        {/* 裝飾彩虹圓形 */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #F5A623, transparent)' }} />
        <div className="container-site relative z-10">
          <span
            className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
            style={{ background: '#FEF3C7', color: '#D97706' }}
          >
            ABOUT US
          </span>
          <h1
            className="text-3xl sm:text-4xl font-black mb-3"
            style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif" }}
          >
            關於我們
          </h1>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            認識社團法人高雄市瑀過天泰關懷協會
          </p>
        </div>
      </section>

      {/* 協會簡介 */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Logo 大圖 */}
            <div className="flex justify-center">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-2xl opacity-25 scale-110"
                  style={{ background: 'conic-gradient(from 0deg, #E84040, #F5A623, #5CB85C, #4A90D9, #E84040)' }}
                />
                <div
                  className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-white"
                  style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}
                >
                  <Image
                    src="/images/logo.jpg"
                    alt="社團法人高雄市瑀過天泰關懷協會"
                    fill
                    className="object-contain p-4"
                  />
                </div>
              </div>
            </div>

            {/* 文字介紹 */}
            <div>
              <h2 className="section-title mb-6">協會簡介</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-800">社團法人高雄市瑀過天泰關懷協會</strong>，
                  成立於高雄市，秉持「用溫暖陪伴，讓每個人都被看見」的核心理念，
                  長期致力於身心障礙者的職業訓練與就業支持服務。
                </p>
                <p>
                  協會旗下設有「試衣間身心障礙工坊」，以零售服飾業實務操作為主要訓練項目，
                  同時開設手工藝工坊，讓夥伴們透過創作展現自我價值。
                </p>
                <p>
                  我們相信，每一位身心障礙夥伴都擁有獨特的才能與潛力。
                  透過適切的職業訓練與友善的就業環境，他們同樣能夠在社會中
                  發揮所長、創造價值、活出有尊嚴的生命。
                </p>
              </div>

              {/* 不以官網顯示未經公開來源佐證之統計數字；活動與故事請以粉絲頁為準 */}
              <div
                className="mt-8 rounded-xl p-4 sm:p-5 text-sm text-gray-600 leading-relaxed"
                style={{ background: '#FAFAF7', border: '1px solid #E5E7EB' }}
              >
                <p>
                  <strong className="text-gray-800">即時活動與最新紀錄</strong>
                  請以{' '}
                  <Link
                    href="https://www.facebook.com/p/瑀過天秦-100091626739290/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2"
                  >
                    Facebook 粉絲頁「瑀過天秦」
                  </Link>
                  為準；如需進一步資料歡迎{' '}
                  <Link
                    href="/contact"
                    className="font-semibold text-orange-600 hover:text-orange-800 underline underline-offset-2"
                  >
                    聯絡我們
                  </Link>
                  。
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 核心價值 */}
      <section className="py-16" style={{ background: '#FAFAF7' }}>
        <div className="container-site">
          <div className="text-center mb-12">
            <h2 className="section-title mx-auto" style={{ display: 'inline-block' }}>核心價值</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 sm:p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
              >
                <div className="text-4xl mb-3">{v.icon}</div>
                <h3 className="font-bold text-gray-800 text-base mb-2">{v.label}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 服務項目 */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="mb-12">
            <h2 className="section-title">服務項目</h2>
            <p className="mt-3 text-gray-500 text-sm">瑀過天泰提供多元化的身障服務，滿足不同夥伴的需求</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((s, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 flex gap-5 items-start transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: s.color,
                  border: `1.5px solid ${s.border}22`,
                  boxShadow: `0 2px 16px ${s.border}12`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${s.border}20` }}
                >
                  {s.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1.5">{s.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 聯絡 */}
      <section className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #FFF3E0 0%, #EDF6FF 100%)' }}>
        <div className="container-site">
          <h2
            className="text-2xl sm:text-3xl font-black mb-3"
            style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif" }}
          >
            想進一步了解瑀過天泰？
          </h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">歡迎透過各種方式與我們聯繫，共同為身障夥伴創造更好的未來。</p>
          <Link href="/contact" className="btn-primary">
            立即聯絡我們
          </Link>
        </div>
      </section>
    </>
  );
}
