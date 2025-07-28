# 🔧 立即修復指令

## 問題：cheerio 模組未安裝

請按照以下步驟修復：

### 🚀 方法 1：重新安裝依賴 (推薦)

```bash
# 1. 停止開發服務器 (按 Ctrl+C)

# 2. 刪除舊的依賴並重新安裝
rm -rf node_modules package-lock.json
npm install

# 3. 重新啟動
npm run dev
```

### 🚀 方法 2：只安裝缺少的依賴

```bash
# 1. 停止開發服務器 (按 Ctrl+C)

# 2. 安裝 cheerio
npm install cheerio@1.0.0-rc.12 @types/cheerio@0.22.31

# 3. 重新啟動
npm run dev
```

### 🚀 方法 3：使用簡化版本 (如果上面都失敗)

```bash
# 1. 停止開發服務器 (按 Ctrl+C)

# 2. 使用簡化版價格 API
mv app/api/prices/route.ts app/api/prices/route.ts.backup
mv app/api/prices/route.simple.ts app/api/prices/route.ts

# 3. 重新啟動
npm run dev
```

## ✅ 修復完成後

1. 訪問 http://localhost:3000
2. 檢查價格卡片顯示
3. 測試 AI 分析功能

---

**建議使用方法 1，最穩定！** 🚀

執行完成後，系統就能正常運作了！