'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { GalleryItem } from '@/lib/gallery';
import {
  DEFAULT_GALLERY_ITEMS,
  GALLERY_CATEGORY_OPTIONS,
  GALLERY_STORAGE_KEY,
  parseStoredGallery,
} from '@/lib/gallery';
import { compressImageToJpegDataUrl } from '@/lib/image-compress';
import AdminSessionActions from '@/components/admin/AdminSessionActions';

// 後台：活動剪影可上架、下架、編輯與上傳相片
export default function ManageGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(DEFAULT_GALLERY_ITEMS);
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [saveMsg, setSaveMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [busyId, setBusyId] = useState<number | 'new' | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(GALLERY_STORAGE_KEY);
      const parsed = parseStoredGallery(raw);
      if (parsed) setItems(parsed);
    } catch {
      setItems(DEFAULT_GALLERY_ITEMS);
    }
  }, []);

  const nextId = useMemo(() => items.reduce((acc, x) => Math.max(acc, x.id), 0) + 1, [items]);

  // 將清單寫入瀏覽器，並可選是否在儲存後維持編輯視窗開啟
  const persist = useCallback((list: GalleryItem[], options?: { closeEditor?: boolean }) => {
    try {
      window.localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(list));
      setSaveMsg({
        type: 'ok',
        text: '已儲存！活動剪影頁與首頁預覽會顯示已上架項目（同一瀏覽器）。',
      });
      setItems(list);
      if (options?.closeEditor !== false) setEditingId(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : '儲存失敗';
      setSaveMsg({
        type: 'err',
        text: `${message}。若相片太多請刪除部分圖片或聯絡技術人員協助。`,
      });
    }
  }, []);

  const togglePublished = (id: number) => {
    const list = items.map((x) => (x.id === id ? { ...x, published: !x.published } : x));
    persist(list, { closeEditor: false });
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('確定要刪除此筆活動剪影？')) return;
    persist(items.filter((x) => x.id !== id));
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
            活動剪影編輯
          </h1>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto mb-4">
            勾選<strong>上架</strong>後，項目會出現在「活動剪影」頁與首頁預覽；未上架可作為草稿。可上傳相片（自動壓縮）。資料存於本機瀏覽器，
            全站公開顯示仍需佈署或後端同步。
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/gallery" className="btn-secondary text-sm py-2 px-4">
              返回活動剪影
            </Link>
            <AdminSessionActions />
          </div>
          {saveMsg && (
            <p
              className={`mt-4 text-sm font-medium px-4 py-2 rounded-lg inline-block ${
                saveMsg.type === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {saveMsg.text}
            </p>
          )}
        </div>
      </section>

      <div className="container-site py-10 space-y-6">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <p className="text-sm text-gray-600">
            共 <strong>{items.length}</strong> 筆（已上架 {items.filter((x) => x.published !== false).length}{' '}
            筆）
          </p>
          <button type="button" className="btn-primary text-sm py-2 px-4" onClick={() => setEditingId('new')}>
            + 新增活動
          </button>
        </div>

        {editingId === 'new' && (
          <GalleryEditor
            mode="create"
            nextId={nextId}
            onCancel={() => setEditingId(null)}
            onSave={(row) => persist([...items, row])}
            setBusy={(b) => setBusyId(b ? 'new' : null)}
            busy={busyId === 'new'}
          />
        )}

        <ul className="space-y-6">
          {items.map((item) =>
            editingId === item.id ? (
              <li key={item.id}>
                <GalleryEditor
                  mode="edit"
                  initial={item}
                  onCancel={() => setEditingId(null)}
                  onSave={(row) => persist(items.map((x) => (x.id === row.id ? row : x)))}
                  setBusy={(b) => setBusyId(b ? item.id : null)}
                  busy={busyId === item.id}
                />
              </li>
            ) : (
              <li key={item.id}>
                <article className="bg-white rounded-2xl p-5 flex flex-col sm:flex-row gap-5 shadow-sm border border-gray-100">
                  <div
                    className="w-full sm:w-40 h-36 rounded-xl shrink-0 overflow-hidden flex items-center justify-center"
                    style={{ background: item.imageUrl ? '#f3f4f6' : item.color }}
                  >
                    {item.imageUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element -- 後台縮圖來自使用者上傳 */}
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                      </>
                    ) : (
                      <span className="text-5xl">{item.emoji}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500">{item.date}</span>
                      {item.published === false ? (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          未上架（草稿）
                        </span>
                      ) : (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          已上架
                        </span>
                      )}
                    </div>
                    <h2 className="font-bold text-lg text-gray-900">{item.title}</h2>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">{item.description}</p>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <button
                      type="button"
                      className="text-sm font-semibold py-2 px-4 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50"
                      onClick={() => togglePublished(item.id)}
                    >
                      {item.published === false ? '上架' : '下架'}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary text-sm py-2 px-4"
                      onClick={() => setEditingId(item.id)}
                    >
                      編輯
                    </button>
                    <button
                      type="button"
                      className="text-sm font-semibold py-2 px-4 rounded-full border border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(item.id)}
                    >
                      刪除
                    </button>
                  </div>
                </article>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}

type EditorProps =
  | {
      mode: 'create';
      nextId: number;
      onCancel: () => void;
      onSave: (row: GalleryItem) => void;
      setBusy: (b: boolean) => void;
      busy: boolean;
    }
  | {
      mode: 'edit';
      initial: GalleryItem;
      onCancel: () => void;
      onSave: (row: GalleryItem) => void;
      setBusy: (b: boolean) => void;
      busy: boolean;
    };

// 單筆活動剪影表單
function GalleryEditor(props: EditorProps) {
  const { onCancel, onSave, setBusy, busy } = props;

  const defaults: GalleryItem =
    props.mode === 'edit'
      ? props.initial
      : {
          id: props.nextId,
          emoji: '📷',
          title: '',
          description: '',
          date: '',
          category: '市集活動',
          color: 'linear-gradient(135deg, #F0FBF0, #EDF6FF)',
          size: 'small',
          published: true,
        };

  const [title, setTitle] = useState(defaults.title);
  const [description, setDescription] = useState(defaults.description);
  const [date, setDate] = useState(defaults.date);
  const [category, setCategory] = useState(defaults.category);
  const [emoji, setEmoji] = useState(defaults.emoji);
  const [color, setColor] = useState(defaults.color);
  const [size, setSize] = useState<'large' | 'small'>(defaults.size);
  const [published, setPublished] = useState(defaults.published !== false);
  const [imageUrl, setImageUrl] = useState(defaults.imageUrl);
  const [imageError, setImageError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('請選擇圖片檔。');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setImageError('請選 12MB 以下的圖片。');
      return;
    }
    setImageError(null);
    setFormError(null);
    setBusy(true);
    try {
      const dataUrl = await compressImageToJpegDataUrl(file);
      setImageUrl(dataUrl);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : '圖片處理失敗');
    } finally {
      setBusy(false);
    }
  };

  const clearImage = () => setImageUrl(undefined);

  const submit = () => {
    const t = title.trim();
    const cat = category.trim();
    if (!t) {
      setFormError('請填寫標題');
      return;
    }
    if (!cat) {
      setFormError('請選擇分類');
      return;
    }
    setImageError(null);
    setFormError(null);
    onSave({
      id: defaults.id,
      title: t,
      description: description.trim(),
      date: date.trim() || '—',
      category: cat,
      emoji: emoji.trim() || '📷',
      color: color.trim() || defaults.color,
      size,
      published,
      ...(imageUrl ? { imageUrl } : {}),
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-md space-y-4">
      <h3 className="font-bold text-lg text-gray-900">
        {props.mode === 'create' ? '新增活動剪影' : '編輯活動剪影'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">標題 *</label>
          <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
        </div>
        <div>
          <label className="form-label">日期（例如 2026年4月）</label>
          <input className="form-input" value={date} onChange={(e) => setDate(e.target.value)} maxLength={40} />
        </div>
        <div>
          <label className="form-label">分類 *</label>
          <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
            {GALLERY_CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">版面高度</label>
          <select
            className="form-input"
            value={size}
            onChange={(e) => setSize(e.target.value === 'large' ? 'large' : 'small')}
          >
            <option value="small">一般</option>
            <option value="large">較高（大尺寸）</option>
          </select>
        </div>
        <div>
          <label className="form-label">無相片時顯示的 Emoji</label>
          <input className="form-input" value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={8} />
        </div>
        <div className="flex items-center gap-3 pt-6 md:pt-8">
          <input
            id="gallery-published"
            type="checkbox"
            className="w-5 h-5 accent-green-600"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <label htmlFor="gallery-published" className="text-sm font-semibold text-gray-800 cursor-pointer">
            上架（在官網顯示）
          </label>
        </div>
        <div className="md:col-span-2">
          <label className="form-label">說明文</label>
          <textarea
            className="form-input resize-y min-h-[100px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
          />
        </div>
        <div className="md:col-span-2">
          <label className="form-label">活動相片</label>
          <div className="flex flex-wrap items-center gap-3">
            <label className="btn-secondary text-sm py-2 px-4 cursor-pointer">
              {busy ? '處理中…' : '選擇圖片'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                disabled={busy}
                onChange={handleFile}
              />
            </label>
            {imageUrl && (
              <button type="button" className="text-sm text-red-600 font-semibold hover:underline" onClick={clearImage}>
                移除相片（改用 Emoji）
              </button>
            )}
          </div>
          {imageUrl && (
            <div className="mt-3 w-full max-w-xs rounded-xl overflow-hidden border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" className="w-full h-40 object-cover" />
            </div>
          )}
          {imageError && <p className="mt-2 text-sm text-red-600">{imageError}</p>}
          {formError && <p className="mt-2 text-sm text-red-600">{formError}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="form-label">無相片時的背景漸層（CSS）</label>
          <input className="form-input font-mono text-xs" value={color} onChange={(e) => setColor(e.target.value)} maxLength={500} />
        </div>
      </div>
      <div className="flex flex-wrap gap-3 pt-2">
        <button type="button" className="btn-primary text-sm" onClick={submit} disabled={busy}>
          儲存
        </button>
        <button type="button" className="btn-secondary text-sm" onClick={onCancel} disabled={busy}>
          取消
        </button>
      </div>
    </div>
  );
}
