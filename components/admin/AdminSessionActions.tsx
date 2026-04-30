import Link from 'next/link';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';

// 後台頂部：各管理頁捷徑、變更密碼與登出
export default function AdminSessionActions() {
  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-2xl mx-auto">
      <nav
        className="flex flex-wrap gap-x-3 gap-y-1.5 justify-center text-lg text-gray-600"
        aria-label="管理頁面切換"
      >
        <Link href="/gallery/manage" className="underline hover:text-gray-900">
          活動剪影
        </Link>
        <span className="text-gray-300" aria-hidden>
          |
        </span>
        <Link href="/products/manage" className="underline hover:text-gray-900">
          公益商品
        </Link>
        <span className="text-gray-300" aria-hidden>
          |
        </span>
        <Link href="/news/manage" className="underline hover:text-gray-900">
          最新消息
        </Link>
        <span className="text-gray-300" aria-hidden>
          |
        </span>
        <Link href="/contact/manage" className="underline hover:text-gray-900">
          留言收件
        </Link>
      </nav>
      <div className="flex flex-wrap gap-3 justify-center items-center">
        <Link href="/admin/change-password" className="btn-secondary text-sm py-2 px-4">
          變更管理密碼
        </Link>
        <AdminLogoutButton />
      </div>
    </div>
  );
}
