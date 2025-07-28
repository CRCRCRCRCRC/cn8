# 🔧 安裝依賴修復

## 問題：cheerio 模組未找到

需要安裝新的依賴來支援真實價格數據爬取。

## 🚀 立即修復

### 方法 1：重新安裝所有依賴
```bash
# 停止開發服務器 (Ctrl+C)
# 然後執行：
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 方法 2：手動安裝 cheerio
```bash
# 停止開發服務器 (Ctrl+C)
# 然後執行：
npm install cheerio@1.0.0-rc.12 @types/cheerio@0.22.31
npm run dev
```

### 方法 3：暫時使用備用價格 API
如果安裝有問題，可以暫時使用簡化版本：

1. 暫時重命名價格文件：
```bash
mv app/api/prices/route.ts app/api/prices/route.ts.backup
```

2. 我會創建一個簡化版本

## ✅ 安裝完成後

重新啟動開發服務器：
```bash
npm run dev
```

然後測試：
- 訪問 http://localhost:3000
- 檢查價格卡片是否正常顯示
- 測試 AI 分析功能

---

**選擇方法 1 最保險，會重新安裝所有依賴！** 🚀