'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import type { ProductItem } from '@/lib/products';
import {
  DEFAULT_PRODUCTS,
  PRODUCTS_STORAGE_KEY,
  parseStoredProducts,
} from '@/lib/products';
import { useAdminSession } from '@/hooks/useAdminSession';

// 首頁公益商品預覽：與公益專區共用同一份瀏覽器儲存資料
export default function ProductPreview() {
  const [preview, setPreview] = useState<ProductItem[]>(DEFAULT_PRODUCTS.slice(0, 3));
  const { isAdmin } = useAdminSession();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);
      const parsed = parseStoredProducts(raw);
      const list = parsed ?? DEFAULT_PRODUCTS;
      setPreview(list.slice(0, 3));
    } catch {
      setPreview(DEFAULT_PRODUCTS.slice(0, 3));
    }
  }, []);

  return (
    <section className="py-20" style={{ background: '#F7F9FC' }}>
      <div className="container-site">

        {/* 標題列 */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="section-title">公益商品</h2>
            <p className="mt-3 text-gray-500 text-sm">每一件商品背後，都是工坊夥伴的心血結晶</p>
            <p className="mt-2">
              {isAdmin ? (
                <Link
                  href="/products/manage"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  編輯商品與照片 →
                </Link>
              ) : null}
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold flex items-center gap-1 transition-colors shrink-0"
            style={{ color: '#4A90D9' }}
          >
            查看全部商品
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* 商品卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {preview.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* 底部 CTA */}
        <div className="text-center mt-10">
          <p className="text-sm text-gray-500 mb-4">
            購買公益商品即是支持身心障礙者就業，讓愛心發揮最大價值
          </p>
          <Link href="/products" className="btn-primary inline-flex">
            瀏覽所有商品
          </Link>
        </div>

      </div>
    </section>
  );
}
