'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import type { ProductItem } from '@/lib/products';
import {
  PRODUCTS_STORAGE_KEY,
  parseStoredProducts,
} from '@/lib/products';
import { useAdminSession } from '@/hooks/useAdminSession';

interface ProductsClientProps {
  products: ProductItem[];
}

// 商品分類清單
const categories = ['全部', '手工藝', '食品', '生活用品'];

// 公益商品頁面的主體（需要 Client Component 才能做分類篩選）
export default function ProductsClient({ products: initialProducts }: ProductsClientProps) {
  // 顯示用商品清單（會合併瀏覽器內的自訂資料）
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const { isAdmin } = useAdminSession();

  // 目前選取的分類
  const [activeCategory, setActiveCategory] = useState('全部');

  // 掛載後讀取自訂公益商品列表
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(PRODUCTS_STORAGE_KEY) : null;
      const parsed = parseStoredProducts(raw);
      if (parsed) setProducts(parsed);
    } catch {
      // 讀取失敗時沿用伺服器預設清單
    }
  }, []);

  // 依分類過濾商品
  const filteredProducts =
    activeCategory === '全部'
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* 頁面 Banner */}
      <section
        className="relative py-16 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FFF3E0 0%, #FFF8EC 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #F5A623, transparent)' }} />
        <div className="container-site relative z-10">
          <span
            className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
            style={{ background: '#FEF3C7', color: '#D97706' }}
          >
            WELFARE PRODUCTS
          </span>
          <h1
            className="text-3xl sm:text-4xl font-black mb-3"
            style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif" }}
          >
            公益商品販售專區
          </h1>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            每一件商品都由工坊夥伴親手製作，您的購買是對他們最直接的支持
          </p>
          <p className="mt-4">
            {isAdmin ? (
              <Link
                href="/products/manage"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                <span aria-hidden>✏️</span>
                編輯商品、上傳照片與價格
              </Link>
            ) : null}
          </p>
        </div>
      </section>

      {/* 溫馨提示 Banner */}
      <div
        className="py-3 text-center text-sm font-medium"
        style={{ background: '#F5A623', color: 'white' }}
      >
        💛 購買公益商品，100% 支持身心障礙者就業訓練計畫
      </div>

      <section className="py-14" style={{ background: '#FAFAF7' }}>
        <div className="container-site">

          {/* 分類篩選按鈕 */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-5 py-2 rounded-full text-sm font-bold transition-all duration-200"
                style={
                  activeCategory === cat
                    ? {
                        background: '#F5A623',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(245,166,35,0.35)',
                        transform: 'translateY(-1px)',
                      }
                    : {
                        background: 'white',
                        color: '#6B7280',
                        border: '1.5px solid #E5E7EB',
                      }
                }
              >
                {cat}
                {/* 顯示各分類商品數量 */}
                <span
                  className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full"
                  style={{
                    background: activeCategory === cat ? 'rgba(255,255,255,0.3)' : '#F3F4F6',
                    color: activeCategory === cat ? 'white' : '#9CA3AF',
                  }}
                >
                  {cat === '全部'
                    ? products.length
                    : products.filter((p) => p.category === cat).length}
                </span>
              </button>
            ))}
          </div>

          {/* 商品網格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* 無商品提示 */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-base">此分類目前尚無商品，敬請期待</p>
            </div>
          )}

          {/* 訂購說明 */}
          <div
            className="mt-14 rounded-2xl p-5 sm:p-8 text-center"
            style={{ background: '#EDF6FF', border: '1.5px solid #BFDBFE' }}
          >
            <h3
              className="text-xl font-bold mb-3"
              style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif", color: '#1A1A1A' }}
            >
              訂購說明
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 text-sm text-gray-600">
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">📞</span>
                <strong className="text-gray-800">聯絡洽詢</strong>
                <span>請填寫聯絡表單或透過 Facebook 粉絲頁私訊我們</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">📦</span>
                <strong className="text-gray-800">出貨方式</strong>
                <span>宅配或現場自取，下訂後 3-7 個工作日出貨</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">💳</span>
                <strong className="text-gray-800">付款方式</strong>
                <span>銀行轉帳或現金付款，金額含稅開立收據</span>
              </div>
            </div>
            <Link href="/contact" className="btn-primary inline-flex">
              立即洽詢訂購
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
