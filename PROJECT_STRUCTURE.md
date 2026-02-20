# TimerVid - プロジェクト構造

## 概要
ポモドーロタイマーとYouTube動画を組み合わせたWebアプリケーション。作業時間と休憩時間で異なるプレイリストを再生できる。

## 技術スタック
- **フレームワーク**: Next.js 14.2.9 (React 18)
- **スタイリング**: Tailwind CSS, Mantine UI, shadcn/ui
- **状態管理**: Jotai, React Context API
- **動画再生**: react-youtube

## ディレクトリ構造
```
TimerVid/
├── public/          # 静的ファイル
├── src/
│   ├── assets/      # 音声ファイル（カウントダウン、ファンファーレ）
│   ├── atoms/       # Jotaiの状態管理
│   ├── components/  # UIコンポーネント（Atomic Design）
│   │   ├── Atoms/      # ボタン、コントロールなど
│   │   ├── Molecules/  # プレイヤー、タイマー表示など
│   │   ├── Organisms/  # ヘッダー、コンテナなど
│   │   ├── Templates/  # ページテンプレート
│   │   └── ui/        # shadcn/uiコンポーネント
│   ├── context/     # React Context（プレイリスト、タイマー）
│   ├── hooks/       # カスタムフック
│   ├── lib/         # ユーティリティ関数
│   ├── pages/       # Next.jsページとAPIルート
│   └── styles/      # グローバルCSS
└── 設定ファイル     # package.json, next.config.mjs等
```

## 主要機能
1. **ポモドーロタイマー**: 作業・休憩時間のカスタマイズ可能
2. **YouTubeプレイリスト**: 作業用・休憩用の別々のプレイリスト
3. **一括インポート**: YouTubeプレイリストのURL入力で動画を一括追加
4. **音声通知**: タイマーイベント時の効果音
5. **チュートリアル**: 初回利用者向けの操作ガイド

## アーキテクチャの特徴
- Atomic Designパターンによるコンポーネント設計
- Jotai + Context APIによる階層的な状態管理
- カスタムフックによる機能の分離
- LocalStorageによる設定の永続化

## 機能ごとのロジックフロー

### 1. タイマー機能のフロー

**エントリーポイント:**
- `TimersWithControllerContainer` - タイマーコントロールのメインコンテナ
- 操作ボタン: 再生/一時停止、リセット、巻き戻し、スキップ

**状態管理:**
- **Context:** `TimerContext` (TimerProvider)
- **Hooks:** `useTimer` - 個別タイマーの状態管理
- **Atoms (Jotai):** 
  - `modeAtom` - 現在のモード（作業/休憩）
  - `resumeTimeAtom` - 各モードの再開時間

**主要コンポーネント:**
- `TimerContainer` - 個別タイマー表示（作業/休憩/長休憩）
- `TimerCountdown` - カウントダウンプログレス表示
- `TimerControls` - タイマー操作ボタン
- `TimerSetting` - タイマー時間設定

**データフロー:**
1. ユーザーが再生/一時停止ボタンをクリック → `TimerContext`の`startTimer()`
2. `useTimer`フックでタイマー状態更新（isRunning, elapsedTime）
3. setIntervalで毎秒カウントダウン更新
4. タイマー終了時（remainingTime < 0）:
   - カウントダウン音を再生
   - 次のタイマーに切り替え（作業→休憩→作業）
   - `switchStatus()`でプレイリスト状態を更新
   - 動画プレイヤーの状態を更新

### 2. YouTube動画プレイヤー統合フロー

**エントリーポイント:**
- `PlayerContainer` - YouTubeプレイヤーのラッパー
- `Player`コンポーネント（`react-youtube`ライブラリ使用）

**状態管理:**
- **Atoms (Jotai):** `playerAtom` - YouTubeプレイヤーインスタンス
- **Hook:** `usePlayer` - Reducerパターンによるプレイヤー制御

**データフロー:**
1. YouTubeプレイヤー初期化 → `onReady`コールバック
2. プレイヤーインスタンスを`playerAtom`に保存
3. `currentVideoId`の変更で動画読み込み
4. Reducerを通じてプレイヤーコマンドをディスパッチ:
   - `loadVideoId` - 再開時間付きで新規動画を読み込み
   - `play/pause` - 再生制御
   - `stop` - 動画停止

### 3. プレイリスト管理フロー

**エントリーポイント:**
- `PlaylistContainer` - プレイリストUIのメインコンテナ
- プレイリスト追加ボタン（FaPlusアイコン）
- 作業用/休憩用のプレイリストタブ

**状態管理:**
- **Context:** `PlaylistContext` (PlaylistProvider)
- **Hook:** `usePlaylist` - 包括的なプレイリスト管理

**データフロー:**
1. プレイリストをlocalStorageから読み込み
2. 動画追加フロー:
   - YouTube URL/ID入力 → `extractVideoId()`
   - YouTube APIで動画メタデータ取得
   - 現在のプレイリストに追加
3. YouTubeプレイリストから一括追加:
   - プレイリストID抽出 → `getVideoIds()`
   - 全動画取得（最大250件）
   - プレイリストに一括追加

### 4. 状態管理の連携フロー

**アーキテクチャ:**
- **Jotai (Atoms):** 
  - グローバルプレイヤーインスタンス
  - 現在のモード（作業/休憩）
  - シームレスな遷移のための再開時間

