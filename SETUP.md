# 英文學習 App - 設置指南

## 1. 建立 Supabase 專案

1. 前往 [Supabase](https://app.supabase.com) 並登入或註冊
2. 點擊 "New Project" 建立新專案
3. 填寫專案資訊：
   - **Name**: learn-en (或任何你喜歡的名稱)
   - **Database Password**: 設定一個強密碼（請記住這個密碼）
   - **Region**: 選擇離你最近的區域（建議：Southeast Asia (Singapore)）
4. 點擊 "Create new project" 並等待專案建立完成（約 1-2 分鐘）

## 2. 取得 API 憑證

專案建立完成後：

1. 在左側選單點擊 **Settings** (齒輪圖示)
2. 點擊 **API**
3. 你會看到以下資訊：
   - **Project URL**: 類似 `https://xxxxx.supabase.co`
   - **anon public** key: 一長串的字串

4. 複製這些資訊到你的 `.env` 文件：

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=你的_anon_key
```

## 3. 執行資料庫 Migration

1. 在 Supabase 控制台，點擊左側選單的 **SQL Editor**
2. 點擊 "New query"
3. 複製 `supabase/migrations/20250120000000_initial_schema.sql` 的內容
4. 貼到 SQL 編輯器中
5. 點擊 "Run" 執行 SQL

你應該會看到成功訊息，並且建立了以下表格：
- `profiles` - 用戶資料
- `flashcards` - 單字卡
- `learning_progress` - 學習進度
- `daily_words` - 每日單字
- `user_stats` - 用戶統計

## 4. 驗證設置

執行以下命令來測試連接：

```bash
node scripts/run-migration.js
```

如果設置正確，你應該會看到：
```
✅ Connected to Supabase successfully!
```

## 5. 啟動應用

```bash
npm start
```

然後選擇你要運行的平台：
- 按 `i` 啟動 iOS 模擬器
- 按 `a` 啟動 Android 模擬器
- 按 `w` 在瀏覽器中打開

## 6. 第一次使用

1. 應用會自動導向登入頁面
2. 點擊 "註冊" 建立新帳號
3. 填寫：
   - 電子郵件
   - 密碼（至少 6 個字元）
   - 顯示名稱（選填）
4. 註冊後需要驗證電子郵件
5. 驗證完成後即可登入使用

## 故障排除

### 連接失敗
- 檢查 `.env` 文件中的 URL 和 KEY 是否正確
- 確保 URL 以 `https://` 開頭
- 確保沒有多餘的空格或引號

### SQL 執行失敗
- 確保你的 Supabase 專案已完全啟動
- 嘗試分段執行 SQL（先執行表格建立，再執行 RLS policies）
- 檢查是否有語法錯誤

### 註冊/登入失敗
- 檢查 Supabase Authentication 是否已啟用
- 在 Supabase 控制台 > Authentication > Providers 中確認 Email 已啟用
- 檢查電子郵件設定（可能需要驗證）

## 資料庫管理

### 查看資料

在 Supabase 控制台中：
1. 點擊 **Table Editor**
2. 選擇要查看的表格
3. 可以直接編輯、新增、刪除資料

### 備份資料

1. 點擊 **Database**
2. 點擊 **Backups**
3. 可以建立手動備份或設定自動備份

## 下一步

現在你已經完成基本設置！可以開始：
- 新增測試單字卡
- 測試每日單字生成功能
- 體驗 SRS 複習系統
- 自訂學習目標和難度等級

如有問題，請參考：
- [Supabase 官方文件](https://supabase.com/docs)
- [Expo 官方文件](https://docs.expo.dev)
