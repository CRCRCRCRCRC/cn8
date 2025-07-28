# 🚀 快速啟動指南

## 問題修復

如果遇到編譯錯誤，請按照以下步驟操作：

### 1. 清理並重新安裝
```bash
# 刪除 node_modules 和 .next
rm -rf node_modules .next
npm install
```

### 2. 設定環境變數
確保 `.env.local` 文件存在並包含：
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. 重新啟動開發服務器
```bash
npm run dev
```

## 測試功能

### 開發者模式測試
1. 訪問 http://localhost:3000
2. 點擊「開始分析」
3. 在登入頁面點擊「是開發團隊嗎？」
4. 輸入測試碼：`howard is a pig`
5. 成功後會進入開發模式

### Google 登入測試
1. 設定 Google OAuth 憑證
2. 測試正常登入流程
3. 驗證積分系統

## 常見問題

### 編譯錯誤
- 確保所有文件使用 UTF-8 編碼
- 清理 .next 緩存目錄
- 重新安裝依賴

### NextAuth 警告
- 設定正確的 NEXTAUTH_URL
- 生成隨機的 NEXTAUTH_SECRET

### 樣式問題
- 確認 Tailwind CSS 正確載入
- 檢查自定義 CSS 類別

## 部署準備

1. 設定 Google OAuth 生產環境憑證
2. 在 Vercel 設定環境變數
3. 測試所有功能
4. 部署到生產環境

---

如有問題，請檢查控制台錯誤訊息並參考 README.md 詳細說明。