import Link from 'next/link';
import { isValidProductImage } from '@/lib/products';

interface ProductCardProps {
  name: string;
  description: string;
  category: string;
  price?: string;
  emoji: string;
  color: string;
  imageUrl?: string;
}

// 公益商品展示卡片元件
export default function ProductCard({
  name,
  description,
  category,
  price,
  emoji,
  color,
  imageUrl,
}: ProductCardProps) {
  // 有通過驗證的圖址才顯示真實照片
  const showPhoto = isValidProductImage(imageUrl);

  return (
    <div className="card group flex flex-col">
      {/* 商品圖片區：有上傳照片則顯示圖片，否則用漸層 + emoji */}
      <div
        className="h-44 overflow-hidden relative flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]"
        style={showPhoto ? undefined : { background: color }}
      >
        {showPhoto ? (
          // 使用一般 img，data URL 無需 Next Image 遠端設定
          <img
            src={imageUrl}
            alt={`${name}商品照片`}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="text-6xl transition-transform duration-300 group-hover:scale-110">
            {emoji}
          </span>
        )}
      </div>

      {/* 商品資訊 */}
      <div className="p-5 flex flex-col flex-1 gap-2">
        {/* 分類標籤 */}
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full self-start"
          style={{ background: '#FEF3C7', color: '#D97706' }}
        >
          {category}
        </span>
        {/* 品名 */}
        <h3 className="font-bold text-gray-800 text-base leading-snug">
          {name}
        </h3>
        {/* 說明 */}
        <p className="text-sm text-gray-500 leading-relaxed flex-1">
          {description}
        </p>
        {/* 價格 + 洽詢按鈕 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-3 pt-3 border-t border-gray-100">
          {price ? (
            <span className="font-bold text-orange-500 text-base">
              NT$ {price}
            </span>
          ) : (
            <span className="text-sm text-gray-400">價格面議</span>
          )}
          <Link
            href="/contact"
            className="product-card-btn text-sm font-semibold px-4 py-1.5 rounded-full border-2 transition-all w-full justify-center sm:w-auto inline-flex text-center"
          >
            洽詢訂購
          </Link>
        </div>
      </div>
    </div>
  );
}
