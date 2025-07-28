# 🔄 Windows 修復指令

## Windows 專用修復步驟

### 步驟 1：完全停止服務器
在終端機按 `Ctrl+C` 停止當前的開發服務器

### 步驟 2：清理緩存 (Windows 指令)
```cmd
rmdir /s /q .next
```

### 步驟 3：重新啟動
```cmd
npm run dev
```

## 🚀 替代方案

如果 rmdir 指令有問題，可以：

### 方案 A：手動刪除
1. 在檔案總管中找到專案資料夾
2. 刪除 `.next` 資料夾
3. 重新執行 `npm run dev`

### 方案 B：PowerShell 指令
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

### 方案 C：直接重新啟動
有時候直接重新啟動就足夠了：
```cmd
npm run dev
```

## 🎯 預期結果

重新啟動後，您應該看到：
- ✅ 編譯成功，無錯誤訊息
- ✅ 可以訪問 http://localhost:3000
- ✅ 價格卡片正常顯示
- ✅ AI 分析功能正常（有備用機制）

---

**請選擇適合的方法重新啟動！** 🚀