- **React Context:**
  - `TimerContext` - タイマー状態と制御
  - `PlaylistContext` - プレイリストデータと制御

- **LocalStorage:**
  - タイマー設定時間
  - プレイリストデータ（動画、プレイリスト）
  - サイクル設定

### 5. コンポーネント間の通信パターン

**機能間の連携:**
1. **タイマー → プレイヤー:**
   - タイマー開始/停止で動画再生を制御
   - モード切り替えで動画変更

2. **タイマー → プレイリスト:**
   - タイマー完了でプレイリストモード切り替え
   - タイマーリセットでプレイリスト状態リセット

3. **プレイリスト → プレイヤー:**
   - 動画選択でプレイヤーに読み込み
   - プレイリストナビゲーションでプレイヤー制御

**イベントフローの例:**

#### 1. ポモドーロタイマー開始フロー
1. ユーザーがタイマー開始ボタンをクリック
2. `TimersWithControllerContainer` → `TimerContext.startTimer()`
3. `useTimer`フックで`isRunning: true`に状態更新
4. `setInterval`で1秒ごとにカウントダウン開始
5. 動画プレイヤーに再生コマンドをディスパッチ
   - `usePlayer.controller({ type: "play" })`
   - `playerAtom`からプレイヤーインスタンス取得
   - `player.playVideo()`で動画再生開始

#### 2. タイマー終了・モード切り替えフロー
1. `remainingTime`が0になったタイマーを検出
2. `handleTimerEnd()`関数が実行される
3. カウントダウン音声（`countdown.mp3`）を再生
4. 次のタイマーモードを決定:
   - 作業タイマー → 短休憩タイマー
   - 短休憩タイマー → 作業タイマー
   - 設定サイクル数達成時 → 長休憩タイマー
5. `PlaylistContext.switchStatus()`でプレイリスト状態を更新
6. `modeAtom`を新しいモード（work/break/longBreak）に更新
7. プレイリストから対応する動画を選択
8. 動画変更をトリガー → `usePlayer.controller({ type: "loadVideoId" })`
9. 再開時間（`resumeTimeAtom`）付きで新しい動画を読み込み

#### 3. プレイリスト動画追加フロー
1. ユーザーがプレイリスト追加ボタン（＋）をクリック
2. `PlaylistAddModal`が開く
3. YouTube URL入力 → `extractVideoId()`でIDを抽出
4. YouTube Data API v3で動画メタデータを取得:
   ```javascript
   const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet`)
   ```
5. 取得したデータ（タイトル、サムネイル、時間）を整形
6. 現在選択中のプレイリスト（work/break）に動画を追加
7. `PlaylistContext.addVideoToPlaylist()`でContextを更新
8. LocalStorageに変更を保存
9. UIを更新してプレイリストに新しい動画を表示

#### 4. プレイリスト一括インポートフロー
1. ユーザーがYouTubeプレイリストURLを入力
2. `getVideoIds()`でプレイリストIDを抽出
3. YouTube Data API v3でプレイリストアイテムを取得:
   ```javascript
   const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&key=${API_KEY}&part=snippet&maxResults=50`)
   ```
4. 複数ページの場合は`nextPageToken`を使用して全動画を取得
5. 各動画のメタデータを並列で取得
6. 取得した全動画を現在のプレイリストに一括追加
7. 進捗表示とエラーハンドリング
8. 完了時にトースト通知を表示

#### 5. タイマーリセット・状態復元フロー
1. ユーザーがリセットボタンをクリック
2. `TimerContext.clearTimer()`が実行される
3. 全タイマーの状態をリセット:
   - `isRunning: false`
   - `elapsedTime: 0`
   - `currentTimer`をworkTimerに設定
4. 動画プレイヤーを停止:
   - `usePlayer.controller({ type: "stop" })`
   - `player.stopVideo()`
5. プレイリスト状態をリセット:
   - `PlaylistContext.resetStatus()`
   - `currentVideoIndex: 0`
6. モードアトムを初期状態（work）に戻す
7. 再開時間をクリア
8. UIを初期状態に更新

#### 6. 設定変更・永続化フロー
1. ユーザーがタイマー設定を変更（作業時間、休憩時間等）
2. `TimerSetting`コンポーネントで入力値を検証
3. 各タイマーの個別セッター（`setTotalTime`等）で設定を更新
4. LocalStorageに新しい設定を保存:
   ```javascript
   localStorage.setItem(`${mode}-timer`, JSON.stringify(newSettings))
   ```
5. 実行中のタイマーがある場合は次回サイクルから適用
6. 設定変更をトースト通知で確認表示

#### 7. エラーハンドリングフロー
1. YouTube API呼び出し失敗時:
   - try-catch節でエラーをキャッチ
   - APIキー無効 → エラーメッセージ表示
   - 動画が見つからない → エラーログ出力
2. 動画再生エラー時:
   - `loadVideoById`失敗時 → `cueVideoById`にフォールバック
   - プレイヤーエラー → try-catch節でキャッチ
   - エラー情報をコンソールに出力
3. データ取得エラー時:
   - 個別動画の取得失敗 → そのまま続行
   - プレイリスト取得失敗 → エラーメッセージ表示