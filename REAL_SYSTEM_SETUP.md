# 🔥 真實系統設定指南

## ✅ 完整真實功能

現在系統包含：
- 🔐 **真實 Google OAuth 登入**
- 💰 **真實積分系統**（每月 1000 積分）
- 🤖 **真實 OpenAI API**
- 📊 **真實價格數據**（investing.com）
- 📰 **真實新聞數據**（Google News）

## 🔑 必要環境變數

建立 `.env.local` 文件：

```env
# OpenAI API Key (必要)
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here

# Google OAuth (必要)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## 📋 設定步驟

### 1. OpenAI API 設定
1. 前往 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 建立新的 API 金鑰
3. 複製金鑰到 `.env.local`

### 2. Google OAuth 設定
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案
3. 啟用 Google Identity API
4. 建立 OAuth 2.0 憑證
5. 設定授權網域：
   - 本地：`http://localhost:3000`
   - 生產：`https://your-domain.vercel.app`
6. 複製 Client ID 到 `.env.local`

### 3. 啟動系統
```bash
npm install
npm run dev
```

## 🎮 真實功能測試

### Google 登入測試
1. 訪問 `/login`
2. 點擊 Google 登入按鈕
3. 完成 OAuth 流程
4. 自動獲得 1000 積分

### 積分系統測試
- 每月自動重置為 1000 積分
- 不同 AI 模型消耗不同積分
- 積分不足時無法使用分析

### AI 分析測試
- 使用真實 OpenAI GPT-4 API
- 基於真實價格和新聞數據
- 專業台海情勢分析

## 🌐 Vercel 部署

### 環境變數設定
在 Vercel 專案設定中添加：
```
VITE_OPENAI_API_KEY = sk-your-openai-key
VITE_GOOGLE_CLIENT_ID = your-google-client-id
```

### Google OAuth 生產設定
在 Google Cloud Console 添加生產網域：
```
https://your-project-name.vercel.app
```

## 🎯 完整功能清單

✅ **真實 Google OAuth 登入**
✅ **月度積分系統**（1000 積分/月）
✅ **真實 OpenAI API 調用**
✅ **真實價格數據**（investing.com）
✅ **真實新聞搜尋**（Google News）
✅ **積分歷史記錄**
✅ **自動積分重置**
✅ **開發者模式**（測試碼：`howard is a pig`）

## 🔧 故障排除

### Google 登入失敗
- 檢查 Client ID 設定
- 確認網域已授權
- 檢查瀏覽器控制台錯誤

### OpenAI API 錯誤
- 檢查 API 金鑰有效性
- 確認帳戶有足夠額度
- 檢查 API 使用限制

---

**現在系統完全使用真實 API，沒有任何模擬功能！** 🚀