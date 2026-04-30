'use client';

import { useState } from 'react';

interface FormData {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  subject?: string;
  message?: string;
}

// 諮詢主旨選項
const subjectOptions = [
  '商品訂購詢問',
  '企業合作洽談',
  '志工報名',
  '捐款支持',
  '職訓課程詢問',
  '媒體採訪',
  '其他',
];

// 聯絡我們頁面（需 Client Component 處理表單）
export default function ContactClient() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    subject: '商品訂購詢問',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [submitError, setSubmitError] = useState('');

  // 欄位驗證邏輯
  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!formData.name.trim()) errs.name = '請輸入您的姓名';
    if (!formData.phone.trim()) {
      errs.phone = '請輸入聯絡電話';
    } else if (!/^[\d+\-\(\)\s]{7,22}$/.test(formData.phone)) {
      errs.phone = '請輸入有效的電話號碼';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = '請輸入有效的 Email 格式';
    }
    if (!formData.message.trim()) {
      errs.message = '請輸入您的留言內容';
    }
    return errs;
  };

  // 處理欄位變動
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 清除該欄位的錯誤訊息
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // 送出表單：POST 至站內 API（Web3Forms／Resend／本機檔案，依伺服器設定而定）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitStatus('loading');
    setSubmitError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      let payload: { ok?: boolean; error?: string; fieldErrors?: FormErrors } = {};
      try {
        payload = await res.json();
      } catch {
        payload = {};
      }

      if (res.ok && payload.ok) {
        setSubmitStatus('success');
        return;
      }

      if (res.status === 400 && payload.fieldErrors && typeof payload.fieldErrors === 'object') {
        setErrors({ ...payload.fieldErrors });
        setSubmitStatus('idle');
        return;
      }

      setSubmitStatus('error');
      setSubmitError(
        typeof payload.error === 'string' && payload.error.trim()
          ? payload.error
          : '送出失敗，請稍後再試。'
      );
    } catch {
      setSubmitStatus('error');
      setSubmitError('無法連線，請檢查網路後再試。');
    }
  };

  return (
    <>
      {/* 頁面 Banner */}
      <section
        className="relative py-16 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FCE4EC 0%, #EDF6FF 100%)' }}
      >
        <div className="container-site relative z-10">
          <span
            className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
            style={{ background: '#FCE7F3', color: '#BE185D' }}
          >
            CONTACT US
          </span>
          <h1
            className="text-3xl sm:text-4xl font-black mb-3"
            style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif" }}
          >
            聯絡我們
          </h1>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            歡迎隨時與我們聯繫，無論是商品訂購、志工報名或企業合作，我們都很樂意回覆您
          </p>
        </div>
      </section>

      <section className="py-14" style={{ background: '#FAFAF7' }}>
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">

            {/* 左側：聯絡資訊 */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="section-title">聯絡資訊</h2>

              <div className="space-y-4">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/p/瑀過天秦-100091626739290/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 bg-white rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md group"
                  style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: '#1877F208' }}
                  >
                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">Facebook 粉絲頁</div>
                    <div className="text-xs text-gray-500 mt-0.5">瑀過天泰關懷協會</div>
                    <div className="text-xs text-blue-500 mt-1">點擊前往 →</div>
                  </div>
                </a>

                {/* 地址 */}
                <div
                  className="flex items-start gap-4 p-4 bg-white rounded-2xl"
                  style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: '#F5A62308' }}
                  >
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-sm">服務地點</div>
                    <div className="text-xs text-gray-500 mt-0.5">高雄市<br />（詳細地址請來電或私訊洽詢）</div>
                  </div>
                </div>

                {/* 服務時間 */}
                <div
                  className="flex items-start gap-4 p-4 bg-white rounded-2xl"
                  style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: '#5CB85C08' }}
                  >
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-sm">服務時間</div>
                    <div className="text-xs text-gray-500 mt-0.5">週一至週五 09:00–17:00<br />（國定假日除外）</div>
                  </div>
                </div>
              </div>

              {/* 溫馨提示 */}
              <div
                className="p-4 rounded-2xl text-sm"
                style={{ background: '#FFF3E0', border: '1.5px solid #FED7AA' }}
              >
                <div className="font-bold text-orange-700 mb-1">💡 小提示</div>
                <p className="text-orange-600 leading-relaxed text-xs">
                  若有商品訂購需求，請在留言中說明商品名稱、數量及配送地址，我們將儘快與您確認細節。
                </p>
              </div>
            </div>

            {/* 右側：聯絡表單 */}
            <div className="lg:col-span-3">
              {submitStatus === 'success' ? (
                /* 送出成功畫面 */
                <div
                  className="bg-white rounded-2xl p-6 sm:p-10 text-center h-full flex flex-col items-center justify-center gap-4"
                  style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                    style={{ background: '#DCFCE7' }}
                  >
                    ✅
                  </div>
                  <h3
                    className="text-2xl font-black text-gray-800"
                    style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif" }}
                  >
                    感謝您的來信！
                  </h3>
                  <p className="text-gray-500 max-w-sm leading-relaxed">
                    我們已收到您的留言，將於 1-2 個工作日內回覆您。<br />
                    感謝您對瑀過天泰的支持與關注！
                  </p>
                  <button
                    onClick={() => {
                      setSubmitStatus('idle');
                      setSubmitError('');
                      setFormData({ name: '', phone: '', email: '', subject: '商品訂購詢問', message: '' });
                    }}
                    className="btn-secondary mt-2"
                  >
                    再次留言
                  </button>
                </div>
              ) : (
                /* 聯絡表單 */
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-2xl p-5 sm:p-8 space-y-5"
                  style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  noValidate
                >
                  <h3
                    className="text-xl font-bold text-gray-800 mb-1"
                    style={{ fontFamily: "'Nunito', 'Noto Sans TC', sans-serif" }}
                  >
                    填寫留言表單
                  </h3>

                  {submitStatus === 'error' && submitError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                      {submitError}
                    </p>
                  )}

                  {/* 姓名 */}
                  <div>
                    <label htmlFor="name" className="form-label">
                      姓名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="請輸入您的姓名"
                      className="form-input"
                      maxLength={50}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* 電話 + Email 並排 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="form-label">
                        聯絡電話 <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="09XX-XXX-XXX"
                        className="form-input"
                        maxLength={20}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="form-label">
                        電子郵件 <span className="text-gray-400 font-normal">（選填）</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        className="form-input"
                        maxLength={100}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* 諮詢主旨 */}
                  <div>
                    <label htmlFor="subject" className="form-label">諮詢主旨</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="form-input"
                    >
                      {subjectOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
                    )}
                  </div>

                  {/* 留言內容 */}
                  <div>
                    <label htmlFor="message" className="form-label">
                      留言內容 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="請輸入您想詢問的內容…"
                      rows={5}
                      className="form-input resize-y min-h-[7.5rem]"
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                    )}
                  </div>

                  {/* 送出按鈕 */}
                  <button
                    type="submit"
                    disabled={submitStatus === 'loading'}
                    className="btn-primary w-full justify-center"
                    style={submitStatus === 'loading' ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                  >
                    {submitStatus === 'loading' ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        送出中…
                      </>
                    ) : (
                      <>
                        送出留言
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    您的個人資料僅用於本次聯絡回覆，不會作為其他用途
                  </p>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
