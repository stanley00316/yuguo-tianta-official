# CHANGELOG - 瑀過天泰關懷協會官方網站

# CHANGELOG - 瑀過天泰關懷協會官方網站

## [1.6.10] - 2026-04-30

### 首頁視覺

- **`components/home/HeroBanner.tsx`**：首屏右側 Logo 圓框放大為 **`w-64`／`sm:w-80`／`lg:w-96`**（約 **256→320→384px**），**`sizes`** 同步更新；區塊間距略收（**`lg:gap-6`** 等）讓圖示較貼近文字與版面；背後彩虹光暈 **`scale-[1.18]`** 搭配較大圓框。

---

## [1.6.9] - 2026-04-30

### 首頁視覺

- **`components/home/HeroBanner.tsx`**：首屏 Logo 改為 **`object-fill`**，圖片完整撐滿圓形裁切區、無留白與裁切（比例與圓框不同時會略拉伸）。

---

## [1.6.8] - 2026-04-30

### 後台導覽字級

- **`components/admin/AdminSessionActions.tsx`**：後台頂部「活動剪影／公益商品／最新消息／留言收件」捷徑字級由 **`text-xs`**（約 12px）改為 **`text-lg`**（約 18px），約 **+50%**，較易閱讀。

### 首頁視覺

- **`components/home/HeroBanner.tsx`**：首屏右側 Logo 圓框改為 **`object-cover`**、取消 **padding**，圖片滿版填滿圓形；**`sizes`** 改與實際顯示寬度一致以利 `next/image` 解析度。

---

## [1.6.7] - 2026-04-30

### 首頁文案

- **`components/home/HeroBanner.tsx`**：首屏副標改為「透過職業訓練與公益商品，為每一位夥伴創造有尊嚴的工作機會。」（移除句首「試衣間身心障礙工坊，」）。

---

## [1.6.6] - 2026-04-30

### 頁尾聯絡資訊

- **`components/layout/Footer.tsx`**：右欄「聯絡資訊」移除 **LINE 官方帳號** 文字連結（與全站浮動 LINE 按鈕／聯絡頁重複時精簡頁尾）。

---

## [1.6.5] - 2026-04-30

### 全站浮動 LINE

- 新增 **`components/layout/FloatingLineOfficial.tsx`**：右下角固定圓形按鈕（**safe-area**、**z-40** 低於頂欄），連至 **`SITE_LINE_OFFICIAL_URL`**，含 **`aria-label`**／**`title`**。
- **`app/layout.tsx`**：於 **Footer** 之後掛載，全頁可見。

---

## [1.6.4] - 2026-04-30

### 頁尾版面

- **`components/layout/Footer.tsx`**：移除左欄 Logo 區塊下方的 **LINE** 連結（避免與右欄「聯絡資訊」重複）；**LINE 官方帳號** 仍保留於右欄與 **聯絡我們** 頁。

---

## [1.6.3] - 2026-04-30

### 聯絡渠道（LINE 官方）

- **`lib/site-contact.ts`**：新增 **`SITE_LINE_OFFICIAL_ID`**（`@502zrgxr`）與 **`SITE_LINE_OFFICIAL_URL`**（`https://line.me/R/ti/p/@502zrgxr`）。
- **`components/layout/Footer.tsx`**：Logo 區與聯絡資訊欄新增 **LINE 官方帳號** 連結。
- **`app/contact/ContactClient.tsx`**：聯絡資訊左欄新增 **LINE 官方帳號** 卡片（排在 Facebook 之後）。

---

## [1.6.2] - 2026-04-30

### 聯絡資訊（服務據點與電話）

- 新增 **`lib/site-contact.ts`**：集中管理 **鼓山**、**左營** 服務地址與 Google 地圖連結，以及總機 **07-9623203**（`tel:+88679623203`）。
- **`components/layout/Footer.tsx`**：**服務據點** 兩處地圖連結、**聯絡資訊** 顯示正確電話（取代「請洽粉絲頁」空連結）。
- **`app/contact/ContactClient.tsx`**：左欄新增 **聯絡電話** 卡片；**服務據點** 改為兩據點列表並連至地圖。

---

## [1.6.1] - 2026-04-30

### 版本控制

