// 首頁三大使命亮點區塊
export default function MissionSection() {
  const missions = [
    {
      icon: '💼',
      title: '職業訓練',
      description: '提供身心障礙夥伴實務技能培訓，包含服飾整理、手工製作等工作技能，協助建立自信心與獨立能力。',
      color: '#FFF3E0',
      borderColor: '#F5A623',
    },
    {
      icon: '🤝',
      title: '就業支持',
      description: '搭建一座友善的橋樑，媒合合適的就業機會，讓每一位夥伴都能在有尊嚴的環境中工作與生活。',
      color: '#E8F4FD',
      borderColor: '#4A90D9',
    },
    {
      icon: '🌈',
      title: '社會融合',
      description: '透過公益活動與商品銷售，讓更多人認識、接納身心障礙者，共同打造包容友善的社會環境。',
      color: '#E8F8E8',
      borderColor: '#5CB85C',
    },
  ];

  return (
    <section className="py-20" style={{ background: '#FAFAF7' }}>
      <div className="container-site">

        {/* 標題 */}
        <div className="text-center mb-12">
          <h2 className="section-title mx-auto" style={{ display: 'inline-block' }}>
            我們的使命
          </h2>
          <p className="mt-5 text-gray-500 text-base leading-relaxed max-w-xl mx-auto">
            瑀過天泰致力於透過工坊服務，讓身心障礙夥伴找到屬於自己的舞台
          </p>
        </div>

        {/* 三欄卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {missions.map((m, i) => (
            <div
              key={i}
              className="rounded-2xl p-7 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1"
              style={{
                background: m.color,
                border: `2px solid ${m.borderColor}22`,
                boxShadow: `0 4px 20px ${m.borderColor}18`,
              }}
            >
              {/* 圓形 Emoji 圖示 */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4"
                style={{ background: `${m.borderColor}20` }}
              >
                {m.icon}
              </div>
              <h3
                className="text-xl font-bold mb-3"
                style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif", color: '#2D2D2D' }}
              >
                {m.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {m.description}
              </p>
              {/* 底部彩色線條 */}
              <div
                className="mt-5 w-12 h-1 rounded-full"
                style={{ background: m.borderColor }}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
