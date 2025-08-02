# Google OAuth 設定指南

## 🔧 Google Cloud Console 設定

### 1. 授權的 JavaScript 來源
在 Google Cloud Console 的 OAuth 2.0 客戶端設定中，添加以下網址：

```
https://cn89.vercel.app
http://localhost:3000
```

### 2. 已授權的重新導向 URI
**重要：** 對於 Google Identity Services (新版本)，**不需要**設定重新導向 URI！

如果系統要求填寫，可以留空或填入：
```
https://cn89.vercel.app
```

但通常新的 Google Identity Services 不需要這個設定。

## 📋 完整設定步驟

### 步驟 1: 前往 Google Cloud Console
1. 訪問 [Google Cloud Console](https://console.cloud.google.com/)
2. 選擇您的專案或建立新專案

### 步驟 2: 啟用 API
1. 前往「API 和服務」→「程式庫」
2. 搜尋並啟用「Google Identity Services」

### 步驟 3: 建立 OAuth 2.0 客戶端
1. 前往「API 和服務」→「憑證」
2. 點擊「建立憑證」→「OAuth 2.0 客戶端 ID」
3. 選擇「網路應用程式」

### 步驟 4: 設定授權來源
在「授權的 JavaScript 來源」中添加：
```
https://cn89.vercel.app
http://localhost:3000
```

### 步驟 5: 重新導向 URI（可選）
- **新版 Google Identity Services：** 通常不需要
- **如果必須填寫：** `https://cn89.vercel.app`

### 步驟 6: 複製客戶端 ID
複製生成的客戶端 ID，格式類似：
```
123456789-abcdefghijklmnop.apps.googleusercontent.com
```

## 🚀 Vercel 環境變數設定

在 Vercel 控制台中設定：
```
VITE_GOOGLE_CLIENT_ID=你的客戶端ID.apps.googleusercontent.com
```

## ✅ 測試檢查清單

1. [ ] Google Cloud Console 中已正確設定授權來源
2. [ ] Vercel 環境變數已設定
3. [ ] 重新部署應用程式
4. [ ] 測試登入功能

## 🎨 按鈕樣式已優化

新的 Google 登入按鈕特色：
- ✨ 漸層背景色彩
- 🎯 圓角藥丸形狀
- 💫 懸停動畫效果
- 🌟 光澤掃過效果
- 📱 響應式設計

## 🔍 故障排除

### 如果登入仍然失敗：

1. **檢查控制台錯誤**
   - 打開瀏覽器開發者工具
   - 查看 Console 標籤的錯誤訊息

2. **常見錯誤解決方案：**
   - `origin_mismatch`: 檢查授權的 JavaScript 來源
   - `invalid_client`: 檢查客戶端 ID 是否正確
   - `access_blocked`: 檢查 OAuth 同意畫面設定

3. **清除瀏覽器快取**
   - 清除 cookies 和本地存儲
   - 重新載入頁面

現在您的 Google 登入應該可以正常工作了！🎉