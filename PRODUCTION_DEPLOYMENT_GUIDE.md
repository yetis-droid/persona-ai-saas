# 🚀 本番環境デプロイ完全ガイド
## Vercel + 独自ドメイン（オプション）

---

## 📋 **目次**

1. [Vercel 無料デプロイ（10分）](#vercel)
2. [独自ドメイン取得（オプション・30分）](#domain)
3. [独自ドメインをVercelに接続（15分）](#connect)
4. [Railway デプロイ（代替案）](#railway)
5. [Cloudflare Pages デプロイ（代替案）](#cloudflare)

---

<a name="vercel"></a>
## 🥇 **方法1: Vercel 無料デプロイ（最もおすすめ）**

### **特徴:**
- ✅ 完全無料（商用利用OK）
- ✅ デプロイ時間: 5分
- ✅ 自動HTTPS対応
- ✅ 独自ドメイン追加可能
- ✅ AdSense審査に使える

### **取得できるURL:**
```
https://persona-ai.vercel.app
または
https://persona-ai-あなたのユーザー名.vercel.app
```

---

### **📝 Step 1: GitHubにコードをプッシュ**

#### **1-1. GitHub環境をセットアップ**

```bash
cd /home/user/webapp/persona-ai-saas

# GitHub認証を設定（まだの場合）
# このコマンドを実行してGitHub認証を完了してください
```

**⚠️ 重要:** まず `setup_github_environment` ツールを呼び出してGitHub認証を設定してください。

#### **1-2. GitHubリポジトリを作成**

**ブラウザで以下のURLにアクセス:**
```
https://github.com/new
```

**入力項目:**
- **Repository name**: `persona-ai-saas`
- **Description**: `AI Persona SaaS Platform`
- **Public/Private**: Public（推奨）
- **Initialize this repository**: チェックを外す

**「Create repository」をクリック**

#### **1-3. コードをプッシュ**

```bash
cd /home/user/webapp/persona-ai-saas

# リモートリポジトリを追加
git remote add origin https://github.com/あなたのユーザー名/persona-ai-saas.git

# メインブランチにプッシュ
git push -u origin main
```

**✅ GitHub上でコードが確認できればOK！**

---

### **📝 Step 2: Vercelアカウント作成**

#### **2-1. Vercel公式サイトにアクセス**

```
URL: https://vercel.com/signup
```

#### **2-2. GitHubアカウントでログイン**

1. **「Continue with GitHub」** をクリック
2. GitHubで認証
3. Vercelへのアクセスを許可

**✅ Vercelアカウント作成完了！**

---

### **📝 Step 3: プロジェクトをデプロイ**

#### **3-1. 新規プロジェクト作成**

1. Vercelダッシュボードで **「Add New」** → **「Project」** をクリック
2. **「Import Git Repository」** が表示される
3. **「persona-ai-saas」** を選択
4. **「Import」** をクリック

#### **3-2. プロジェクト設定**

**Configure Project 画面:**

| 項目 | 設定値 |
|---|---|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

**Environment Variables（環境変数）:**

**「Add」をクリックして以下を追加:**

```
Name: VITE_API_URL
Value: https://あなたのバックエンドURL（後で設定）

Name: NODE_VERSION
Value: 18
```

**⚠️ 注意:** バックエンドは別途デプロイ必要（後述）

#### **3-3. デプロイ開始**

**「Deploy」ボタンをクリック**

**デプロイ中:**
```
🔨 Building...
📦 Uploading...
🚀 Deploying...
✅ Deployed!
```

**デプロイ完了（約2-3分）:**
```
🎉 Congratulations!
Your project has been deployed.

URL: https://persona-ai-vercel-app-あなたのユーザー名.vercel.app
```

**✅ これがあなたの本番環境URLです！**

---

### **📝 Step 4: バックエンドをデプロイ（Railway）**

Vercelはフロントエンド専用なので、バックエンドは別サービスにデプロイします。

#### **4-1. Railwayアカウント作成**

```
URL: https://railway.app/
```

1. **「Login with GitHub」** をクリック
2. GitHubで認証

#### **4-2. 新規プロジェクト作成**

1. **「New Project」** をクリック
2. **「Deploy from GitHub repo」** を選択
3. **「persona-ai-saas」** を選択

#### **4-3. バックエンド設定**

**Settings → Environment:**

| 変数名 | 値 |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `DATABASE_URL` | （PostgreSQL URL） |
| `JWT_SECRET` | （ランダム文字列） |
| `FRONTEND_URL` | `https://persona-ai-vercel-app.vercel.app` |

**Settings → Deploy:**
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Deploy開始**

**取得できるURL:**
```
https://persona-ai-production.up.railway.app
```

#### **4-4. フロントエンドの環境変数を更新**

**Vercelダッシュボード → Settings → Environment Variables:**

```
VITE_API_URL = https://persona-ai-production.up.railway.app
```

**「Redeploy」をクリック**

---

### **✅ 完成！本番環境URL取得完了**

**あなたの本番環境URL:**
```
フロントエンド: https://persona-ai-vercel-app.vercel.app
バックエンド: https://persona-ai-production.up.railway.app
```

**このURLを使ってAdSense審査申請ができます！** ✅

---

<a name="domain"></a>
## 🌟 **方法2: 独自ドメイン取得（オプション・推奨）**

### **独自ドメインのメリット:**
- ✅ AdSense審査通過率が高い
- ✅ プロフェッショナルな印象
- ✅ ブランディング効果
- ✅ SEOに有利

### **独自ドメインの例:**
```
https://persona-ai.com
https://my-persona-ai.jp
https://ai-persona-saas.net
```

---

### **📝 Step 1: ドメイン登録サービスを選ぶ**

**おすすめの日本のサービス:**

| サービス | 価格 | 特徴 |
|---|---|---|
| **お名前.com** | ¥1,280/年 | 最大手・信頼性高い |
| **ムームードメイン** | ¥1,500/年 | 初心者向け・簡単 |
| **Cloudflare Registrar** | $9.77/年 | 最安値・英語のみ |

**おすすめ: お名前.com（日本語サポート充実）**

---

### **📝 Step 2: お名前.comでドメイン購入**

#### **2-1. お名前.com公式サイトにアクセス**

```
URL: https://www.onamae.com/
```

#### **2-2. ドメイン検索**

**検索ボックスに希望のドメイン名を入力:**
```
例: persona-ai
```

**「検索」をクリック**

**利用可能なドメインが表示される:**
```
✅ persona-ai.com          ¥1,280/年
✅ persona-ai.jp           ¥2,840/年
✅ persona-ai.net          ¥1,480/年
❌ persona-ai.io           （取得済み）
```

#### **2-3. ドメインを選択**

**希望のドメインにチェックを入れる**
- `.com` がおすすめ（国際的に認知度が高い）
- `.jp` は日本向けサービスに最適

**「お申込みへ進む」をクリック**

#### **2-4. アカウント作成**

| 項目 | 入力内容 |
|---|---|
| **メールアドレス** | あなたのメール |
| **パスワード** | 8文字以上 |
| **名前** | 本名 |
| **住所** | 正確に入力 |
| **電話番号** | SMS認証用 |

**「次へ」をクリック**

#### **2-5. 支払い**

**支払い方法:**
- クレジットカード
- コンビニ決済
- 銀行振込

**契約年数:**
- 1年: ¥1,280
- 2年: ¥2,560（割引あり）
- 3年: ¥3,840（さらに割引）

**「申込む」をクリック**

**✅ ドメイン購入完了！**

**取得したドメイン:**
```
https://persona-ai.com
```

---

<a name="connect"></a>
## 🔗 **方法3: 独自ドメインをVercelに接続**

### **📝 Step 1: Vercelでドメイン追加**

#### **1-1. Vercelプロジェクトにアクセス**

```
URL: https://vercel.com/あなたのユーザー名/persona-ai-saas
```

#### **1-2. ドメイン設定**

1. **「Settings」** タブをクリック
2. **「Domains」** をクリック
3. **「Add Domain」** をクリック

**入力:**
```
Domain: persona-ai.com
```

**「Add」をクリック**

#### **1-3. DNS設定情報が表示される**

**Vercelが指示を表示:**
```
以下のDNSレコードをお名前.comに追加してください：

Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

### **📝 Step 2: お名前.comでDNS設定**

#### **2-1. お名前.comにログイン**

```
URL: https://www.onamae.com/
```

#### **2-2. ドメイン設定**

1. **「ドメイン設定」** をクリック
2. **「ネームサーバーの設定」** → **「DNS関連機能の設定」**
3. 取得したドメイン（`persona-ai.com`）を選択
4. **「次へ」** をクリック

#### **2-3. DNSレコード追加**

**「DNSレコード設定を利用する」** → **「設定する」**

**レコード1 (A レコード):**
```
ホスト名: （空欄）
TYPE: A
VALUE: 76.76.21.21
TTL: 3600
```

**「追加」をクリック**

**レコード2 (CNAME レコード):**
```
ホスト名: www
TYPE: CNAME
VALUE: cname.vercel-dns.com
TTL: 3600
```

**「追加」をクリック**

**「確認画面へ進む」** → **「設定する」**

---

### **📝 Step 3: DNS設定の反映を待つ**

**反映時間:**
- 最短: 5分
- 通常: 30分〜1時間
- 最大: 24時間

**確認方法:**
```bash
# ターミナルで実行
dig persona-ai.com

# 出力に 76.76.21.21 が表示されればOK
```

---

### **📝 Step 4: SSL証明書の自動発行**

**Vercelが自動的に:**
1. DNS設定を検知
2. SSL証明書を発行（Let's Encrypt）
3. HTTPSを有効化

**完了後:**
```
✅ Domain is ready!
https://persona-ai.com
```

**✅ 独自ドメインでアクセスできるようになりました！**

---

<a name="railway"></a>
## 🚂 **代替案: Railway デプロイ**

Vercelの代わりにRailwayを使用する場合。

### **特徴:**
- ✅ フロントエンド + バックエンド両方デプロイ可能
- ✅ PostgreSQLデータベース付き
- ✅ 無料枠: $5/月（クレジットカード登録必要）

### **手順:**

```bash
# 1. Railwayにログイン
https://railway.app/

# 2. New Project → Deploy from GitHub repo

# 3. persona-ai-saas を選択

# 4. 環境変数を設定（Vercelと同じ）

# 5. デプロイ開始
```

**取得できるURL:**
```
https://persona-ai-production.up.railway.app
```

---

<a name="cloudflare"></a>
## ☁️ **代替案: Cloudflare Pages デプロイ**

### **特徴:**
- ✅ 完全無料（無制限）
- ✅ 超高速CDN
- ✅ Cloudflare Workers対応

### **手順:**

```bash
# 1. Cloudflareアカウント作成
https://dash.cloudflare.com/sign-up

# 2. Workers & Pages → Create application

# 3. Pages → Connect to Git

# 4. persona-ai-saas を選択

# 5. ビルド設定
Build command: npm run build
Build output: dist
Root directory: frontend

# 6. Deploy
```

**取得できるURL:**
```
https://persona-ai.pages.dev
```

---

## 📊 **3つの方法の比較**

| 方法 | URL | コスト | 時間 | 難易度 | おすすめ度 |
|---|---|---|---|---|---|
| **Vercel（無料）** | `persona-ai.vercel.app` | ¥0 | 10分 | ★☆☆ | ⭐️⭐️⭐️⭐️⭐️ |
| **独自ドメイン** | `persona-ai.com` | ¥1,280/年 | 30分 | ★★☆ | ⭐️⭐️⭐️⭐️⭐️ |
| **Vercel + 独自ドメイン** | `persona-ai.com` | ¥1,280/年 | 40分 | ★★★ | ⭐️⭐️⭐️⭐️⭐️ |

---

## ✅ **まとめ: どの方法を選ぶべきか？**

### **🎯 おすすめの選択:**

#### **今すぐAdSense審査を通したい:**
→ **Vercel無料デプロイ**（10分）
```
URL: https://persona-ai.vercel.app
```

#### **本格的にサービス運営したい:**
→ **独自ドメイン購入 + Vercel**（40分）
```
URL: https://persona-ai.com
```

#### **予算を抑えたい:**
→ **Vercel無料デプロイ** → 後で独自ドメイン追加
```
ステップ1: https://persona-ai.vercel.app（無料）
ステップ2: https://persona-ai.com（¥1,280/年）
```

---

## 🎉 **次のステップ**

### **本番環境URL取得後:**

1. ✅ **AdSense審査申請**
   - 取得したURLでAdSenseに登録
   - `https://persona-ai.vercel.app` or `https://persona-ai.com`

2. ✅ **サイトの最終確認**
   - すべてのページが正常に動作するか確認
   - プライバシーポリシー（`/privacy`）が表示されるか
   - 利用規約（`/terms`）が表示されるか

3. ✅ **SEO対策**
   - Google Search Consoleに登録
   - サイトマップを送信
   - メタタグを最適化

4. ✅ **収益化開始**
   - AdSense審査通過
   - 広告表示
   - 収益発生！

---

**作成日**: 2026-02-12  
**最終更新**: 2026-02-12  
**バージョン**: 1.0.0
