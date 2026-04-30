import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: '聯絡我們',
  description: '與瑀過天泰關懷協會聯繫，了解商品訂購、志工服務、企業合作或其他相關事宜。',
};

export default function ContactPage() {
  return <ContactClient />;
}
