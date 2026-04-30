'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ProductItem } from '@/lib/products';
import {
  DEFAULT_PRODUCTS,
  PRODUCTS_STORAGE_KEY,
  parseStoredProducts,
} from '@/lib/products';
import { compressImageToJpegDataUrl } from '@/lib/image-compress';
import AdminSessionActions from '@/components/admin/AdminSessionActions';

const CATEGORY_OPTIONS = ['手工藝', '食品', '生活用品'] as const;

// 後台編輯商品：可自行上傳照片與調整售價
export default function ManageProductsPage() {
  const [items, setItems] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [saveMsg, setSaveMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [busyId, setBusyId] = useState<number | 'new' | null>(null);

  // 剛進頁時從瀏覽器載入已儲存的清單
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);
      const parsed = parseStoredProducts(raw);
      if (parsed) setItems(parsed);
    } catch {
      setItems(DEFAULT_PRODUCTS);
    }
  }, []);

  const nextId = useMemo(() => {
    const max = items.reduce((acc, x) => Math.max(acc, x.id), 0);
    return max + 1;
  }, [items]);

  // 將目前清單寫回 localStorage（訪客端即可更新官網顯示）
  const persist = useCallback((list: ProductItem[]) => {
    try {
      window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(list));
      setSaveMsg({ type: 'ok', text: '已儲存！公益商品頁與首頁預覽會顯示此內容（同一瀏覽器）。' });
      setItems(list);
      setEditingId(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : '儲存失敗';
      setSaveMsg({ type: 'err', text: `${message}。若照片太多，請刪除部分圖片或聯絡技術人員協助。` });
    }
  }, []);

  const handleDelete = (id: number) => {
    if (!window.confirm('確定要刪除此商品？')) return;
    persist(items.filter((x) => x.id !== id));
  };

  const handleResetDefaults = () => {
    if (!window.confirm('確定要恢復成官網預設商品？會覆蓋目前自訂內容。')) return;
    window.localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    setItems(DEFAULT_PRODUCTS);
    setSaveMsg({ type: 'ok', text: '已恢復預設，並清除此瀏覽器内的自訂資料。' });
    setEditingId(null);
  };

  return (
    <div style={{ background: '#FAFAF7', minHeight: '60vh' }}>
      {/* 這裡是頁頂區塊：說明此頁用途 */}
      <section
        className="relative py-12 text-center border-b border-gray-200 bg-white"
      >
        <div className="container-site">
          <p className="text-xs font-bold tracking-wider text-orange-600 mb-2">
            協會內部使用
          </p>
          <h1
            className="text-2xl sm:text-3xl font-black text-gray-900 mb-3"
            style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif" }}
          >
            公益商品編輯
          </h1>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto mb-4">
            在此上傳商品照片（會自動縮小以節省空間）、修改售價與文案。資料存在您這台電腦的瀏覽器；
            若要讓<strong>所有人</strong>看到，需由我們把內容佈署到伺服器或由管理員協助。
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/products" className="btn-secondary text-sm py-2 px-4">
              返回公益商品專區
            </Link>
            <AdminSessionActions />
            <button
              type="button"
              className="text-sm font-semibold py-2 px-4 rounded-full border border-red-300 text-red-600 hover:bg-red-50"
              onClick={handleResetDefaults}
            >
              恢復預設商品
            </button>
          </div>
          {saveMsg && (
            <p
              className={`mt-4 text-sm font-medium px-4 py-2 rounded-lg inline-block ${saveMsg.type === 'ok'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'}`}
            >
              {saveMsg.text}
            </p>
          )}
        </div>
      </section>

      <div className="container-site py-10 space-y-6">
        {/* 這裡是新增商品的按鈕 */}
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <p className="text-sm text-gray-600">
            共 <strong>{items.length}</strong> 項商品
          </p>
          <button
            type="button"
            className="btn-primary text-sm py-2 px-4"
            onClick={() => setEditingId('new')}
          >
            + 新增商品
          </button>
        </div>

        {editingId === 'new' && (
          <ProductEditor
            mode="create"
            nextId={nextId}
            onCancel={() => setEditingId(null)}
            onSave={(row) => {
              persist([...items, row]);
            }}
            setBusy={(b) => setBusyId(b ? 'new' : null)}
            busy={busyId === 'new'}
          />
        )}

        <ul className="space-y-6">
          {items.map((p) =>
            editingId === p.id ? (
              <li key={p.id}>
                <ProductEditor
                  mode="edit"
                  initial={p}
                  onCancel={() => setEditingId(null)}
                  onSave={(row) => {
                    persist(items.map((x) => (x.id === row.id ? row : x)));
                  }}
                  setBusy={(b) => setBusyId(b ? p.id : null)}
                  busy={busyId === p.id}
                />
              </li>
            ) : (
              <li key={p.id}>
                <article
                  className="bg-white rounded-2xl p-5 flex flex-col sm:flex-row gap-5 shadow-sm border border-gray-100"
                >
                  <div
                    className="w-full sm:w-40 h-36 rounded-xl shrink-0 flex items-center justify-center overflow-hidden"
                    style={{ background: p.imageUrl ? '#f3f4f6' : p.color }}
                  >
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={`${p.name}照片`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl">{p.emoji}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {p.category}
                      </span>
                      <span className="text-orange-600 font-bold">NT$ {p.price || '—'}</span>
                    </div>
                    <h2 className="font-bold text-lg text-gray-900">{p.name}</h2>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">{p.description}</p>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <button
                      type="button"
                      className="btn-secondary text-sm py-2 px-4"
                      onClick={() => setEditingId(p.id)}
                    >
                      編輯
                    </button>
                    <button
                      type="button"
                      className="text-sm font-semibold py-2 px-4 rounded-full border border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(p.id)}
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
      initial?: undefined;
      onCancel: () => void;
      onSave: (row: ProductItem) => void;
      setBusy: (v: boolean) => void;
      busy: boolean;
    }
  | {
      mode: 'edit';
      initial: ProductItem;
      nextId?: undefined;
      onCancel: () => void;
      onSave: (row: ProductItem) => void;
      setBusy: (v: boolean) => void;
      busy: boolean;
    };

// 這裡是單筆商品的表單：可改價錢、換圖
function ProductEditor(props: EditorProps) {
  const { onCancel, onSave, setBusy, busy } = props;
  const defaults: ProductItem =
    props.mode === 'edit'
      ? props.initial
      : {
          id: props.nextId,
          name: '',
          description: '',
          category: '手工藝',
          price: '',
          emoji: '🎁',
          color: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)',
        };

  const [name, setName] = useState(defaults.name);
  const [description, setDescription] = useState(defaults.description);
  const [category, setCategory] = useState(defaults.category);
  const [price, setPrice] = useState(defaults.price);
  const [emoji, setEmoji] = useState(defaults.emoji);
  const [color, setColor] = useState(defaults.color);
  const [imageUrl, setImageUrl] = useState(defaults.imageUrl);
  const [imageError, setImageError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('請選擇圖片檔（JPG／PNG／WebP／GIF）。');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setImageError('檔案過大，請選 12MB 以下的圖片。');
      return;
    }
    setImageError(null);
    setFormError(null);
    setBusy(true);
    try {
      // 將圖縮小後存入，避免超出瀏覽器儲存上限
      const dataUrl = await compressImageToJpegDataUrl(file);
      setImageUrl(dataUrl);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : '圖片處理失敗');
    } finally {
      setBusy(false);
    }
  };

  const clearImage = () => {
    setImageUrl(undefined);
  };

  const submit = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError('請填寫品名');
      return;
    }
    setImageError(null);
    setFormError(null);
    onSave({
      id: defaults.id,
      name: trimmedName,
      description: description.trim(),
      category,
      price: price.trim(),
      emoji: emoji.trim() || '🎁',
      color: color.trim() || defaults.color,
      ...(imageUrl ? { imageUrl } : {}),
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-md space-y-4">
      <h3 className="font-bold text-lg text-gray-900">
        {props.mode === 'create' ? '新增商品' : '編輯商品'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">品名 *</label>
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
          />
        </div>
        <div>
          <label className="form-label">售價（數字，單位為新台幣）</label>
          <input
            className="form-input"
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ''))}
            placeholder="例如 380"
            inputMode="numeric"
            maxLength={8}
          />
        </div>
        <div>
          <label className="form-label">分類</label>
          <select
            className="form-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">無照片時顯示的 Emoji</label>
          <input
            className="form-input"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            maxLength={8}
          />
        </div>
        <div className="md:col-span-2">
          <label className="form-label">商品說明</label>
          <textarea
            className="form-input resize-y min-h-[100px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
          />
        </div>
        <div className="md:col-span-2">
          <label className="form-label">商品照片</label>
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
              <button
                type="button"
                className="text-sm text-red-600 font-semibold hover:underline"
                onClick={clearImage}
              >
                移除照片（改顯示 Emoji）
              </button>
            )}
          </div>
          {imageUrl && (
            <div className="mt-3 w-full max-w-xs rounded-xl overflow-hidden border border-gray-200">
              <img src={imageUrl} alt="預覽" className="w-full h-40 object-cover" />
            </div>
          )}
          {imageError && (
            <p className="mt-2 text-sm text-red-600">{imageError}</p>
          )}
          {formError && (
            <p className="mt-2 text-sm text-red-600">{formError}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="form-label">無照片時的背景漸層（CSS）</label>
          <input
            className="form-input font-mono text-xs"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            maxLength={500}
          />
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