- 於 **GitHub** 建立公開儲庫 **`stanley00316/yuguo-tianta-official`**，預設分支為 **`main`**，並已完成首次推送（與手動在 [建立新儲庫](https://github.com/new) 再 `git push` 等效）。

---

## [1.6.0] - 2026-04-30

### 系統補強（管理體驗、SEO、資安、錯誤頁）

- **`lib/admin-login-redirect.ts`**：登入後安全導向路徑集中管理；**`LoginForm`** 改為引用。
- **`app/admin/login/page.tsx`**（伺服端）：若管理 Cookie 仍有效，**直接 `redirect`** 至 `next` 或預設後台，不必再看登入表單。
- **`components/home/NewsPreview.tsx`**：已登入管理員顯示「編輯最新消息內容 →」（與首頁商品／剪影區塊一致）。
- **`components/layout/Header.tsx`**：訪客／管理員頂部入口用語統一為「**管理者登入**」。
- **`components/admin/AdminSessionActions.tsx`**：`aria-label` 改為「管理頁面切換」。
- **`lib/contact-rate-limit.ts`** + **`POST /api/contact`**：同一 IP **每分鐘**最多 **8** 次（超過 **429** 與 **`Retry-After`**）；正式環境有 **Upstash** 時跨執行個體共用。
- **`lib/site-url.ts`**、**`app/robots.ts`**、**`app/sitemap.ts`**（產出 **`/sitemap.xml`**）：公開頁 sitemap；**`NEXT_PUBLIC_SITE_URL`** 建議上線設定（見 **`.env.example`**）。
- **`next.config.ts`**：全站 **`X-Frame-Options`**、**`Referrer-Policy`** 等安全標頭。
- **`app/error.tsx`**、**`app/global-error.tsx`**：繁中友善錯誤畫面與「再試一次」。
- **`docs/DEPLOY_VERCEL_自有網域.md`**：補充 sitemap／頻率限制／標頭／環境變數說明。

---

## [1.5.10] - 2026-04-30

### 導覽文字

- **`components/layout/Header.tsx`**：已登入時原「後台」連結改為「**管理者登入**」（桌機／手機皆同），仍導向 **`/gallery/manage`**。

---

## [1.5.9] - 2026-04-30

### Header 管理登入入口與編輯連結僅管理員可見

- **`GET /api/admin/session`**：回傳是否具有效管理員 Cookie（供前端顯示用，不帶敏感資料）。
- **`hooks/useAdminSession.ts`**：換頁時向上述 API 確認登入狀態。
- **`components/layout/Header.tsx`**：手機版在**漢堡按鈕左側**加入「**管理登入**」；已登入改顯示「**後台**」導向 **`/gallery/manage`**。桌機導覽列於「支持我們」後加入相同邏輯。
- **`app/admin/login/LoginForm.tsx`**：登入成功後的 **`next`** 白名單擴及首頁 **`/`** 與 **`/about`、`/products`、`/gallery`、`/news`、`/contact`** 及其合法子路徑（仍排除誤開放權限之路徑規則與 **`/admin`** 循環）。
- **`app/products/ProductsClient.tsx`**、**`app/gallery/GalleryClient.tsx`**、**`app/news/NewsClient.tsx`**、**`components/home/ProductPreview.tsx`**、**`components/home/GalleryPreview.tsx`**：Banner／首頁預覽之「✏️ 編輯…」連結**僅在已登入管理員**時渲染；訪客畫面不顯示（直接開啟 `/.*\/manage` 仍由 **middleware** 擋下）。

---

## [1.5.8] - 2026-04-30

### 管理員全站頂部「新留言」紅點

- **`lib/contact-inbox-seen-cookie.ts`**：定義 **`yuguo_contact_inbox_seen_at`**（httpOnly）保存「已讀到最新留言的收件時間」。
- **`GET /api/admin/contact-inbox-badge`**：已登入管理員可查是否有比該時間**更新**的站內留言；未登入回 401（公開訪客不顯示紅點）。
- **`POST /api/admin/contact-inbox-mark-seen`**：將已讀游標設成目前清單**最新一則**的 **`receivedAt`**（清空留言時刪除 Cookie）。
- **`app/contact/manage/page.tsx`**：載入收件匣成功後呼叫上述 POST，並觸發 **`yuguo-contact-inbox-seen`** 讓頂部立刻重問紅點。
- **`components/layout/Header.tsx`**：桌機在「瑀過天泰關懷協會」標題旁顯示小紅點；手機選單收起時標題隱藏，改在 **Logo 右上角**顯示紅點。換頁／**約 45 秒**輪詢／回到分頁時會再檢查。

---

## [1.5.7] - 2026-04-30

### 聯絡留言收件匣可編輯與刪除

- **`lib/contact-inbox-store.ts`**：新增 **`persistFullInboxList`**（重建 Redis 列表或覆寫本機 **jsonl**）、**`updateContactMessage`**、**`deleteContactMessage`**；編輯時沿用 **`parseAndValidateContactPayload`**，收件時間與 **`id`** 不變。
- **`DELETE`／`PATCH /api/admin/contact-messages/[id]`**：已登入管理員可刪除或更新單則留言（正式環境仍須 Redis）。
- **`app/contact/manage/page.tsx`**：每則留言提供 **編輯**（表單儲存）與 **刪除**（確認後送出）。

---

## [1.5.6] - 2026-04-30

### 聯絡我們留言不限制字數

- **`app/contact/ContactClient.tsx`**：留言欄移除 `maxLength`、字數計數與「至少 10 字」檢查；保留必填；`textarea` 改為可垂直調整高度。
- **`lib/contact-submission.ts`**：後端同步移除留言最短／最長字數驗證，仍須非空白。

---

## [1.5.5] - 2026-04-30

### 站內「聯絡留言收件匣」（管理者不需依賴信箱）

- 新增 **`lib/contact-inbox-store.ts`**：留言寫入 **Upstash Redis** 列表（正式環境），或 **`NODE_ENV === 'development'`** 時寫入 **`data/contact-inbox.jsonl`**；最多保留 500 筆。
- **`POST /api/contact`**：改為**先儲存站內收件匣**，再**選擇性**呼叫 Web3Forms／Resend（不影響儲存成功與否）。
- **`GET /api/admin/contact-messages`**：已登入管理員讀取留言列表；正式環境若未設定 Redis 則回 503。
- **`/contact/manage`**：後台檢視留言（與其他 manage 頁相同受 **`middleware`** 保護）；**`AdminSessionActions`** 新增各後台捷徑連結。
- **`middleware`**、**`LoginForm` 允許的 `next` 路徑**：納入 **`/contact/manage`**。
- **`.env.example`**、**`docs/DEPLOY_VERCEL_自有網域.md`**：說明聯絡留言與 Redis 之關係。**`lib/contact-submission.ts`**：移除僅供舊流程使用的本機附加寫入函式（改由 inbox store 統一處理）。

---

## [1.5.4] - 2026-04-30

### 聯絡我們表單可實際送出

- 新增 **`POST /api/contact`**：後端再次驗證姓名、電話、Email、主旨、留言；優先以環境變數 **`WEB3FORMS_ACCESS_KEY`** 轉交 [Web3Forms](https://web3forms.com) 寄信，否則若有 **`RESEND_API_KEY`** 與 **`CONTACT_TO_EMAIL`** 則以 [Resend](https://resend.com) REST API 寄出純文字信。
- **`lib/contact-submission.ts`**：共用驗證、主旨白名單、純文字內容組版、本機 **`data/contact-inbox.jsonl`** 附加寫入（僅 `NODE_ENV === 'development'` 且未設定轉信時）。
- **`app/contact/ContactClient.tsx`**：改為 `fetch('/api/contact')`；顯示伺服器錯誤與欄位錯誤；電話格式與後端一致（可含 `+`）。
- **`.env.example`**、**`docs/DEPLOY_VERCEL_自有網域.md`**：補充聯絡表單環境變數與上線驗證項；**`.gitignore`** 略過 `data/contact-inbox.jsonl`。

---

## [1.5.3] - 2026-04-30

### 最新消息後台移除匯入／匯出與恢復預設

- **`app/news/manage/page.tsx`**：刪除「匯出 JSON 備份」「匯入 JSON」「恢復預設內容」按鈕及相關邏輯；儲存失敗提示改為請縮短內文／刪除舊消息或洽技術協助（與其他後台語氣一致）。

---

## [1.5.2] - 2026-04-30

### 活動剪影後台移除「恢復預設內容」

- **`app/gallery/manage/page.tsx`**：刪除「恢復預設內容」按鈕及對應的 localStorage 清除邏輯，避免誤觸清空。

---

## [1.5.1] - 2026-04-30

### 公益商品後台移除匯入／匯出 JSON

- **`app/products/manage/page.tsx`**：刪除「匯出 JSON 備份」「匯入 JSON」按鈕及相關邏輯；儲存失敗提示改與活動剪影後台一致的精簡說明。

---

## [1.5.0] - 2026-04-30

### 管理者可線上變更登入密碼

- **`lib/admin-password-store.ts`**：登入改為「若有已儲存的 scrypt 雜湊則優先用，否則用環境變數 `ADMIN_PASSWORD`」；新密碼只寫 **本機 `data/admin-password.json`** 或（若有設定）**Upstash Redis**，不寫明文。
- **`POST /api/admin/login`**：改呼叫上述驗證；無密碼／無雜湊可驗證時回 503 說明。
- **`POST /api/admin/change-password`**：須已登入；驗證目前密碼後更新雜湊（新密碼至少 10 字元並需與確認欄一致）。
- **`/admin/change-password`**：變更密碼頁；**`middleware`** 已納入保護；登入頁 `next` 參數允許導向此路徑。
- **`components/admin/AdminSessionActions.tsx`**：後台「變更管理密碼」＋「登出」。
- **依賴**：`@upstash/redis`（僅設定 `UPSTASH_REDIS_REST_URL`／`UPSTASH_REDIS_REST_TOKEN` 時用於讀寫雜湊）。
- **`.gitignore`**：`data/admin-password.json`；**`data/.gitkeep`**。
- **`.env.example`**、**`docs/DEPLOY_VERCEL_自有網域.md`**：Vercel 線上變更密碼須 Redis 之說明。

---

## [1.4.5] - 2026-04-30

### 頂部導覽

- **`components/layout/Header.tsx`**：移除 Logo 旁副標「試衣間身心障礙工坊」，僅保留「瑀過天泰關懷協會」標題（不影響 Footer、SEO 文案與內文頁面）。

---

## [1.4.4] - 2026-04-30

### 本機管理員登入環境

- 新增 **`scripts/setup-admin-env.js`** 與 **`npm run setup:admin-env`**：若專案根目錄尚無 `.env.local`，會寫入隨機 `ADMIN_PASSWORD`、`ADMIN_SESSION_SECRET`，並在主控台印出本機密碼（**不會覆寫**既有檔案）。
- **`.env.example`**：註記本機可先執行上述指令，或手動複製範本為 `.env.local` 並填值。
- 填入變數後請**重啟** `npm run dev`，再以 **`/admin/login`** 登入；正式站請於 Vercel 等設定同名環境變數。

---

## [1.4.3] - 2026-04-30

### 管理員登入介面完稿

- **`app/admin/login/LoginForm.tsx`**：新增與全站一致的漸層 Banner、Logo、白底卡片與彩虹頂線；補無障礙（`role="alert"`、欄位 `aria-*`）；登入成功後的 `next` 僅允許 `/gallery/manage`、`/products/manage`、`/news/manage`（含子路徑）；未設定環境變數時加註 `.env.example` 說明；API 非 JSON 回應時避免前端拋錯。
- **`app/admin/login/layout.tsx`**：補上 `description` metadata（仍 `noindex`）。

---

## [1.4.2] - 2026-04-30

### 今年活動資料對齊粉絲頁、刪除未佐證內容

- **`lib/gallery.ts`**：預設「活動剪影」改為僅保留 Facebook「瑀過天秦」2026-04-21 公開貼文可核對之「海盛釣具店職場體驗」一則；刪除春季市集、職訓結訓、博覽會等範例／無法佐證之項目。
- **`app/about/page.tsx`**：移除「服務人次／合作企業／年資」等無公開來源之統計區塊，改為引導至 Facebook 粉絲頁與聯絡我們。
- **`lib/news.ts`**：註解補充說明 2026 動態以粉絲頁時間軸為準（自動抓取可能未載入全部貼文）。

---

## [1.4.1] - 2026-04-30

### 最新消息預設內容對齊 Facebook

- **`lib/news.ts`**：`DEFAULT_NEWS_ITEMS` 改為依 [瑀過天秦 Facebook 粉絲頁](https://www.facebook.com/p/瑀過天秦-100091626739290/) 公開時間軸可核對之貼文（2026-04-21 海盛釣具店職場體驗）；移除先前範例／杜撰之多則消息，避免與粉絲頁實際動態不符。
- 貼全文若在網頁上被「查看更多」折疊，內文已註明請至粉絲頁閱覽完整版本與相片。

---

## [1.4.0] - 2026-04-30

### 最新消息可後台編輯

- 新增 **`lib/news.ts`**：預設消息、localStorage 鍵名、`parseStoredNews` 驗證、依日期排序與首頁三則預覽邏輯。
- **`/news/manage`**：新增／編輯／刪除、匯出／匯入 JSON、恢復預設；與其他後台相同須先登入。
- **`app/news/NewsClient.tsx`**：公開頁讀取與後台相同資料；時間軸依日期新到舊排列；Banner 提供編輯入口連結。
- **`NewsPreview`（首頁）**：改為讀取 localStorage，顯示日期最新三則之摘要（可填「首頁摘要」或自動截內文）。
- **`middleware`**：納入保護 **`/news/manage`**。
- 登入頁說明文字更新為含最新消息編輯。

---

## [1.3.0] - 2026-04-30

### 管理員登入保護後台

- 新增 **`/admin/login`**：輸入密碼後取得 **httpOnly** 簽署 Cookie，可進入「活動剪影編輯」「公益商品編輯」。
- **`middleware.ts`**：未登入造訪 `/gallery/manage`、`/products/manage` 會導向登入頁，並保留 `next` 導向參數。
- **`lib/admin-auth.ts`**：以 HMAC-SHA256 簽署工作階段，Edge 與 API 共用；登入 API 以 SHA-256 **常數時間**比對密碼。
- **`POST /api/admin/login`**、**`POST /api/admin/logout`**：發放／清除 Cookie。
- 後台頁新增 **登出** 按鈕；**`.env.example`** 說明 **`ADMIN_PASSWORD`**、**`ADMIN_SESSION_SECRET`**（部署時必設）。
- 部署文件 [`docs/DEPLOY_VERCEL_自有網域.md`](docs/DEPLOY_VERCEL_自有網域.md) 補充環境變數與驗證項目。
- **`.gitignore`**：加入 `!.env.example`，變數範本可納入版本庫。

---

## [1.2.3] - 2026-04-30

### 響應式設計（RWD）強化

- **整站**：`layout` 新增 `viewport`（含 `viewport-fit: cover`），方便瀏海機型配合 safe-area；`globals.css` 為 `html`／`body` 加上橫向溢出裁切、`container-site` 與 Lightbox 納入 safe-area 內距。
- **活動剪影**：瀑布流改為 `.gallery-masonry`（手機 1 欄、平板 2 欄、桌機 3 欄），取代原先固定三欄；Lightbox 在小螢幕可捲動、圖片區高度依視窗調整。
- **首頁 Hero**：區塊最小高度與內距依斷點縮放，標題與副標字級更小螢幕友善；機構名一行改為可換行對齊。
- **最新消息**：首頁標題列改為窄螢幕直向堆疊；內頁時間軸左側留白與圓點對齊優化，卡片加上 `min-w-0` 避免長字串撑破版面。
- **關於我們**：核心價值改為「手機單欄 → 平板雙欄 → 大螢幕四欄」，閱讀較輕鬆。
- **公益商品**：訂購說明區塊內距支援小螢幕；**ProductCard** 價格列窄螢幕改直向堆疊，洽詢按鈕可滿寬。
- **聯絡我們**：表單與成功頁內距在小螢幕縮小，較不易超出視窗。

---

## [1.2.2] - 2026-04-30

### 活動剪影後台簡化

- **`/gallery/manage`**：移除「匯出 JSON 備份」與「匯入 JSON」按鈕及相關邏輯；儲存空間不足時的提示改為請刪除圖片或洽技術協助。

---

## [1.2.1] - 2026-04-30

### 部署說明（Vercel 免費方案 + 自有網域）

- 新增文件 [`docs/DEPLOY_VERCEL_自有網域.md`](docs/DEPLOY_VERCEL_自有網域.md)：說明 GitHub 推送、Vercel 匯入專案、在 Vercel 新增網域，以及於網域商設定 DNS（含 www 與根網域注意事項）、HTTPS 與驗證清單。

---

## [1.2.0] - 2026-04-30

### 活動剪影可上架、下架與後台編輯

- 新增 **`lib/gallery.ts`**：統一預設活動剪影、localStorage 鍵名、匯入驗證，以及 **`published`** 欄位（決定是否在官網顯示）。
- 後台 **`/gallery/manage`**：新增／編輯／刪除、勾選上架、列表一鍵上架／下架、上傳相片（自動壓 JPEG）、`robots: noindex`。
- **`/gallery`** 與 **`GalleryPreview`（首頁）**：讀取與後台相同的瀏覽器資料；**僅顯示已上架**項目；支援顯示上傳之相片。
- Banner 與首頁區塊提供通往管理頁的連結。

---

## [1.1.0] - 2026-04-30

### 公益商品可自行上傳照片與編輯價格

- 新增後台頁面 **`/products/manage`**：可新增／編輯／刪除商品、上傳照片（自動壓縮成 JPEG）、修改售價、分類與說明。
- 資料儲存在瀏覽器 **localStorage**（鍵名 `yuguo-tianta-products-v1`），公益商品頁與**首頁**商品預覽會自動讀取同一份資料。
- 支援 **匯出 JSON 備份** 與 **匯入 JSON**，方便換電腦或日後由工程師匯入正式資料庫。
- **`ProductCard`**：若有通過驗證的圖片網址（data URL 或站內 `/` 路徑）則顯示照片，否則維持 Emoji + 漸層。
- **`lib/products.ts`**：集中預設商品清單與儲存解析／圖址安全檢查。
- 管理頁 **`robots: noindex`**，降低被搜尋引擎收錄的機率（仍請勿將網址對外公開）。

---

## [1.0.0] - 2026-04-30

### 🎉 初版上線：完整官方網站從零建置

---

### 新增功能

#### 技術架構
- 以 **Next.js 16.2.4 + TypeScript + Tailwind CSS 4** 從零建置
- 採用 App Router 架構，所有頁面支援 SEO metadata
- 全站支援響應式設計（RWD），手機、平板、電腦皆可正常瀏覽

#### 整站共用元件
- **Header**：頂部彩虹裝飾線 + Logo + 導覽選單（含 scroll 陰影效果）
  - 手機版：漢堡選單展開收合，切換頁面自動關閉
  - 桌機版：hover 底線動畫 + 當前頁面高亮
- **Footer**：協會資訊 + 快速連結 + 聯絡資訊 + Facebook 連結

#### 色彩系統（取自 Logo 彩虹配色）
- 主色：暖陽橘 `#F5A623`
- 副色：天空藍 `#4A90D9`
- 強調：愛心紅 `#E84040`
- 輔助：草地綠 `#5CB85C`
- 背景：暖白 `#FAFAF7`
- 字型：Nunito（標題）+ Noto Sans TC（內文）

---

### 頁面清單

#### 首頁（/）
- Hero Banner：彩虹漸層背景 + Logo 光暈效果 + 主標語 + CTA 按鈕
- 三大使命區塊：職業訓練、就業支持、社會融合
- 最新消息預覽（3 則卡片）
- 公益商品預覽（3 件 + 查看更多）
- 活動剪影預覽（4 格相片縮圖）
- 支持我們 CTA 區塊

#### 關於我們（/about）
- 頁面 Banner
- 協會簡介 + Logo 大圖 + 彩虹光暈
- 統計數字（服務人次、合作企業、服務年資）
- 四大核心價值卡片
- 服務項目介紹（4 項）
- CTA 聯絡區塊

#### 公益商品販售專區（/products）
- 分類篩選按鈕（全部 / 手工藝 / 食品 / 生活用品），含各類別商品數量
- 9 件商品網格展示（含 emoji 色彩卡片、分類標籤、洽詢按鈕）
- 訂購說明區塊（聯絡方式、出貨方式、付款方式）

#### 活動剪影（/gallery）
- 分類篩選（6 種分類）
- CSS columns Masonry 相片牆（大小交錯排列）
- Hover 效果：遮罩 + 標題 + 放大鏡圖示
- Lightbox 點擊放大：顯示大圖 + 活動標題 + 詳細說明

#### 最新消息（/news）
- 時間軸式清單（左側彩色圓點 + 漸層連線）
- 每則消息含：分類標籤、日期、標題、完整內文、標籤

#### 聯絡我們（/contact）
- 聯絡資訊卡片（Facebook、地址、服務時間）
- 完整聯絡表單：姓名、電話、Email、諮詢主旨、留言內容
- 表單驗證：必填欄位、電話格式、Email 格式、留言長度
- 送出成功畫面

---

### 安全規範
- 聯絡表單加入前端輸入驗證（防空值、格式驗證）
- 所有外部連結加入 `rel="noopener noreferrer"`
- 無 dangerouslySetInnerHTML 使用
- 圖片使用 next/image 自動最佳化

---

### 驗證清單
- [ ] 執行 `npm install && npm run dev`，開啟 http://localhost:3000 確認首頁正常顯示
- [ ] 點擊所有導覽選單連結確認頁面可正常切換
- [ ] 縮小瀏覽器至手機尺寸，確認漢堡選單正常運作
- [ ] 前往公益商品頁，點擊分類按鈕確認篩選功能正常
- [ ] 前往活動剪影頁，點擊圖片確認 lightbox 可開啟與關閉
- [ ] 前往聯絡我們頁，測試表單驗證（空白送出、錯誤格式）
- [ ] 測試表單正常送出後顯示成功畫面
