// 管理員「留言收件匣已讀到哪個時間點」：存在 httpOnly Cookie，供全站頂部紅點比對用

export const CONTACT_INBOX_SEEN_COOKIE = 'yuguo_contact_inbox_seen_at';

// Cookie 保存天數（可長於登入工作階段，避免每次重登入就當成全部未讀）
export const CONTACT_INBOX_SEEN_MAX_AGE_SEC = 60 * 60 * 24 * 400;
