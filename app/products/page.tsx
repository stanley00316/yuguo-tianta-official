import type { Metadata } from 'next';
import ProductsClient from './ProductsClient';
import { DEFAULT_PRODUCTS } from '@/lib/products';

export const metadata: Metadata = {
  title: '公益商品販售專區',
  description: '購買瑀過天泰工坊夥伴親手製作的公益商品，支持身心障礙者就業，每一筆消費都是最有力量的善意。',
};

/** 對外相容：舊 import 仍可從 page 取用（若其他地方有引用） */
export const allProducts = DEFAULT_PRODUCTS;

export default function ProductsPage() {
  return <ProductsClient products={DEFAULT_PRODUCTS} />;
}
