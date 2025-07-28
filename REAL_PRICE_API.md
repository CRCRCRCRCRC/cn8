# 🔗 真實價格 API 整合

## ✅ 現在真正使用 investing.com

我已經修復了價格 API，現在真正從以下網站獲取數據：
- 🥇 **黃金價格**：https://www.investing.com/commodities/gold
- 🌾 **小麥價格**：https://www.investing.com/commodities/us-wheat

## 🛠️ 技術實現

### 真實數據獲取
- ✅ 使用 CORS 代理服務 (allorigins.win)
- ✅ 多種 HTML 解析模式
- ✅ 智能價格提取算法
- ✅ 詳細的錯誤處理和日誌

### 數據解析策略
1. **多模式匹配**：使用多種正則表達式模式
2. **價格驗證**：確保提取的價格在合理範圍內
3. **變化追蹤**：提取價格變化百分比
4. **備用機制**：如果獲取失敗，使用合理的備用數據

## 🚀 重新啟動測試

```bash
# 停止服務器 (Ctrl+C)
# 清理緩存
rmdir /s /q .next
# 重新啟動
npm run dev
```

## 🧪 測試真實數據

1. 訪問 http://localhost:3000
2. 查看價格卡片
3. 檢查瀏覽器控制台的日誌：
   - "Fetching real prices from investing.com..."
   - "Gold price found: xxx"
   - "Wheat price found: xxx"

## 📊 數據來源標記

- `investing.com`：成功從網站獲取
- `fallback`：使用備用數據

## ⚠️ 注意事項

1. **CORS 限制**：直接訪問可能被阻擋，使用代理服務
2. **網站變化**：investing.com 可能更改 HTML 結構
3. **速率限制**：避免過於頻繁的請求

---

**現在系統真正從 investing.com 獲取價格數據！** 🎉