# 機能設計書（Functional Design）

---

## 1. ユースケース図

```mermaid
graph LR
  User["一般ユーザー(少年・保護者)"]
  Admin["管理者(チーム運営者)"]

  subgraph 一般ユーザーのユースケース
    U1["チームの紹介を見る"]
    U2["指導者のプロフィール・方針を見る"]
    U3["費用・練習頻度・場所を確認する"]
    U4["試合結果・活動写真を見る"]
    U5["体験会の日程を確認する"]
    U6["体験入団を申し込む"]
  end

  subgraph 管理者のユースケース
    A1["管理者としてログインする"]
    A2["体験申込者の一覧を確認する"]
    A3["申込者のステータスを管理する"]
    A4["体験会の日程・場所を登録・編集する"]
    A5["試合結果を登録・編集・削除する"]
    A6["チーム紹介・写真・費用情報を編集する"]
  end

  User --> U1
  User --> U2
  User --> U3
  User --> U4
  User --> U5
  User --> U6

  Admin --> A1
  A1 --> A2
  A1 --> A3
  A1 --> A4
  A1 --> A5
  A1 --> A6
```

---

## 2. 画面遷移図

```mermaid
graph TD
  Top["トップページ /"]
  About["チーム紹介 /about"]
  Gallery["活動写真ギャラリー"]
  Coaches["指導者紹介 /coaches"]
  FAQ["費用・よくある質問 /faq"]
  Results["試合結果 /results"]
  Trial["体験会日程 /trial"]
  Apply["体験申込フォーム /apply"]
  Complete["申込完了ページ /apply/complete"]

  AdminLogin["管理者ログイン /admin/login"]
  AdminDash["管理者ダッシュボード /admin"]
  Applicants["申込者一覧 /admin/applicants"]
  Trials["体験会管理 /admin/trials"]
  AdminResults["試合結果管理 /admin/results"]
  Contents["コンテンツ管理 /admin/contents"]

  Top --> About
  About --> Gallery
  Top --> Coaches
  Top --> FAQ
  Top --> Results
  Top --> Trial
  Top --> Apply
  Apply --> Complete

  AdminLogin --> AdminDash
  AdminDash --> Applicants
  AdminDash --> Trials
  AdminDash --> AdminResults
  AdminDash --> Contents
```

---

## 3. ワイヤーフレーム

### トップページ（/）

┌─────────────────────────────┐
│  ロゴ　　　　　　　　　　　　│
│  [チーム紹介][指導者][費用][試合結果] │
├─────────────────────────────┤
│  キャッチコピー　　　　　　　│
│  「一緒に野球しよう！」　　　│
│  チームの写真（大きく表示）　│
│  [体験入団を申し込む] ボタン　│
├─────────────────────────────┤
│  チームの特徴（3つのポイント）│
│  ① 楽しく　② 安心　③ 実績　│
├─────────────────────────────┤
│  直近の試合結果　　　　　　　│
├─────────────────────────────┤
│  体験会の日程（次回分）　　　│
│  [申し込む] ボタン　　　　　│
└─────────────────────────────┘

### 体験申込フォーム（/apply）

```
┌─────────────────────────────┐
│  体験入団 申し込みフォーム　　│
├─────────────────────────────┤
│  お子さんのお名前 [　　　　]　│
│  お子さんの学年  [　　　　]　│
│  保護者のお名前  [　　　　]　│
│  メールアドレス  [　　　　]　│
│  電話番号　　　　[　　　　]　│
│  希望体験会日程  [選択▼　]　│
│  メッセージ（任意）[　　　]　│
│  　　　　　[申し込む]　　　　│
└─────────────────────────────┘
```

### 管理者：体験会管理（/admin/trials）

```
┌─────────────────────────────┐
│  体験会管理　　　　　　　　　│
├─────────────────────────────┤
│  ＜ 2026年3月 ＞　　　　　　│
│  日  月  火  水  木  金  土  │
│   1   2   3   4   5   6   7 │
│  【21】 22  23  24  25  26  27 │ ← 体験会登録済みは強調表示
│  28  29  30  31　　　　　　 │
│  ※ 祝日は緑字で表示　　　　 │
└─────────────────────────────┘
```

**カレンダー表示ルール：**
- 祝日：**緑字**で表示
- 体験会が登録されている日：強調表示（太字・背景色）
- 過去の日付：グレーアウト

### 管理者：申込者一覧（/admin/applicants）

```
┌─────────────────────────────┐
│  体験申込者一覧　　　　　　　│
├──────┬────┬──────┬──────────┤
│ 名前 │学年│ 申込日 │ ステータス│
├──────┼────┼──────┼──────────┤
│ 山田太郎│3年│3/21│[確認済み▼]│
│ 田中花子│2年│3/20│[未確認▼] │
└──────┴────┴──────┴──────────┘
```

---

## 4. コンポーネント設計

