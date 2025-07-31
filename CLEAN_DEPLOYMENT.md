# 🚀 乾淨的 Vercel 部署

## ✅ 已清理問題

我已經移除了所有 Next.js 相關的配置，現在是純 React + Vite 專案。

## 🔑 Vercel 部署設定

### Framework 設定
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 環境變數設定
只需要設定這 3 個：

```
VITE_OPENAI_API_KEY = sk-your-openai-api-key
VITE_GOOGLE_CLIENT_ID = your-google-client-id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET = your-google-client-secret
```

## ⚠️ 重要

**不要設定任何 NEXTAUTH 相關的環境變數！**

現在系統使用：
- React + Vite (不是 Next.js)
- Google Identity Services (不是 NextAuth)
- 客戶端認證 (不是伺服器端)

## 🧪 部署測試

1. 推送程式碼到 GitHub
2. 在 Vercel 匯入專案
3. 選擇 Framework: `Vite`
4. 設定 3 個環境變數
5. 部署

**不會再有 NEXTAUTH 錯誤！** ✅