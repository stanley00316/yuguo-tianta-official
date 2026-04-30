'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// 向伺服器確認 Cookie 工作階段是否仍有效（更換頁面時會重問）
export function useAdminSession() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/session', { cache: 'no-store' });
      setIsAdmin(res.ok);
    } catch {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [pathname, refresh]);

  return { isAdmin, refresh };
}
