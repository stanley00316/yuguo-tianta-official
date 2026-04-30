'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { NewsItem } from '@/lib/news';
import {
  DEFAULT_NEWS_ITEMS,
  NEWS_CATEGORY_DEFAULT_COLOR,
  NEWS_CATEGORY_OPTIONS,
  NEWS_STORAGE_KEY,
  parseStoredNews,
  sortNewsByDateDesc,
} from '@/lib/news';
import AdminSessionActions from '@/components/admin/AdminSessionActions';

// 後台：最新消息新增／編輯／刪除，資料存於本機瀏覽器
export default function ManageNewsPage() {
  const [items, setItems] = useState<NewsItem[]>(DEFAULT_NEWS_ITEMS);
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [saveMsg, setSaveMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(NEWS_STORAGE_KEY);
      const parsed = parseStoredNews(raw);
      if (parsed) setItems(parsed);
    } catch {
      setItems(DEFAULT_NEWS_ITEMS);
    }
  }, []);

  const sorted = useMemo(() => sortNewsByDateDesc(items), [items]);
  const nextId = useMemo(() => items.reduce((acc, x) => Math.max(acc, x.id), 0) + 1, [items]);

  const persist = useCallback((list: NewsItem[]) => {
    try {
      window.localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(list));
      setSaveMsg({ type: 'ok', text: '已儲存！最新消息頁與首頁預覽會顯示此內容（同一瀏覽器）。' });
      setItems(list);
      setEditingId(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : '儲存失敗';
      setSaveMsg({
        type: 'err',
        text: `${message}。請縮短內文或刪除舊消息後再試，必要時聯絡技術人員協助。`,
      });
    }
  }, []);

  const handleDelete = (id: number) => {
    if (!window.confirm('確定要刪除此則消息？')) return;
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
            最新消息編輯
          </h1>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto mb-4">
            在此編輯時間軸消息、首頁預覽會顯示<strong>日期最新</strong>的前三則摘要。段落請用<strong>空行</strong>分隔。
            資料存在您這台電腦的瀏覽器；若要讓所有人看到，需佈署或由管理員協助同步。
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/news" className="btn-secondary text-sm py-2 px-4">
              返回最新消息
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
            共 <strong>{items.length}</strong> 則
          </p>
          <button type="button" className="btn-primary text-sm py-2 px-4" onClick={() => setEditingId('new')}>
            + 新增消息
          </button>
        </div>

        {editingId === 'new' && (
          <NewsEditor
            mode="create"
            nextId={nextId}
            onCancel={() => setEditingId(null)}
            onSave={(row) => persist([...items, row])}
          />
        )}

        <ul className="space-y-6">
          {sorted.map((n) =>
            editingId === n.id ? (
              <li key={n.id}>
                <NewsEditor
                  mode="edit"
                  initial={n}
                  onCancel={() => setEditingId(null)}
                  onSave={(row) => persist(items.map((x) => (x.id === row.id ? row : x)))}
                />
              </li>
            ) : (
              <li key={n.id}>
                <article className="bg-white rounded-2xl p-5 flex flex-col sm:flex-row gap-5 shadow-sm border border-gray-100">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: `${n.categoryColor}18`,
                          color: n.categoryColor,
                        }}
                      >
                        {n.category}
                      </span>
                      <span className="text-xs text-gray-500">{n.date}</span>
                    </div>
                    <h2 className="font-bold text-lg text-gray-900">{n.title}</h2>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3 whitespace-pre-wrap">{n.content}</p>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <button type="button" className="btn-secondary text-sm py-2 px-4" onClick={() => setEditingId(n.id)}>
                      編輯
                    </button>
                    <button
                      type="button"
                      className="text-sm font-semibold py-2 px-4 rounded-full border border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(n.id)}
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
      onSave: (row: NewsItem) => void;
    }
  | {
      mode: 'edit';
      initial: NewsItem;
      onCancel: () => void;
      onSave: (row: NewsItem) => void;
    };

// 將 #RGB 轉成顏色選擇器可用的 #RRGGBB
function colorPickerValue(hex: string): string {
  const s = hex.trim();
  if (/^#[0-9A-Fa-f]{3}$/i.test(s)) {
    const r = s[1];
    const g = s[2];
    const b = s[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  if (/^#[0-9A-Fa-f]{6}$/i.test(s)) return s.slice(0, 7);
  return '#F5A623';
}

// 單則消息表單：日期、分類色、標題、內文、標籤、首頁摘要
function NewsEditor(props: EditorProps) {
  const { onCancel, onSave } = props;
  const defaults: NewsItem =
    props.mode === 'edit'
      ? props.initial
      : {
          id: props.nextId,
          date: new Date().toISOString().slice(0, 10),
          category: NEWS_CATEGORY_OPTIONS[0],
          categoryColor: NEWS_CATEGORY_DEFAULT_COLOR[NEWS_CATEGORY_OPTIONS[0]] ?? '#F5A623',
          title: '',
          content: '',
          tags: [],
        };

  const [date, setDate] = useState(defaults.date);
  const [category, setCategory] = useState(defaults.category);
  const [categoryColor, setCategoryColor] = useState(defaults.categoryColor);
  const [title, setTitle] = useState(defaults.title);
  const [content, setContent] = useState(defaults.content);
  const [summary, setSummary] = useState(defaults.summary ?? '');
  const [tagsInput, setTagsInput] = useState(defaults.tags.join('、'));
  const [formError, setFormError] = useState<string | null>(null);

  const categorySelectOptions = useMemo(() => {
    const base = [...NEWS_CATEGORY_OPTIONS] as string[];
    if (!base.includes(category)) return [category, ...base];
    return base;
  }, [category]);

  const onCategoryChange = (cat: string) => {
    setCategory(cat);
    const preset = NEWS_CATEGORY_DEFAULT_COLOR[cat];
    if (preset) setCategoryColor(preset);
  };

  const submit = () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle) {
      setFormError('請填寫標題');
      return;
    }
    if (!trimmedContent) {
      setFormError('請填寫內文');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setFormError('日期格式須為 YYYY-MM-DD');
      return;
    }
    const colorTrim = categoryColor.trim() || '#F5A623';
    if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(colorTrim)) {
      setFormError('分類顏色須為 #RGB 或 #RRGGBB 格式');
      return;
    }
    const tags = tagsInput
      .split(/[,，、]/g)
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 20)
      .map((t) => (t.length > 30 ? t.slice(0, 30) : t));

    const sum = summary.trim();
    setFormError(null);
    onSave({
      id: defaults.id,
      date,
      category: category.trim() || '活動公告',
      categoryColor: colorTrim,
      title: trimmedTitle,
      content: trimmedContent,
      tags,
      ...(sum ? { summary: sum.slice(0, 500) } : {}),
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-md space-y-4">
      <h3 className="font-bold text-lg text-gray-900">{props.mode === 'create' ? '新增消息' : '編輯消息'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">日期 *</label>
          <input className="form-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="form-label">分類</label>
          <select className="form-input" value={category} onChange={(e) => onCategoryChange(e.target.value)}>
            {categorySelectOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
          <label className="form-label mb-0 w-full md:w-auto md:mr-2">分類／時間軸顏色</label>
          <input
            type="color"
            className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
            value={colorPickerValue(categoryColor)}
            onChange={(e) => setCategoryColor(e.target.value)}
            aria-label="選擇分類顯示色"
          />
          <input
            className="form-input flex-1 min-w-[8rem] font-mono text-sm"
            value={categoryColor}
            onChange={(e) => setCategoryColor(e.target.value)}
            maxLength={7}
            placeholder="#F5A623"
          />
        </div>
        <div className="md:col-span-2">
          <label className="form-label">標題 *</label>
          <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
        </div>
        <div className="md:col-span-2">
          <label className="form-label">內文 *（段落間請空一行）</label>
          <textarea
            className="form-input resize-y min-h-[180px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={20000}
          />
        </div>
        <div className="md:col-span-2">
          <label className="form-label">首頁卡片摘要（選填；不填則自動截取內文）</label>
          <textarea
            className="form-input resize-y min-h-[72px]"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            maxLength={500}
          />
        </div>
        <div className="md:col-span-2">
          <label className="form-label">標籤（以逗號或頓號分隔，最多 20 個）</label>
          <input
            className="form-input"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="例如：市集、公益、感謝"
            maxLength={800}
          />
        </div>
      </div>
      {formError && <p className="text-sm text-red-600">{formError}</p>}
      <div className="flex flex-wrap gap-3 pt-2">
        <button type="button" className="btn-primary text-sm" onClick={submit}>
          儲存
        </button>
        <button type="button" className="btn-secondary text-sm" onClick={onCancel}>
          取消
        </button>
      </div>
    </div>
  );
}
