#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 台灣防衛情勢感知系統 - 初始化設定\n');

// 檢查是否存在 .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 建立 .env.local 檔案...');
  
  if (fs.existsSync(envExamplePath)) {
    // 讀取範例檔案
    let envContent = fs.readFileSync(envExamplePath, 'utf8');
    
    // 生成隨機的 NEXTAUTH_SECRET
    const secret = crypto.randomBytes(32).toString('base64');
    envContent = envContent.replace('your-nextauth-secret-here', secret);
    
    // 寫入 .env.local
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env.local 檔案已建立');
    console.log('🔑 已自動生成 NEXTAUTH_SECRET');
  } else {
    console.log('❌ 找不到 .env.example 檔案');
  }
} else {
  console.log('✅ .env.local 檔案已存在');
}

console.log('\n📋 接下來的步驟：');
console.log('1. 編輯 .env.local 檔案，填入 Google OAuth 憑證');
console.log('2. 執行 npm install 安裝依賴');
console.log('3. 執行 npm run dev 啟動開發伺服器');
console.log('\n🔗 Google OAuth 設定指南：');
console.log('https://console.cloud.google.com/');
console.log('\n🎮 測試碼：howard is a pig');
console.log('\n🌟 系統已準備就緒！');