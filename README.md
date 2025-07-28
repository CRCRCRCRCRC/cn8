# 台灣防衛情勢感知系統 (Taiwan Defense Awareness System)

一個基於 AI 的台海情勢分析系統，提供即時威脅評估、市場指標監控和綜合分析報告。

## 🚀 功能特色

- **AI 驅動分析**: 支援多種 AI 模型進行深度情勢分析
- **使用者管理**: Google OAuth 登入 + 月度積分制度
- **即時監控**: 黃金和小麥價格即時追蹤
- **賽博龐克風格**: 現代化響應式界面設計
- **開發者模式**: 測試碼入口，無限積分使用

## 🛠️ 技術棧

- **前端**: Next.js 14, React 18, TypeScript
- **樣式**: Tailwind CSS, Framer Motion
- **認證**: NextAuth.js (Google OAuth)
- **部署**: Vercel
- **圖標**: Lucide React

## 📦 安裝與設定

### 1. 克隆專案

```bash
git clone <repository-url>
cd taiwan-defense-awareness-system
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 環境變數設定

複製 `.env.example` 為 `.env.local` 並填入必要資訊：

```bash
cp .env.example .env.local
```

編輯 `.env.local`：

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4. Google OAuth 設定

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 Google+ API
4. 建立 OAuth 2.0 憑證
5. 設定授權重新導向 URI：
   - 開發環境: `http://localhost:3000/api/auth/callback/google`
   - 生產環境: `https://your-domain.vercel.app/api/auth/callback/google`

### 5. 啟動開發伺服器

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看結果。

## 🚀 部署到 Vercel

### 自動部署

1. 將程式碼推送到 GitHub
2. 在 [Vercel](https://vercel.com) 匯入專案
3. 設定環境變數
4. 部署完成

### 手動部署

```bash
npm run build
npx vercel --prod
```

### 環境變數設定 (Vercel)

在 Vercel 專案設定中新增以下環境變數：

- `NEXTAUTH_URL`: `https://your-domain.vercel.app`
- `NEXTAUTH_SECRET`: 隨機生成的密鑰
- `GOOGLE_CLIENT_ID`: Google OAuth 客戶端 ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth 客戶端密鑰

## 🎮 使用說明

### 一般使用者

1. 點擊「開始分析」按鈕
2. 使用 Google 帳號登入
3. 選擇 AI 分析模型
4. 查看分析結果和市場指標

### 開發者模式

1. 在登入頁面點擊「是開發團隊嗎？」
2. 輸入測試碼：`howard is a pig`
3. 進入開發模式（無限積分）

## 💰 積分系統

每個 Google 帳號每月有 **1000 積分**，不同 AI 模型消耗積分如下：

| 模型 | 消耗積分 |
|------|----------|
| GPT-4.1 Nano | 2.5 |
| O4 Mini | 27.5 |
| O3 | 50 |
| O3 Pro | 500 |
| O3 Deep Research | 250 |
| O4 Mini Deep Research | 50 |

## 🎨 設計特色

- **賽博龐克風格**: 霓虹色彩配色方案
- **動畫效果**: Framer Motion 流暢動畫
- **響應式設計**: 支援桌面和行動裝置
- **深色主題**: 護眼的深色界面

## 📁 專案結構

```
├── app/
│   ├── api/                 # API 路由
│   │   ├── auth/           # NextAuth 配置
│   │   ├── analysis/       # AI 分析 API
│   │   ├── prices/         # 價格數據 API
│   │   └── user/           # 使用者相關 API
│   ├── components/         # React 組件
│   ├── login/              # 登入頁面
│   ├── dev-auth/           # 開發者驗證頁面
│   ├── globals.css         # 全域樣式
│   ├── layout.tsx          # 根佈局
│   ├── page.tsx            # 首頁
│   └── providers.tsx       # Context Providers
├── types/                  # TypeScript 類型定義
├── public/                 # 靜態資源
└── 配置文件...
```

## 🔧 開發指令

```bash
# 開發模式
npm run dev

# 建置專案
npm run build

# 啟動生產伺服器
npm run start

# 程式碼檢查
npm run lint
```

## 🐛 故障排除

### 常見問題

1. **Google 登入失敗**
   - 檢查 Google OAuth 設定
   - 確認重新導向 URI 正確
   - 驗證環境變數設定

2. **積分系統異常**
   - 清除瀏覽器快取
   - 檢查 API 路由是否正常

3. **樣式顯示異常**
   - 確認 Tailwind CSS 正確載入
   - 檢查字體檔案是否可存取

## 📄 授權

此專案僅供學習和研究用途。

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📞 聯絡資訊

如有問題請聯絡開發團隊。

---

**注意**: 此系統提供的分析結果僅供參考，不構成任何投資或政策建議。