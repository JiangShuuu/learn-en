# English Learning App (Learn-EN)

一個基於 React Native (Expo) 的英文學習應用，採用前後端分離架構，使用間隔重複系統 (SRS) 來優化學習效率。

## ✨ 功能特色

- 📚 **單字卡管理** - 儲存和管理英文單字卡
- 🧠 **智能學習系統** - 基於 SM-2 演算法的間隔重複學習
- 📅 **每日單字** - 自動生成每日學習單字（預設 20 個）
- 🔊 **語音功能** - Text-to-Speech 單字和例句發音
- 📊 **學習統計** - 追蹤學習進度和成就
- 🌓 **深色模式** - 支援明暗主題切換
- 📱 **跨平台** - iOS、Android、Web 全平台支援

## 🏗️ 架構

### 前端技術棧
- **React Native** (Expo) - 跨平台移動應用框架
- **TypeScript** - 類型安全的 JavaScript
- **Expo Router** - 檔案路由系統
- **Zustand** - 輕量級狀態管理
- **Axios** - HTTP 客戶端
- **Expo Speech** - 文字轉語音

### 後端需求
前端已完成並準備好與後端 API 整合。後端需要實現以下功能：

- 用戶認證 (JWT)
- 單字卡 CRUD
- 學習進度追蹤
- 每日單字生成
- 統計資料計算

詳細的 API 規格請參考 [API_SPEC.md](./API_SPEC.md)

## 📁 專案結構

```
learn-en/
├── app/                    # 應用頁面
│   ├── (auth)/            # 認證相關頁面
│   │   ├── login.tsx      # 登入頁
│   │   └── signup.tsx     # 註冊頁
│   ├── (tabs)/            # Tab 導航頁面
│   │   ├── index.tsx      # 首頁（每日單字）
│   │   └── explore.tsx    # 探索頁
│   └── _layout.tsx        # 根路由
├── components/            # React 元件
├── constants/            # 常數定義
│   ├── theme.ts          # 主題配置
│   └── vocabulary.ts     # 詞彙相關常數
├── lib/                  # 核心庫
│   ├── api-client.ts     # API 客戶端
│   └── auth-store.ts     # 認證狀態管理
├── services/             # 業務邏輯服務
│   ├── database.ts       # 資料庫服務（API 調用）
│   ├── dictionary-api.ts # 字典 API
│   └── daily-words-generator.ts # 每日單字生成
├── types/                # TypeScript 類型定義
│   └── index.ts          # 全域類型
├── utils/                # 工具函數
│   └── srs-algorithm.ts  # SRS 演算法
└── API_SPEC.md          # 後端 API 規格文檔
```

## 🚀 開始使用

### 前置需求

- Node.js 18+
- npm 或 yarn
- Expo CLI
- iOS Simulator / Android Emulator (或實體設備)

### 安裝步驟

1. **Clone 專案**
```bash
git clone <repository-url>
cd learn-en
```

2. **安裝依賴**
```bash
npm install
```

3. **設定環境變數**

複製 `.env.example` 為 `.env` 並填入後端 API URL：

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

4. **啟動開發伺服器**
```bash
npm start
```

5. **選擇平台**
- 按 `i` 開啟 iOS 模擬器
- 按 `a` 開啟 Android 模擬器
- 按 `w` 在瀏覽器中開啟

## 🔧 開發指南

### 可用腳本

- `npm start` - 啟動 Expo 開發伺服器
- `npm run ios` - 直接在 iOS 上運行
- `npm run android` - 直接在 Android 上運行
- `npm run web` - 在瀏覽器中運行
- `npm run lint` - 執行 ESLint

### API 整合

前端使用 Axios 進行 API 調用。所有 API 調用都通過 `lib/api-client.ts` 統一管理。

認證 token 會自動附加到請求 header 中：
```typescript
Authorization: Bearer {token}
```

### 狀態管理

使用 Zustand 進行全域狀態管理。主要的 store：

- `useAuthStore` - 用戶認證狀態

### 路由保護

`app/_layout.tsx` 實現了路由保護邏輯：
- 未認證用戶會被重定向到登入頁
- 已認證用戶會被重定向到主頁

## 📱 主要功能

### 1. 用戶認證
- 註冊新帳號
- 登入/登出
- Token 自動管理

### 2. 單字卡系統
- 查看共享單字卡
- 創建自訂單字卡
- 依難度分級 (CEFR: A1-C2)
- 包含發音、定義、例句

### 3. 學習系統
- SM-2 間隔重複演算法
- 自動計算下次複習時間
- 學習狀態追蹤 (new/learning/familiar/mastered)

### 4. 每日單字
- 自動生成每日學習目標
- 混合新單字與複習單字
- 依難度漸進學習

### 5. 統計追蹤
- 總學習單字數
- 學習進度百分比
- 連續學習天數
- 複習次數統計

## 🎨 設計系統

### 主題
- 支援明暗主題
- 使用 React Navigation 主題系統
- 自適應系統主題

### CEFR 難度等級
- **A1** - 基礎入門
- **A2** - 初級
- **B1** - 中級
- **B2** - 中高級
- **C1** - 高級
- **C2** - 精通

### 單字類型
名詞、動詞、形容詞、副詞、代名詞、介系詞、連接詞、感嘆詞

## 🔐 安全性

- JWT Token 認證
- Token 存儲在 AsyncStorage (加密)
- API 請求攔截器自動處理 401 錯誤
- 自動清除過期認證資訊

## 📚 相關資源

- [Expo 文檔](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [Free Dictionary API](https://dictionaryapi.dev)
- [SM-2 演算法](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2)

## 🤝 後端開發

後端需要實現 `API_SPEC.md` 中定義的所有 endpoints。建議技術棧：

- **Node.js + Express** 或 **Nest.js**
- **PostgreSQL** 或 **MongoDB**
- **JWT** 認證
- **Prisma** 或 **TypeORM** (ORM)

資料庫 Schema 可參考 `.backup/supabase-old/supabase/migrations/20250120000000_initial_schema.sql`

## 📝 待辦事項

- [ ] 實現 Flashcard UI 元件
- [ ] 建立首頁（每日單字展示）
- [ ] 建立單字卡庫頁面
- [ ] 實現手動新增單字功能
- [ ] 建立個人檔案/設定頁面
- [ ] 測試和優化

## 📄 授權

[選擇適當的授權]

## 👥 貢獻

歡迎提交 Issues 和 Pull Requests！