```mermaid
graph TD
  subgraph 共通レイアウト
    Header["Header\nナビゲーションメニュー"]
    Footer["Footer\nフッター情報"]
  end

  subgraph トップページ
    HeroSection["HeroSection\nキャッチコピー・写真"]
    TeamFeatures["TeamFeatures\nチームの特徴3ポイント"]
    ResultCard["ResultCard\n試合結果カード"]
    TrialCard["TrialCard\n体験会カード"]
  end

  subgraph 申込ページ
    ApplyForm["ApplyForm\n体験申込フォーム"]
  end

  subgraph 指導者ページ
    CoachCard["CoachCard\n指導者プロフィールカード"]
  end

  subgraph 管理者画面
    AdminLayout["AdminLayout\n管理者共通レイアウト"]
    ApplicantTable["ApplicantTable\n申込者一覧テーブル"]
    StatusBadge["StatusBadge\nステータスバッジ"]
  end

  Header --> HeroSection
  Header --> ApplyForm
  Header --> CoachCard
  HeroSection --> TeamFeatures
  HeroSection --> ResultCard
  HeroSection --> TrialCard
  ApplicantTable --> StatusBadge
  AdminLayout --> ApplicantTable
```

---

## 5. データモデル定義

### applicants テーブル（体験申込者）

| カラム名    | 型        | 説明                       |
| ----------- | --------- | -------------------------- |
| id          | UUID      | 自動生成される識別番号     |
| child_name  | text      | お子さんの名前             |
| child_grade | text      | お子さんの学年             |
| parent_name | text      | 保護者の名前               |
| email       | text      | メールアドレス             |
| phone       | text      | 電話番号                   |
| trial_id    | UUID      | 希望体験会のID             |
| message     | text      | メッセージ（任意）         |
| status      | text      | 未確認・確認済み・参加済み |
| created_at  | timestamp | 申込日時                   |

### trials テーブル（体験会）

| カラム名      | 型        | 説明                   |
| ------------- | --------- | ---------------------- |
| id            | UUID      | 自動生成される識別番号 |
| date          | date      | 体験会の日付           |
| start_time    | time      | 開始時間               |
| location      | text      | 場所                   |
| meeting_point | text      | 集合場所               |
| items_to_bring | text     | 持ち物                 |
| notes         | text      | 備考                   |
| created_at    | timestamp | 登録日時               |

### results テーブル（試合結果）

| カラム名       | 型        | 説明                   |
| -------------- | --------- | ---------------------- |
| id             | UUID      | 自動生成される識別番号 |
| date           | date      | 試合日                 |
| opponent       | text      | 対戦相手               |
| score_our      | integer   | 自チームの得点         |
| score_opponent | integer   | 相手チームの得点       |
| result         | text      | 勝ち・負け・引き分け   |
| tournament     | text      | 大会名（任意）         |
| created_at     | timestamp | 登録日時               |

---

## 6. API設計

```mermaid
graph LR
  User["一般ユーザー"]
  Admin["管理者"]

  subgraph /api/applicants
    AP1["POST\n体験申込を受け付ける"]
    AP2["GET\n申込者一覧を取得する"]
    AP3["PATCH /id\n申込者ステータスを更新する"]
    AP4["DELETE /id\n申込者を削除する"]
  end

  subgraph /api/trials
    TR1["GET\n体験会一覧を取得する"]
    TR2["POST\n体験会を登録する"]
    TR3["PATCH /id\n体験会を更新する"]
  end

  subgraph /api/results
    RS1["GET\n試合結果一覧を取得する"]
    RS2["POST\n試合結果を登録する"]
    RS3["DELETE /id\n試合結果を削除する"]
  end

  User --> AP1
  User --> TR1
  User --> RS1

  Admin --> AP2
  Admin --> AP3
  Admin --> AP4
  Admin --> TR2
  Admin --> TR3
  Admin --> RS2
  Admin --> RS3
```

---

## 7. 機能ごとのアーキテクチャ

### 体験申込の流れ

```mermaid
sequenceDiagram
  participant User as ユーザー
  participant Front as フロントエンド
  participant API as API Routes
  participant DB as Supabase DB

  User->>Front: 申込フォームに入力して送信
  Front->>API: POST /api/applicants
  API->>API: バリデーション（入力チェック）
  API->>DB: applicantsテーブルに保存
  DB-->>API: 保存完了
  API-->>Front: 成功レスポンス
  Front-->>User: 申込完了ページに遷移
```

### 管理者ログインの流れ

```mermaid
sequenceDiagram
  participant Admin as 管理者
  participant Front as フロントエンド
  participant Auth as Supabase Auth
  participant Dash as 管理者ダッシュボード

  Admin->>Front: メール・パスワードを入力
  Front->>Auth: 認証リクエスト
  Auth-->>Front: 認証成功（セッション発行）
  Front-->>Dash: 管理者ダッシュボードへ遷移
  Dash-->>Admin: ダッシュボード表示
```

---

## 8. システム構成図

```mermaid
graph TD
  Browser["ユーザーのブラウザ\nスマホ・PC どちらでも対応"]

  subgraph Vercel["Vercel（公開サーバー）"]
    Frontend["画面表示\nReact コンポーネント"]
    API["API Routes\nサーバー処理"]
  end

  subgraph Supabase["Supabase（データ管理）"]
    DB["データベース\n申込者・体験会・試合結果"]
    Auth["認証\n管理者ログイン"]
  end

  Browser --> Frontend
  Frontend --> API
  API --> DB
  API --> Auth
```
