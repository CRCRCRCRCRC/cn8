# 部署檢查清單

## 📋 部署前檢查

### 1. 環境變數設定
- [ ] 複製 `.env.example` 為 `.env.local`
- [ ] 設定 `NEXTAUTH_SECRET` (可使用 `openssl rand -base64 32` 生成)
- [ ] 設定 Google OAuth 憑證
  - [ ] `GOOGLE_CLIENT_ID`
  - [ ] `GOOGLE_CLIENT_SECRET`

### 2. Google OAuth 設定
- [ ] 在 Google Cloud Console 建立專案
- [ ] 啟用 Google+ API
- [ ] 建立 OAuth 2.0 憑證
- [ ] 設定授權重新導向 URI：
  - 開發: `http://localhost:3000/api/auth/callback/google`
  - 生產: `https://your-domain.vercel.app/api/auth/callback/google`

### 3. 本地測試
- [ ] `npm install` 安裝依賴
- [ ] `npm run dev` 啟動開發伺服器
- [ ] 測試 Google 登入功能
- [ ] 測試開發者模式 (測試碼: `howard is a pig`)
- [ ] 測試 AI 分析功能
- [ ] 測試價格卡片顯示

### 4. Vercel 部署
- [ ] 推送程式碼到 GitHub
- [ ] 在 Vercel 匯入專案
- [ ] 設定生產環境變數：
  - [ ] `NEXTAUTH_URL=https://your-domain.vercel.app`
  - [ ] `NEXTAUTH_SECRET`
  - [ ] `GOOGLE_CLIENT_ID`
  - [ ] `GOOGLE_CLIENT_SECRET`
- [ ] 部署並測試

## 🧪 功能測試清單

### 使用者流程
- [ ] 未登入用戶點擊「開始分析」顯示登入提示
- [ ] Google 登入流程正常
- [ ] 登入後顯示積分餘額
- [ ] 選擇 AI 模型並執行分析
- [ ] 分析結果正確顯示
- [ ] 積分正確扣除

### 開發者模式
- [ ] 測試碼驗證正常
- [ ] 開發模式顯示無限積分
- [ ] 可正常執行分析

### 界面測試
- [ ] 響應式設計在行動裝置正常
- [ ] 賽博龐克風格動畫流暢
- [ ] 價格卡片正常更新
- [ ] 所有按鈕和連結正常運作

## 🚀 快速部署指令

```bash
# 1. 安裝依賴
npm install

# 2. 建置專案
npm run build

# 3. 啟動生產伺服器 (本地測試)
npm start

# 4. 部署到 Vercel
npx vercel --prod
```

## 🔧 故障排除

### 常見問題
1. **Google 登入失敗**: 檢查 OAuth 設定和重新導向 URI
2. **環境變數錯誤**: 確認 Vercel 環境變數設定正確
3. **樣式問題**: 確認 Tailwind CSS 正確建置
4. **API 錯誤**: 檢查 API 路由和錯誤處理

### 除錯工具
- 瀏覽器開發者工具
- Vercel 部署日誌
- Next.js 錯誤頁面

## ✅ 部署完成確認

- [ ] 網站可正常訪問
- [ ] 所有功能正常運作
- [ ] 效能表現良好
- [ ] 無控制台錯誤
- [ ] 行動裝置相容性良好

---

**注意**: 部署前請確保所有測試都通過，並在生產環境中進行最終驗證。