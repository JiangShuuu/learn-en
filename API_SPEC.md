# Backend API 規格文檔

## 基本資訊

- **Base URL**: `http://localhost:3000/api` (開發環境)
- **認證方式**: JWT Bearer Token
- **Content-Type**: `application/json`

## 認證 (Authentication)

### 註冊
```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "display_name": "User Name" // 選填
}
```

**Response:** `201 Created`
```json
{
  "message": "註冊成功，請檢查電子郵件進行驗證"
}
```

### 登入
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "display_name": "User Name"
  },
  "profile": {
    "id": "user_id",
    "email": "user@example.com",
    "display_name": "User Name",
    "daily_goal": 20,
    "current_level": "A1",
    "created_at": "2025-01-20T00:00:00.000Z",
    "updated_at": "2025-01-20T00:00:00.000Z"
  }
}
```

### 登出
```
POST /auth/logout
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "message": "登出成功"
}
```

## 用戶資料 (Profile)

### 獲取個人資料
```
GET /profile
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "display_name": "User Name",
  "daily_goal": 20,
  "current_level": "A1",
  "created_at": "2025-01-20T00:00:00.000Z",
  "updated_at": "2025-01-20T00:00:00.000Z"
}
```

### 更新個人資料
```
PATCH /profile
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "display_name": "New Name",
  "daily_goal": 25,
  "current_level": "A2"
}
```

**Response:** `200 OK`
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "display_name": "New Name",
  "daily_goal": 25,
  "current_level": "A2",
  "created_at": "2025-01-20T00:00:00.000Z",
  "updated_at": "2025-01-20T00:00:00.000Z"
}
```

## 單字卡 (Flashcards)

### 獲取共享單字卡
```
GET /flashcards/shared?limit=20
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
[
  {
    "id": "flashcard_id",
    "word": "hello",
    "type": "noun",
    "phonetic": "/həˈloʊ/",
    "audio_url": "https://...",
    "definition_en": "A greeting",
    "definition_zh": "問候語",
    "examples": [
      {
        "sentence_en": "Hello, how are you?",
        "sentence_zh": "你好，你好嗎？"
      }
    ],
    "difficulty_level": "A1",
    "created_at": "2025-01-20T00:00:00.000Z",
    "updated_at": "2025-01-20T00:00:00.000Z",
    "user_id": null,
    "is_shared": true
  }
]
```

### 獲取用戶自訂單字卡
```
GET /flashcards/user/{userId}
Authorization: Bearer {token}
```

### 根據難度獲取單字卡
```
GET /flashcards?difficulty=A1
Authorization: Bearer {token}
```

### 獲取特定單字卡
```
GET /flashcards/{id}
Authorization: Bearer {token}
```

### 創建單字卡
```
POST /flashcards
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "word": "example",
  "type": "noun",
  "phonetic": "/ɪɡˈzæmpəl/",
  "audio_url": "https://...",
  "definition_en": "A thing characteristic of its kind",
  "definition_zh": "例子",
  "examples": [
    {
      "sentence_en": "This is an example.",
      "sentence_zh": "這是一個例子。"
    }
  ],
  "difficulty_level": "B1"
}
```

**Response:** `201 Created`

### 更新單字卡
```
PATCH /flashcards/{id}
Authorization: Bearer {token}
```

### 刪除單字卡
```
DELETE /flashcards/{id}
Authorization: Bearer {token}
```

**Response:** `204 No Content`

## 學習進度 (Learning Progress)

### 獲取用戶學習進度
```
GET /progress/user/{userId}
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
[
  {
    "id": "progress_id",
    "flashcard_id": "flashcard_id",
    "user_id": "user_id",
    "status": "learning",
    "last_reviewed": "2025-01-20T00:00:00.000Z",
    "next_review": "2025-01-21T00:00:00.000Z",
    "ease_factor": 2.5,
    "interval": 1,
    "repetitions": 0,
    "created_at": "2025-01-20T00:00:00.000Z",
    "updated_at": "2025-01-20T00:00:00.000Z"
  }
]
```

