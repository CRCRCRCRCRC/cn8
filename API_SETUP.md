# 🔑 API 設定指南

## 現在系統已經整合真實 API！

✅ **AI 分析**：使用 OpenAI GPT-4 進行真實的台海情勢分析  
✅ **價格數據**：從 investing.com 獲取真實的黃金和小麥價格  

## 🚀 立即設定

### 1. OpenAI API 設定 (必要)

1. 前往 [OpenAI Platform](https://platform.openai.com/)
2. 註冊/登入帳號
3. 前往 [API Keys](https://platform.openai.com/api-keys)
4. 點擊 "Create new secret key"
5. 複製 API 金鑰
6. 在 `.env.local` 中設定：
```env
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

### 2. Google OAuth 設定 (可選)

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 Google+ API
4. 建立 OAuth 2.0 憑證
5. 設定授權重新導向 URI：
   - `http://localhost:3000/api/auth/callback/google`
6. 在 `.env.local` 中設定：
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🧪 測試真實功能

### 測試 AI 分析
1. 確保設定了 `OPENAI_API_KEY`
2. 啟動開發模式：
```javascript
localStorage.setItem('devMode', 'true')
window.location.reload()
```
3. 選擇 AI 模型並執行分析
4. 系統會調用真實的 OpenAI API！

### 測試價格數據
- 價格卡片會自動從 investing.com 獲取真實數據
- 如果網站阻擋請求，會自動使用備用數據

## 💰 費用說明

### OpenAI API 費用
- GPT-4：約 $0.03 per 1K tokens
- 一次完整分析約消耗 2000-4000 tokens
- 每次分析成本約 $0.06-0.12

### 建議設定
1. **開發階段**：使用開發者模式測試
2. **生產環境**：設定合理的積分限制
3. **監控使用量**：定期檢查 OpenAI 使用情況

## 🔧 故障排除

### OpenAI API 錯誤
- 檢查 API 金鑰是否正確
- 確認帳戶有足夠額度
- 檢查網路連線

### 價格數據錯誤
- investing.com 可能會阻擋爬蟲
- 系統會自動使用備用數據
- 考慮使用付費金融 API

## 🚀 部署注意事項

### Vercel 環境變數
確保在 Vercel 設定以下環境變數：
- `OPENAI_API_KEY`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID` (可選)
- `GOOGLE_CLIENT_SECRET` (可選)

---

**現在系統使用真實 AI 和價格數據！** 🎉

設定完成後，重新啟動開發服務器：
```bash
npm run dev
```