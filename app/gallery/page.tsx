import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';
import { DEFAULT_GALLERY_ITEMS } from '@/lib/gallery';

export const metadata: Metadata = {
  title: '活動剪影',
  description: '瑀過天泰工坊活動相片集，紀錄每一個感動的瞬間，見證夥伴們的成長與蛻變。',
};

/** 對外相容：舊程式若從 page 引用仍可使用 */
export const galleryItems = DEFAULT_GALLERY_ITEMS;

export default function GalleryPage() {
  return <GalleryClient items={DEFAULT_GALLERY_ITEMS} />;
}
