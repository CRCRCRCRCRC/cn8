# Google OAuth 錯誤修復指南

## 🚨 錯誤分析

**錯誤訊息：** `no registered origin` 和 `invalid_client`
**錯誤代碼：** 401

這表示您的 Google Cloud Console 設定中缺少正確的授權來源。

## 🔧 立即修復步驟

### 1. 前往 Google Cloud Console
訪問：https://console.cloud.google.com/

### 2. 選擇正確的專案
確保您在正確的 Google Cloud 專案中

### 3. 前往 API 和服務 → 憑證
路徑：`API 和服務` → `憑證`

### 4. 編輯 OAuth 2.0 客戶端
找到您的 OAuth 2.0 客戶端 ID 並點擊編輯

### 5. 設定授權的 JavaScript 來源
**重要：** 在「授權的 JavaScript 來源」中添加以下網址：

```
https://cn89.vercel.app
http://localhost:3000
```

**注意事項：**
- ✅ 使用 `https://` 而不是 `http://`（生產環境）
- ✅ 不要在網址末尾加斜線 `/`
- ✅ 確保域名完全正確

### 6. 已授權的重新導向 URI（可選）
對於新版 Google Identity Services，通常不需要設定重新導向 URI。
如果系統要求，可以添加：
```
https://cn89.vercel.app
```

### 7. 儲存設定
點擊「儲存」按鈕

## 🔍 驗證設定

### 檢查客戶端 ID
確保您的客戶端 ID 格式正確：
```
955932491188-9oulncb2e97lfbj5sujtqnjqv1m69mr4.apps.googleusercontent.com
```

### 檢查 Vercel 環境變數
在 Vercel 控制台確認：
```
VITE_GOOGLE_CLIENT_ID=955932491188-9oulncb2e97lfbj5sujtqnjqv1m69mr4.apps.googleusercontent.com
```

## 🚀 測試步驟

1. **完成上述設定後**
2. **等待 5-10 分鐘**（Google 設定需要時間生效）
3. **重新部署 Vercel 應用程式**
4. **清除瀏覽器快取**
5. **測試 Google 登入**

## 📋 完整的 Google Cloud Console 設定檢查清單

### OAuth 2.0 客戶端設定
- [ ] 應用程式類型：網路應用程式
- [ ] 名稱：任意（例如：Taiwan Defense System）
- [ ] 授權的 JavaScript 來源：
  - [ ] `https://cn89.vercel.app`
  - [ ] `http://localhost:3000`
- [ ] 已授權的重新導向 URI：留空或設為 `https://cn89.vercel.app`

### API 啟用狀態
- [ ] Google Identity Services API 已啟用
- [ ] Google+ API 已啟用（如果需要）

### OAuth 同意畫面
- [ ] 已設定 OAuth 同意畫面
- [ ] 應用程式名稱已填寫
- [ ] 支援電子郵件已設定

## 🔧 積分扣除問題已修復

我已經修改了積分扣除邏輯：
- ✅ **成功分析後才扣點**
- ✅ **錯誤時不扣點**
- ✅ **先檢查積分，後執行分析**

## 📞 如果仍有問題

請檢查：
1. Google Cloud Console 設定是否正確
2. 是否等待了足夠的時間讓設定生效
3. 瀏覽器快取是否已清除
4. Vercel 環境變數是否正確

設定完成後，Google 登入應該可以正常工作！🎉