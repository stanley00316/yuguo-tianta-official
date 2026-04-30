'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import AdminSessionActions from '@/components/admin/AdminSessionActions';
import type { StoredContactMessage } from '@/lib/contact-inbox-store';
import { CONTACT_SUBJECT_OPTIONS, type ContactSubject } from '@/lib/contact-submission';

type EditFieldErrors = Partial<Record<'name' | 'phone' | 'email' | 'subject' | 'message', string>>;

type EditFormState = {
  name: string;
  phone: string;
  email: string;
  subject: ContactSubject;
  message: string;
};

const emptyEditForm: EditFormState = {
  name: '',
  phone: '',
  email: '',
  subject: CONTACT_SUBJECT_OPTIONS[0],
  message: '',
};

// 後台：讀取／編輯／刪除「聯絡我們」留言（Redis 或本機檔）
export default function ContactManagePage() {
  const [items, setItems] = useState<StoredContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>(emptyEditForm);
  const [editErrors, setEditErrors] = useState<EditFieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/contact-messages', { cache: 'no-store' });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        items?: StoredContactMessage[];
      };
      if (!res.ok || !data.ok) {
        setError(typeof data.error === 'string' ? data.error : '讀取失敗。');
        setItems([]);
        return;
      }
      const nextItems = Array.isArray(data.items) ? data.items : [];
      setItems(nextItems);
      // 成功載入收件匣後，把「已讀游標」更新到目前最新一則，全站頂部新留言紅點才會清除
      void fetch('/api/admin/contact-inbox-mark-seen', { method: 'POST' }).then((r) => {
        if (r.ok) window.dispatchEvent(new Event('yuguo-contact-inbox-seen'));
      });
    } catch {
      setError('網路錯誤，請稍後再試。');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const startEdit = (row: StoredContactMessage) => {
    setEditingId(row.id);
    setEditErrors({});
    setEditForm({
      name: row.name,
      phone: row.phone,
      email: row.email,
      subject: row.subject,
      message: row.message,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditErrors({});
    setEditForm(emptyEditForm);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    setEditErrors({});
    try {
      const res = await fetch(`/api/admin/contact-messages/${encodeURIComponent(editingId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: EditFieldErrors;
      };
      if (!res.ok || !data.ok) {
        if (data.fieldErrors && typeof data.fieldErrors === 'object') {
          setEditErrors(data.fieldErrors);
        }
        setError(typeof data.error === 'string' ? data.error : '儲存失敗。');
        return;
      }
      cancelEdit();
      setError(null);
      await load();
    } catch {
      setError('網路錯誤，請稍後再試。');
    } finally {
      setSaving(false);
    }
  };

  const removeRow = async (id: string) => {
    if (!window.confirm('確定要刪除此則留言？刪除後無法復原。')) return;
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/contact-messages/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(typeof data.error === 'string' ? data.error : '刪除失敗。');
        return;
      }
      if (editingId === id) cancelEdit();
      await load();
    } catch {
      setError('網路錯誤，請稍後再試。');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ background: '#FAFAF7', minHeight: '60vh' }}>
      <section className="relative py-12 text-center border-b border-gray-200 bg-white">
        <div className="container-site">
          <p className="text-xs font-bold tracking-wider text-orange-600 mb-2">協會內部使用</p>
          <h1
            className="text-2xl sm:text-3xl font-black text-gray-900 mb-3"
            style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif" }}
          >
            聯絡留言收件匣
          </h1>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto mb-4">
            訪客於「聯絡我們」送出的留言會出現在此處；可<strong>編輯</strong>內容或<strong>刪除</strong>。
            正式環境請設定 <strong>Upstash Redis</strong>；本機開發時資料在{' '}
            <code className="text-xs bg-gray-100 px-1 rounded">data/contact-inbox.jsonl</code>。
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contact" className="btn-secondary text-sm py-2 px-4">
              返回聯絡我們
            </Link>
            <button type="button" className="btn-primary text-sm py-2 px-4" onClick={() => void load()}>
              重新整理
            </button>
            <AdminSessionActions />
          </div>
          {error && (
            <p
              className="mt-4 text-sm font-medium px-4 py-2 rounded-lg inline-block bg-red-100 text-red-800 max-w-xl mx-auto"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>
      </section>

      <div className="container-site py-10 space-y-6">
        {loading && <p className="text-gray-600 text-sm text-center">載入中…</p>}

        {!loading && !error && items.length === 0 && (
          <p className="text-center text-gray-500 text-sm">目前尚無留言。</p>
        )}

        {!loading && items.length > 0 && (
          <p className="text-sm text-gray-600">
            共 <strong>{items.length}</strong> 筆（最多保留伺服器上最近 500 筆）
          </p>
        )}

        <ul className="space-y-5">
          {items.map((row) => {
            const isEditing = editingId === row.id;
            return (
              <li
                key={row.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  {isEditing ? (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn-primary text-sm py-2 px-4 disabled:opacity-60"
                        onClick={() => void saveEdit()}
                        disabled={saving}
                      >
                        {saving ? '儲存中…' : '儲存變更'}
                      </button>
                      <button
                        type="button"
                        className="btn-secondary text-sm py-2 px-4 disabled:opacity-60"
                        onClick={cancelEdit}
                        disabled={saving}
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <span
                      className="inline-block text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: '#EDF6FF', color: '#1D4ED8' }}
                    >
                      {row.subject}
                    </span>
                  )}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <time className="text-xs text-gray-400">{formatReceivedAt(row.receivedAt)}</time>
                    {!isEditing && (
                      <>
                        <button
                          type="button"
                          className="text-sm font-semibold text-blue-600 hover:underline"
                          onClick={() => startEdit(row)}
                          disabled={deletingId !== null}
                        >
                          編輯
                        </button>
                        <button
                          type="button"
                          className="text-sm font-semibold text-red-600 hover:underline disabled:opacity-50"
                          onClick={() => void removeRow(row.id)}
                          disabled={deletingId !== null}
                        >
                          {deletingId === row.id ? '刪除中…' : '刪除'}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-4 border-t border-gray-100 pt-4">
                    <div>
                      <label htmlFor={`edit-name-${row.id}`} className="form-label">
                        姓名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`edit-name-${row.id}`}
                        className="form-input"
                        value={editForm.name}
                        onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                        maxLength={50}
                      />
                      {editErrors.name && (
                        <p className="mt-1 text-xs text-red-500">{editErrors.name}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`edit-phone-${row.id}`} className="form-label">
                          聯絡電話 <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`edit-phone-${row.id}`}
                          type="tel"
                          className="form-input"
                          value={editForm.phone}
                          onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                          maxLength={20}
                        />
                        {editErrors.phone && (
                          <p className="mt-1 text-xs text-red-500">{editErrors.phone}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor={`edit-email-${row.id}`} className="form-label">
                          Email <span className="text-gray-400 font-normal">（選填）</span>
                        </label>
                        <input
                          id={`edit-email-${row.id}`}
                          type="email"
                          className="form-input"
                          value={editForm.email}
                          onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                          maxLength={100}
                        />
                        {editErrors.email && (
                          <p className="mt-1 text-xs text-red-500">{editErrors.email}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label htmlFor={`edit-subject-${row.id}`} className="form-label">
                        諮詢主旨
                      </label>
                      <select
                        id={`edit-subject-${row.id}`}
                        className="form-input"
                        value={editForm.subject}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            subject: e.target.value as ContactSubject,
                          }))
                        }
                      >
                        {CONTACT_SUBJECT_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {editErrors.subject && (
                        <p className="mt-1 text-xs text-red-500">{editErrors.subject}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor={`edit-message-${row.id}`} className="form-label">
                        留言內容 <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id={`edit-message-${row.id}`}
                        className="form-input resize-y min-h-[8rem]"
                        rows={6}
                        value={editForm.message}
                        onChange={(e) => setEditForm((p) => ({ ...p, message: e.target.value }))}
                      />
                      {editErrors.message && (
                        <p className="mt-1 text-xs text-red-500">{editErrors.message}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-1.5 text-sm text-gray-800 mb-3">
                      <p>
                        <span className="text-gray-500">姓名：</span>
                        {row.name}
                      </p>
                      <p>
                        <span className="text-gray-500">電話：</span>
                        {row.phone}
                      </p>
                      {row.email ? (
                        <p>
                          <span className="text-gray-500">Email：</span>
                          {row.email}
                        </p>
                      ) : (
                        <p className="text-gray-400 text-xs">Email：（未填）</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border-t border-gray-100 pt-3">
                      {row.message}
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function formatReceivedAt(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString('zh-TW', {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}
