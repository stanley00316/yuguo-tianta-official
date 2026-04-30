import { getAdminPasswordStorageMode } from '@/lib/admin-password-store';
import ChangePasswordClient from './ChangePasswordClient';

// 這裡需在執行時讀取環境變數，才能正確顯示「檔案／Redis」儲存提示
export const dynamic = 'force-dynamic';

// 載入伺服器側設定的密碼儲存說明（Redis 或本機檔案）
export default function AdminChangePasswordPage() {
  const storageMode = getAdminPasswordStorageMode();

  return <ChangePasswordClient storageMode={storageMode} />;
}
