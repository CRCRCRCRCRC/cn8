# 🔑 環境變數設定指南

## 必要環境變數

### 1. NextAuth 基本配置
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
```

**說明：**
- `NEXTAUTH_URL`：應用程式的完整 URL
  - 本地開發：`http://localhost:3000`
  - Vercel 部署：`https://your-domain.vercel.app`
- `NEXTAUTH_SECRET`：用於加密 JWT 的密鑰

### 2. OpenAI API（AI 分析功能）
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**說明：**
- 用於真實 AI 分析功能
- 如果不設定，系統會使用備用分析

## 可選環境變數

### 3. Google OAuth（登入功能）
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**說明：**
- 用於 Google 登入功能
- 如果不設定，仍可使用開發者模式（測試碼：`howard is a pig`）

## 🔧 如何獲取這些值

### NEXTAUTH_SECRET 生成
```bash
# 方法 1: 使用 OpenSSL
openssl rand -base64 32

# 方法 2: 使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 方法 3: 線上生成器
# 訪問 https://generate-secret.vercel.app/32
```

### OpenAI API Key
1. 前往 [OpenAI Platform](https://platform.openai.com/)
2. 註冊/登入帳號
3. 前往 [API Keys](https://platform.openai.com/api-keys)
4. 點擊 "Create new secret key"
5. 複製生成的 API 金鑰

### Google OAuth 憑證
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 Google+ API
4. 前往「憑證」→「建立憑證」→「OAuth 2.0 用戶端 ID」
5. 設定授權重新導向 URI：
   - 本地：`http://localhost:3000/api/auth/callback/google`
   - 生產：`https://your-domain.vercel.app/api/auth/callback/google`

## 📁 .env.local 範例

```env
# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-key-here

# OpenAI API（必要，用於 AI 分析）
OPENAI_API_KEY=sk-your-openai-api-key-here

# Google OAuth（可選，用於登入）
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🌐 Vercel 部署環境變數

在 Vercel 專案設定中添加：

### 必要變數
```
NEXTAUTH_URL = https://your-domain.vercel.app
NEXTAUTH_SECRET = your-generated-secret-key
OPENAI_API_KEY = sk-your-openai-api-key
```

### 可選變數
```
GOOGLE_CLIENT_ID = your-google-client-id
GOOGLE_CLIENT_SECRET = your-google-client-secret
```

## 🧪 功能對應

### 只設定必要變數
- ✅ 賽博龐克界面
- ✅ 價格監控（黃金、小麥）
- ✅ 開發者模式（測試碼登入）
- ✅ AI 分析（使用 OpenAI）
- ❌ Google 登入

### 設定所有變數
- ✅ 完整功能
- ✅ Google 登入
- ✅ 積分系統
- ✅ 使用者管理
- ✅ 所有 AI 分析功能

## 🔒 安全注意事項

1. **不要提交 .env.local**：已在 .gitignore 中排除
2. **定期更換密鑰**：特別是 NEXTAUTH_SECRET
3. **限制 API 使用**：在 OpenAI 設定使用限制
4. **監控使用量**：定期檢查 API 使用情況

---

**最少只需要 3 個環境變數就能完整運行！** 🚀