### 獲取特定單字卡的進度
```
GET /progress/{flashcardId}
Authorization: Bearer {token}
```

### 創建/更新學習進度
```
POST /progress
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "flashcard_id": "flashcard_id",
  "user_id": "user_id",
  "status": "learning",
  "ease_factor": 2.5,
  "interval": 1,
  "repetitions": 1,
  "next_review": "2025-01-21T00:00:00.000Z"
}
```

### 獲取待復習單字卡
```
GET /progress/due?userId={userId}
Authorization: Bearer {token}
```

### 根據狀態獲取進度
```
GET /progress?userId={userId}&status=learning
Authorization: Bearer {token}
```

## 每日單字 (Daily Words)

### 獲取今日單字
```
GET /daily-words/today
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
[
  {
    "id": "daily_word_id",
    "user_id": "user_id",
    "flashcard_id": "flashcard_id",
    "date": "2025-01-20",
    "completed": false,
    "rating": null,
    "created_at": "2025-01-20T00:00:00.000Z"
  }
]
```

### 批次創建每日單字
```
POST /daily-words/batch
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "words": [
    {
      "user_id": "user_id",
      "flashcard_id": "flashcard_id",
      "date": "2025-01-20",
      "completed": false
    }
  ]
}
```

### 標記單字為已完成
```
PATCH /daily-words/{id}
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "completed": true,
  "rating": 4
}
```

### 獲取單字歷史
```
GET /daily-words/history?userId={userId}&days=7
Authorization: Bearer {token}
```

### 生成每日單字
```
POST /daily-words/generate
Authorization: Bearer {token}
```

**Response:** `201 Created`
```json
[
  {
    "id": "daily_word_id",
    "user_id": "user_id",
    "flashcard_id": "flashcard_id",
    "date": "2025-01-20",
    "completed": false,
    "rating": null,
    "created_at": "2025-01-20T00:00:00.000Z"
  }
]
```

## 統計資料 (Statistics)

### 獲取用戶統計
```
GET /stats/{userId}
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "id": "stats_id",
  "user_id": "user_id",
  "total_words": 100,
  "words_learning": 30,
  "words_familiar": 40,
  "words_mastered": 30,
  "current_streak": 5,
  "longest_streak": 10,
  "total_reviews": 250,
  "last_study_date": "2025-01-20",
  "created_at": "2025-01-20T00:00:00.000Z",
  "updated_at": "2025-01-20T00:00:00.000Z"
}
```

### 更新統計資料
```
PATCH /stats/{userId}
Authorization: Bearer {token}
```

### 增加複習次數
```
POST /stats/{userId}/increment-reviews
Authorization: Bearer {token}
```

### 更新連續天數
```
POST /stats/{userId}/update-streak
Authorization: Bearer {token}
```

### 獲取統計摘要
```
GET /stats/summary
Authorization: Bearer {token}
```

## 錯誤回應格式

所有錯誤都會返回以下格式：

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "錯誤訊息描述"
  }
}
```

### 常見錯誤碼

- `400 Bad Request` - 請求參數錯誤
- `401 Unauthorized` - 未認證或 token 無效
- `403 Forbidden` - 無權限訪問
- `404 Not Found` - 資源不存在
- `409 Conflict` - 資源衝突（如重複註冊）
- `422 Unprocessable Entity` - 驗證錯誤
- `500 Internal Server Error` - 伺服器錯誤

## 資料類型

### DifficultyLevel
```typescript
type DifficultyLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
```

### WordType
```typescript
type WordType = 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'conjunction' | 'interjection';
```

### LearningStatus
```typescript
type LearningStatus = 'new' | 'learning' | 'familiar' | 'mastered';
```

## 分頁

支援分頁的 endpoints 使用以下參數：

```
GET /endpoint?page=1&limit=20
```

回應會包含分頁資訊：

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}
```
