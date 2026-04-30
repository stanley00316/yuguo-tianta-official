# 免費上架 Vercel + 綁定自有網域（瑀過天泰官網）

本專案為 **Next.js App Router**。使用 **Vercel Hobby（免費方案）** 即可部署；**自有網域**只要在網址商（DNS）照 Vercel 指示設定紀錄即可。

> 請以 Vercel 專案後台「Domains」畫面顯示的數值為準（不同時期可能微調）。以下為常見流程。

---

## 一、事前準備

1. **GitHub 帳號**（免費）
2. **Vercel 帳號**（免費，可用 GitHub 登入）
3. **已購買的網域**（例如在 GoDaddy、Namecheap、Gandi、網路上雲.tw、Cloudflare 等）

---

## 二、程式碼放到 GitHub

在專案資料夾內：

```bash
git add .
git commit -m "準備部署官網"
```

若尚無 GitHub 倉庫，到 GitHub 建立一個空的 repository，再執行（請改成你的網址）：

```bash
git remote add origin https://github.com/你的帳號/你的倉庫名.git
git branch -M main
git push -u origin main
```

---

## 三、在 Vercel 建立專案

1. 登入 [Vercel](https://vercel.com)
2. **Add New Project** → Import 剛才的 GitHub 倉庫
3. **Framework Preset**：Next.js（通常會自動辨識）
4. Root Directory：**維持專案根目錄**（本倉庫即為 Next 根目錄）
5. 點 **Deploy**

第一次部署成功後，會先拿到一個 **`xxx.vercel.app`** 網址，可先點進去確認網站正常。

---

## 四、綁定自有網域

### 4.1 在 Vercel 新增網域

1. 進入該 Project → **Settings** → **Domains**
2. 輸入你的網域，例如：`example.org` 或 `www.example.org`
3. Vercel 會顯示 **需要設定的 DNS 紀錄**（請完全照畫面上的 Type / Name / Value）

### 4.2 到網域商設定 DNS（兩種常見情況）

**情況 A：只使用 www（建議較簡單）**

- 新增一筆 **CNAME**：
  - **名稱 / Host**：`www`
  - **值 / Target**：Vercel 顯示的目標（常見形如 `cname.vercel-dns.com`，以畫面為準）

**情況 B：根網域（apex，例如不加 www 的 `example.org`）**

- 依 Vercel 指示可能是 **A** 或 **ALIAS/ANAME**（看你的 DNS 商支援哪一種）
- 數值同樣以 Vercel Domains 頁面為準

**建議**：同時把 `www` 與根網域都加進 Vercel，並在 Vercel 設一個為 **Primary**，另一個勾選 **Redirect** 到主要網址，訪客不論打哪一個都會到同一站。

### 4.3 等待生效

- DNS 擴散通常 **幾分鐘到 48 小時** 不等
- Vercel 域名狀態從 **Pending** 變 **Valid** 即完成
- 若長期失敗：檢查網域是否仍在舊主機、或 CNAME 與 A 是否衝突（同一主機名不要重複多筆衝突）

---

## 五、HTTPS（綠鎖頭）

Vercel 會自動申請 **Let’s Encrypt** 憑證，網域驗證通過後 **HTTPS 無需額外付費**。

---

## 六、與本專案後台有關的提醒

- **Sitemap 與 robots**：專案內建 **`/sitemap.xml`**、**`/robots.txt`**（公開頁為主）。正式站請在環境變數設定 **`NEXT_PUBLIC_SITE_URL`**（例如 `https://你的網域`，不要結尾斜線），以免僅依 `*.vercel.app` 產生網址。
- **聯絡表單頻率**：**`POST /api/contact`** 對同一來源 IP 設有**每分鐘次數上限**（正式環境若已設定 Upstash Redis 則跨執行個體共用計數；本機無 Redis 時僅單一程序有效）。
- **HTTP 安全標頭**：**`next.config`** 已套用常見標頭（如 **`X-Frame-Options`**、**`Referrer-Policy`** 等）；若日後需內嵌 iframe 再調整。

- **管理員登入**：編輯「活動剪影」「公益商品」「最新消息」前，請先到 **`/admin/login`** 登入。若未設定環境變數，後台會無法使用。
- **`/admin/change-password`（變更管理密碼）**：登入任一後台後可由此更新登入密碼；伺服器會儲存 **scrypt 雜湊**（不存明文）。
  - **本機**：雜湊寫入專案內 **`data/admin-password.json`**（已列入 `.gitignore`，勿提交）。
  - **Vercel**：伺服器無法持久化寫入上述檔案，請另外在 [Upstash](https://upstash.com/)（或其他相容 REST 的 Redis）建立免費資料庫，並在環境變數加上：
    - **`UPSTASH_REDIS_REST_URL`**
    - **`UPSTASH_REDIS_REST_TOKEN`**
    若不設定這兩個變數，在線上環境將**無法**成功保存新密碼（請仍靠旋轉 `ADMIN_PASSWORD` 或先在本機／有磁碟主機更新）。
- 請在 Vercel **Settings → Environment Variables**（或本機 `.env.local`）至少設定 **`ADMIN_SESSION_SECRET`**；並在尚無「已儲存雜湊」時設定 **`ADMIN_PASSWORD`** 作為初始登入：
  - **`ADMIN_SESSION_SECRET`**：簽署登入 Cookie 用密鑰（建議至少 32 字元隨機字串）
  - **`ADMIN_PASSWORD`**：初次登入或未匯入雜湊前使用（請使用足夠強的密碼）；若已改用雜湊儲存，登入將以儲存的雜湊為準。
- 可複製專案內 **`.env.example`** 的變數名稱；請勿把真實密碼提交到 Git。
- **`/news/manage`**：最新消息後台（與活動剪影、公益商品相同需管理員登入）；內容仍主要存在訪客 **瀏覽器 localStorage**。
- **聯絡我們表單（`/contact`）**：訪客送出留言先到 **`POST /api/contact`**，內容會寫入 **Upstash Redis**（與上列 **`UPSTASH_REDIS_REST_*`** 相同設定；列表鍵由程式維護）。管理者登入後可至 **`/contact/manage`** 在網頁上檢視留言，**不必依賴電子郵件**。
  - **本機開發**：若未設定 Redis，留言會寫入 **`data/contact-inbox.jsonl`**（勿提交版控）。
  - **選填**：若仍想收到信，可設定 **`WEB3FORMS_ACCESS_KEY`** 或 **`RESEND_API_KEY`** + **`CONTACT_TO_EMAIL`**（儲存成功後額外嘗試寄信，寄信失敗不影響站內已存留言）。
- `/products/manage`、`/gallery/manage` 等編輯內容目前主要存在訪客 **瀏覽器 localStorage**，**不會**因為換網域就自動出現在每位訪客電腦上。
- 正式上線若希望「全站訪客看到同一份商品／相簿／消息」，需要之後改為 **伺服器或雲端儲存**（可再規劃下一階段）。

---

## 七、驗證清單

- [ ] `https://你的網域` 可開啟首頁
- [ ] `www` 與非 `www` 是否如預期導向同一網址
- [ ] 手機開啟排版正常
- [ ] 管理員登入：未登入時無法開啟 `/gallery/manage`、`/products/manage`、**`/news/manage`**、**`/contact/manage`**
- [ ] 聯絡我們：已設定 **Upstash Redis**（與變更密碼相同）；測試公開頁送出後，登入 **`/contact/manage`** 可看到新留言
- [ ] （選）聯絡我們額外寄信：已設定 `WEB3FORMS_ACCESS_KEY` 或 `RESEND_API_KEY` + `CONTACT_TO_EMAIL` 者，可確認是否收到通知信
- [ ] （選）已登入時可進入 **`/admin/change-password`** 變更密碼：Vercel 請確認 Upstash Redis 環境變數已設定
- [ ] **`NEXT_PUBLIC_SITE_URL`**（建議）：設定後檢查 `https://你的網域/sitemap.xml` 是否為預期正式網址

---

## 參考（官方文件）

- [Vercel：Custom Domains](https://vercel.com/docs/concepts/projects/domains)
- [Vercel：DNS 與網域疑難排解](https://vercel.com/docs/concepts/projects/domains/troubleshooting)
