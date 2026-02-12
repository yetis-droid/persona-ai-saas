# 🚀 Google AdSense 完全セットアップマニュアル
## 初心者向け・画像で解説

---

## 📋 **目次**

1. [事前準備](#step0)
2. [Google AdSenseアカウント登録](#step1)
3. [サイト審査申請](#step2)
4. [審査中の待ち時間（1-4週間）](#step3)
5. [Publisher IDとAd Slot IDを取得](#step4)
6. [コードに設定してデプロイ](#step5)
7. [動作確認と収益発生](#step6)
8. [トラブルシューティング](#troubleshooting)

---

<a name="step0"></a>
## 🎯 **Step 0: 事前準備（必須）**

### ✅ **必要なもの:**
1. **Googleアカウント** (Gmail)
2. **本番環境のURL** (例: https://persona-ai.com)
3. **銀行口座情報** (収益受取用)
4. **住所・電話番号**
5. **身分証明書** (パスポート、運転免許証など)

### ✅ **サイトの準備状況チェック:**
- [ ] サイトが本番環境で公開されている
- [ ] プライバシーポリシーページがある (`/privacy`)
- [ ] 利用規約ページがある (`/terms`)
- [ ] オリジナルコンテンツが充実している
- [ ] サイトが正常に動作している

**⚠️ 重要:** ローカル環境（localhost）やsandboxURLでは審査申請できません！  
**必ず本番環境のURL（独自ドメイン推奨）で申請してください。**

---

<a name="step1"></a>
## 📝 **Step 1: Google AdSenseアカウント登録**

### **1-1. AdSense公式サイトにアクセス**

```
URL: https://www.google.com/adsense/
```

1. ブラウザで上記URLを開く
2. 右上の **「ご利用開始」** ボタンをクリック
3. Googleアカウントでログイン

### **1-2. サイト情報を入力**

**画面に従って入力:**

| 項目 | 入力例 | 説明 |
|---|---|---|
| **ウェブサイトのURL** | `https://persona-ai.com` | あなたの本番環境URL |
| **メールアドレス** | `your-email@gmail.com` | Googleアカウントのメール |
| **AdSenseからの情報** | ☑ 受け取る | おすすめ情報を受け取る |

**入力したら「保存して次へ」をクリック**

### **1-3. 国または地域を選択**

1. **国または地域**: `日本` を選択
2. **利用規約**: チェックを入れる
3. **「アカウントを作成」** をクリック

### **1-4. お支払い情報を入力**

| 項目 | 入力内容 |
|---|---|
| **アカウントの種類** | 個人 or 法人（ビジネス） |
| **名前と住所** | 正確に入力（銀行口座と同じ名義） |
| **電話番号** | SMS認証用 |

**入力したら「送信」をクリック**

### **1-5. 電話番号を確認（SMS認証）**

1. SMSで確認コード（6桁）が届く
2. 確認コードを入力
3. **「送信」** をクリック

---

<a name="step2"></a>
## 🔍 **Step 2: サイト審査申請**

### **2-1. AdSenseコードをサイトに追加**

**AdSenseダッシュボード画面:**
```
✅ あなたのサイト: persona-ai.com
⏳ ステータス: 準備中
```

**表示される指示:**
```html
以下のコードを<head>タグ内に追加してください：

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
     crossorigin="anonymous"></script>
```

**⚠️ このコードは既にあなたのプロジェクトに追加済みです！**  
**ただし、`ca-pub-XXXXXXXXXXXXXXXX` の部分を実際のIDに置き換える必要があります。**

### **2-2. Publisher IDをメモする**

AdSenseダッシュボードに表示される **`ca-pub-1234567890123456`** をメモしてください。

**例:**
```
Publisher ID: ca-pub-1234567890123456
           ↑
このIDをコピーしておく
```

### **2-3. サイトにコードを追加（既に済み）**

**あなたのプロジェクトでは既に以下のファイルにコードが追加されています:**

**ファイル:** `frontend/index.html` (16行目)

**現在の状態:**
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```

**やること:**
```html
<!-- ca-pub-XXXXXXXXXXXXXXXX を実際のPublisher IDに置き換える -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
     crossorigin="anonymous"></script>
```

**手順:**
```bash
# 1. ファイルを開く
cd /home/user/webapp/persona-ai-saas/frontend
nano index.html

# 2. 16行目の ca-pub-XXXXXXXXXXXXXXXX を実際のIDに置き換え
# 3. Ctrl+O で保存、Ctrl+X で終了

# 4. 変更をコミット
git add index.html
git commit -m "chore: AdSense Publisher ID設定"
```

### **2-4. サイトをデプロイ**

**変更を本番環境に反映:**
```bash
cd /home/user/webapp/persona-ai-saas

# フロントエンドをビルド
cd frontend
npm run build

# 本番環境にデプロイ（使用している環境に応じて）
# Railway, Cloudflare Pages, Vercel等
```

**デプロイ後、サイトが正常に動作するか確認:**
```
https://persona-ai.com
```

### **2-5. AdSenseダッシュボードで確認**

1. AdSenseダッシュボードに戻る
2. **「サイトを確認」** をクリック
3. Googleがあなたのサイトをクロール（数時間〜数日）
4. コードが検出されたら **「審査をリクエスト」** が表示される
5. **「審査をリクエスト」** をクリック

---

<a name="step3"></a>
## ⏰ **Step 3: 審査中の待ち時間（1-4週間）**

### **審査期間:**
- **通常**: 1-2週間
- **長い場合**: 最大4週間

### **審査中にやること:**

#### ✅ **サイトの改善:**
- オリジナルコンテンツを増やす
- ブログ記事を書く（週1-2回）
- FAQ・ヘルプページを充実させる
- ユーザー登録数を増やす

#### ✅ **AdSenseポリシーを確認:**
- 禁止コンテンツがないか確認
- 著作権侵害がないか確認
- 成人向けコンテンツがないか確認

### **審査結果の通知:**

**✅ 審査通過の場合:**
```
件名: AdSenseアカウントが有効になりました
本文: おめでとうございます！サイトが承認されました。
     広告を表示できるようになりました。
```

**❌ 審査不合格の場合:**
```
件名: AdSenseアカウントが承認されませんでした
本文: 以下の理由で承認されませんでした：
     - コンテンツが不十分
     - ポリシー違反
     - etc...
```

**不合格の場合:**
1. 指摘された問題を修正
2. 1-2週間待つ
3. 再申請

---

<a name="step4"></a>
## 🎫 **Step 4: Publisher IDとAd Slot IDを取得**

### **審査通過後の作業:**

### **4-1. AdSenseダッシュボードにログイン**

```
URL: https://www.google.com/adsense/
```

ログイン後、以下の画面が表示されます：
```
✅ アカウントが有効です
📊 収益: ¥0
📈 本日のページビュー: 0
```

### **4-2. 広告ユニットを作成**

**手順:**
1. 左メニュー → **「広告」** をクリック
2. **「広告ユニットごと」** タブをクリック
3. **「+ 新しい広告ユニット」** をクリック

### **4-3. ダッシュボード用の横長バナー広告を作成**

**設定項目:**

| 項目 | 設定値 |
|---|---|
| **広告ユニット名** | `Dashboard Horizontal Banner` |
| **広告タイプ** | ディスプレイ広告 |
| **広告サイズ** | レスポンシブ（推奨） |

**入力したら「作成」をクリック**

**コードが表示される:**
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-1234567890123456"
     data-ad-slot="9876543210"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

**📝 メモ:**
```
Publisher ID: ca-pub-1234567890123456
Ad Slot ID (Dashboard): 9876543210
```

### **4-4. 残り3つの広告ユニットを作成**

同じ手順で以下の3つを作成してください：

| # | 広告ユニット名 | 推奨サイズ | メモ先 |
|---|---|---|---|
| 1 | `Dashboard Horizontal Banner` | レスポンシブ | Ad Slot ID: ________ |
| 2 | `Chat Rectangle Ad` | レスポンシブ | Ad Slot ID: ________ |
| 3 | `Conversations Rectangle Ad` | レスポンシブ | Ad Slot ID: ________ |
| 4 | `Landing Horizontal Banner` | レスポンシブ | Ad Slot ID: ________ |

**取得した4つのAd Slot IDをメモしておいてください！**

---

<a name="step5"></a>
## 💻 **Step 5: コードに設定してデプロイ**

### **5-1. Publisher IDを設定**

**変更するファイル: 2箇所**

#### **① frontend/index.html (16行目)**

```bash
cd /home/user/webapp/persona-ai-saas/frontend
nano index.html
```

**変更前:**
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```

**変更後:**
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
     crossorigin="anonymous"></script>
```

**保存: Ctrl+O → Enter → Ctrl+X**

#### **② frontend/src/components/AdBanner.tsx (53行目)**

```bash
cd /home/user/webapp/persona-ai-saas/frontend/src/components
nano AdBanner.tsx
```

**変更前:**
```typescript
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
```

**変更後:**
```typescript
data-ad-client="ca-pub-1234567890123456"
```

**保存: Ctrl+O → Enter → Ctrl+X**

---

### **5-2. Ad Slot IDを設定**

**変更するファイル: 4箇所**

#### **① Dashboard.tsx (533行目あたり)**

```bash
cd /home/user/webapp/persona-ai-saas/frontend/src/pages
nano Dashboard.tsx
```

**検索: Ctrl+W → `adSlot="1234567890"`**

**変更前:**
```typescript
<AdBanner 
  adSlot="1234567890"
  format="horizontal"
  className="mb-6"
/>
```

**変更後:**
```typescript
<AdBanner 
  adSlot="9876543210"  ← 実際のAd Slot IDに置き換え
  format="horizontal"
  className="mb-6"
/>
```

#### **② Chat.tsx (226行目あたり)**

```bash
nano Chat.tsx
```

**検索: Ctrl+W → `adSlot="2345678901"`**

**変更前:**
```typescript
<AdBanner 
  adSlot="2345678901"
  format="rectangle"
/>
```

**変更後:**
```typescript
<AdBanner 
  adSlot="実際のAd Slot ID"
  format="rectangle"
/>
```

#### **③ Conversations.tsx (237行目あたり)**

```bash
nano Conversations.tsx
```

**検索: Ctrl+W → `adSlot="3456789012"`**

**変更:**
```typescript
<AdBanner 
  adSlot="実際のAd Slot ID"
  format="rectangle"
/>
```

#### **④ Landing.tsx (209行目あたり)**

```bash
nano Landing.tsx
```

**検索: Ctrl+W → `adSlot="4567890123"`**

**変更:**
```typescript
<AdBanner 
  adSlot="実際のAd Slot ID"
  format="horizontal"
/>
```

---

### **5-3. 変更をコミット**

```bash
cd /home/user/webapp/persona-ai-saas

# 変更をステージング
git add .

# コミット
git commit -m "chore: AdSense Publisher IDとAd Slot ID設定完了"

# GitHubにプッシュ（リモートリポジトリがある場合）
git push origin main
```

---

### **5-4. 本番環境にデプロイ**

**フロントエンドをビルド:**
```bash
cd /home/user/webapp/persona-ai-saas/frontend
npm run build
```

**デプロイ方法（使用している環境に応じて）:**

#### **🚂 Railwayの場合:**
```bash
# Railwayが自動的にデプロイ
# GitHub連携している場合は push で自動デプロイ
```

#### **☁️ Cloudflare Pagesの場合:**
```bash
npx wrangler pages deploy dist --project-name persona-ai
```

#### **▲ Vercelの場合:**
```bash
vercel --prod
```

#### **🔷 Netlifyの場合:**
```bash
netlify deploy --prod
```

---

<a name="step6"></a>
## ✅ **Step 6: 動作確認と収益発生**

### **6-1. 本番環境で広告が表示されるか確認**

**無料プランユーザーでログイン:**
```
URL: https://persona-ai.com/login
```

**確認箇所:**
1. **ダッシュボード**: 横長バナー広告が表示されるか
2. **チャット画面**: 5件以上会話後、長方形広告が表示されるか
3. **会話履歴ページ**: 長方形広告が表示されるか
4. **ランディングページ**: 横長バナー広告が表示されるか

**⚠️ 注意:**
- 広告が表示されるまで数分〜数時間かかる場合があります
- 広告ブロッカーが有効だと広告が表示されません
- 開発環境（localhost）では**ダミー広告**が表示されます

### **6-2. プレミアムプランで広告が非表示か確認**

**プレミアムプランユーザーでログイン:**
```
プレミアムプラン（¥945/月）に登録
```

**確認:**
- すべてのページで広告が**表示されない**ことを確認

### **6-3. 広告が表示されない場合のチェックリスト**

- [ ] AdSenseアカウントが有効か？
- [ ] Publisher IDが正しく設定されているか？
- [ ] Ad Slot IDが正しく設定されているか？
- [ ] サイトが本番環境で公開されているか？
- [ ] 広告ブロッカーが無効か？
- [ ] ブラウザのキャッシュをクリアしたか？

**デバッグ方法:**
```bash
# ブラウザの開発者ツールを開く (F12)
# Consoleタブで以下のエラーがないか確認:
# - adsbygoogle is not defined
# - ad slot not found
```

---

### **6-4. AdSenseダッシュボードで確認**

**AdSenseダッシュボードにログイン:**
```
URL: https://www.google.com/adsense/
```

**確認項目:**
- **📊 推定収益額**: ¥0 → 広告表示とクリックで増加
- **📈 ページビュー**: 広告が表示された回数
- **💰 ページRPM**: 1,000ページビューあたりの収益

**収益発生まで:**
1. 広告が表示される（即時）
2. ユーザーが広告をクリックする
3. クリック数が増える
4. 収益が発生（翌日反映）

---

<a name="troubleshooting"></a>
## 🔧 **トラブルシューティング**

### **❌ 問題1: 広告が表示されない**

**原因と対処法:**

| 原因 | 確認方法 | 対処法 |
|---|---|---|
| Publisher IDが間違っている | `index.html`の16行目を確認 | 正しいIDに修正してデプロイ |
| Ad Slot IDが間違っている | 各ページのコードを確認 | 正しいIDに修正してデプロイ |
| 広告ブロッカーが有効 | ブラウザ拡張機能を確認 | 広告ブロッカーを無効化 |
| AdSenseアカウントが無効 | AdSenseダッシュボード確認 | ポリシー違反を確認・修正 |
| サイトが承認されていない | AdSenseダッシュボード確認 | 審査完了を待つ |

---

### **❌ 問題2: 審査に不合格になった**

**よくある不合格理由:**

| 理由 | 対処法 |
|---|---|
| **コンテンツが不十分** | オリジナル記事を10本以上追加 |
| **ポリシー違反** | 禁止コンテンツを削除 |
| **サイトが未完成** | すべてのページを完成させる |
| **コピーコンテンツ** | オリジナルコンテンツに差し替え |
| **プライバシーポリシーがない** | `/privacy`ページを作成 |

**再申請の手順:**
1. 指摘された問題を修正
2. 1-2週間待つ（コンテンツ追加期間）
3. AdSenseダッシュボードから再申請

---

### **❌ 問題3: 収益が発生しない**

**原因:**
- ページビュー数が少ない
- クリック率が低い
- 広告配置が悪い

**対処法:**
1. **SEO対策**: Google検索で上位表示
2. **SNS拡散**: Twitter, Instagram等で宣伝
3. **広告配置を最適化**: コンテンツの上部に配置

---

### **❌ 問題4: 開発環境で広告が表示されない**

**これは正常です！**
- 開発環境（localhost）では**ダミー広告**が表示されます
- 本番環境でのみ**Google AdSense広告**が表示されます

**開発環境のダミー広告表示:**
```
┌─────────────────────────┐
│  📺                     │
│  Google AdSense広告枠  │
│  開発環境ではダミー表示 │
│  Format: horizontal     │
│  Slot: 1234567890       │
└─────────────────────────┘
```

---

## 📞 **サポート・お問い合わせ**

### **Google AdSenseサポート:**
- **ヘルプセンター**: https://support.google.com/adsense/
- **コミュニティフォーラム**: https://support.google.com/adsense/community
- **お問い合わせ**: AdSenseダッシュボード → ヘルプ → お問い合わせ

### **Persona AI開発者サポート:**
- **メール**: support@persona-ai.com
- **GitHub Issues**: https://github.com/your-username/persona-ai-saas/issues

---

## 🎉 **まとめ**

### **完了チェックリスト:**

- [ ] **Step 1**: Google AdSenseアカウント登録完了
- [ ] **Step 2**: サイト審査申請完了
- [ ] **Step 3**: 審査通過待ち（1-4週間）
- [ ] **Step 4**: Publisher IDとAd Slot IDを取得
- [ ] **Step 5**: コードに設定してデプロイ
- [ ] **Step 6**: 本番環境で広告が表示されることを確認
- [ ] **収益発生**: クリック数が増えて収益が発生！

---

**作成日**: 2026-02-12  
**最終更新**: 2026-02-12  
**バージョン**: 2.0.0  
**ドキュメント作成者**: Claude (Anthropic)
