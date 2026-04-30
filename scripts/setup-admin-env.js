// 這裡是「本機唯一一次」建立 .env.local，避免誤删既有密鑰後直接覆寫
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
  console.log('[setup-admin-env] .env.local 已存在，未覆寫。若要重建請先備份並刪除該檔後再執行。');
  process.exit(0);
}

const ADMIN_SESSION_SECRET = crypto.randomBytes(32).toString('hex');
const ADMIN_PASSWORD = 'Local_' + crypto.randomBytes(9).toString('base64url');

const body = `# 本機開發：管理員登入（已列入 .gitignore，請勿提交到 Git）
ADMIN_PASSWORD=${ADMIN_PASSWORD}
ADMIN_SESSION_SECRET=${ADMIN_SESSION_SECRET}
`;

fs.writeFileSync(envPath, body, 'utf8');
console.log('[setup-admin-env] 已建立 .env.local');
console.log('[setup-admin-env] 本機管理密碼（請自行保存）：' + ADMIN_PASSWORD);
console.log('[setup-admin-env] 登入：http://localhost:3000/admin/login');
