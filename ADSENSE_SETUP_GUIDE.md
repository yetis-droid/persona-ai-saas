# Google AdSense セットアップガイド

## 📋 **完了状況**

✅ **実装完了：**
- AdBannerコンポーネント作成（`frontend/src/components/AdBanner.tsx`）
- 5ページに広告配置（ダッシュボード、チャット、会話履歴、ランディング）
- 無料プラン: 広告表示
- プレミアムプラン: 広告非表示
- 開発環境: ダミー広告表示
- 本番環境: Google AdSense広告表示

⏳ **要対応：**
- Google AdSenseアカウント登録
- サイト審査申請
- Publisher IDとAd Slot IDの取得・設定

---

## 🚀 **Google AdSenseセットアップ手順**

### **Step 1: AdSenseアカウント作成**

1. **AdSenseにアクセス**
   - URL: https://www.google.com/adsense/
   - Googleアカウントでログイン

2. **サイト情報を入力**
   - サイトURL: あなたのPersona AIサービスのURL
   - サイトの言語: 日本語
   - コンテンツカテゴリ: テクノロジー / SaaS

3. **支払い情報を設定**
   - 住所・電話番号を入力
   - 銀行口座を登録（収益受取用）

---

### **Step 2: サイトにAdSenseコードを追加（既に完了）**

以下のファイルに既にAdSenseスクリプトが追加済みです：

**`frontend/index.html` (12-20行目):**
```html
<!-- Google AdSense Script -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```

**✅ TODO: `ca-pub-XXXXXXXXXXXXXXXX` を実際のPublisher IDに置き換える**

---

### **Step 3: サイト審査を申請**

1. **AdSenseダッシュボードにログイン**
2. **「サイトを追加」をクリック**
3. **サイトURLを入力して審査を申請**

**審査通過の条件：**
- ✅ オリジナルコンテンツが豊富
- ✅ プライバシーポリシーが明記されている（`/privacy`）
- ✅ 利用規約が明記されている（`/terms`）
- ✅ サイトが6ヶ月以上運営されている（推奨）
- ✅ 定期的に更新されている
- ✅ 違法コンテンツがない

**審査期間：**
- 通常1-2週間
- 最大4週間かかることもある

---

### **Step 4: 広告ユニットを作成**

審査通過後、以下の手順で広告ユニットを作成：

1. **AdSenseダッシュボード → 「広告」 → 「広告ユニットごと」**
2. **以下の4つの広告ユニットを作成：**

#### **1. ダッシュボード用 - 横長バナー**
- **名前**: Dashboard Horizontal Banner
- **広告タイプ**: ディスプレイ広告
- **サイズ**: レスポンシブ（推奨）または 728x90
- **取得したAd Slot ID**: `1234567890` を置き換え

#### **2. チャット画面用 - 長方形**
- **名前**: Chat Rectangle Ad
- **広告タイプ**: ディスプレイ広告
- **サイズ**: レスポンシブ（推奨）または 336x280
- **取得したAd Slot ID**: `2345678901` を置き換え

#### **3. 会話履歴用 - 長方形**
- **名前**: Conversations Rectangle Ad
- **広告タイプ**: ディスプレイ広告
- **サイズ**: レスポンシブ（推奨）または 336x280
- **取得したAd Slot ID**: `3456789012` を置き換え

#### **4. ランディングページ用 - 横長バナー**
- **名前**: Landing Page Horizontal Banner
- **広告タイプ**: ディスプレイ広告
- **サイズ**: レスポンシブ（推奨）または 970x90
- **取得したAd Slot ID**: `4567890123` を置き換え

---

### **Step 5: コードにPublisher IDとAd Slot IDを設定**

#### **1. index.htmlを更新**

**ファイル**: `frontend/index.html`

```html
<!-- 変更前 -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>

<!-- 変更後（実際のPublisher IDに置き換え）-->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
     crossorigin="anonymous"></script>
```

#### **2. AdBanner.tsxを更新**

**ファイル**: `frontend/src/components/AdBanner.tsx`

**53行目あたり:**
```typescript
// 変更前
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"

// 変更後（実際のPublisher IDに置き換え）
data-ad-client="ca-pub-1234567890123456"
```

#### **3. 各ページのAdBannerコンポーネントでadSlotを更新**

| ページ | ファイル | 行番号 | 現在のadSlot | 置き換え先 |
|---|---|---|---|---|
| ダッシュボード | `Dashboard.tsx` | 533 | `"1234567890"` | AdSenseで取得したID |
| チャット | `Chat.tsx` | 226 | `"2345678901"` | AdSenseで取得したID |
| 会話履歴 | `Conversations.tsx` | 237 | `"3456789012"` | AdSenseで取得したID |
| ランディング | `Landing.tsx` | 209 | `"4567890123"` | AdSenseで取得したID |

---

### **Step 6: デプロイと動作確認**

1. **変更をコミット:**
```bash
cd /home/user/webapp/persona-ai-saas
git add .
git commit -m "chore: AdSense Publisher IDとAd Slot IDを設定"
git push origin main
```

2. **本番環境にデプロイ:**
```bash
# Railway等にデプロイ
npm run build
npm run deploy
```

3. **動作確認:**
   - 無料プランユーザーでログイン
   - ダッシュボードに広告が表示されることを確認
   - チャット画面で5件以上会話後、広告が表示されることを確認
   - プレミアムプランユーザーでログイン
   - 広告が表示されないことを確認

---

## 💡 **広告収益の最大化Tips**

### **1. 広告配置の最適化**
- ✅ 既に実装済み: ページの上部・中央に配置
- ✅ コンテンツと広告のバランスが取れている
- ✅ ユーザー体験を損なわない配置

### **2. プレミアムプランへの誘導強化**
- ✅ 既に実装済み: 料金ページに「広告完全非表示」を強調
- ✅ ダッシュボードに「アップグレード」ボタン配置

### **3. コンテンツの充実**
- 定期的な機能追加
- ブログ記事の公開
- FAQ・ヘルプページの充実

### **4. SEO対策**
- メタタグの最適化（既に実装済み）
- サイトマップの作成
- Google Search Consoleへの登録

---

## 📊 **収益予測**

### **前提条件:**
- 無料プランユーザー: 1,000人/月
- ダッシュボード表示: 1人あたり30回/月
- 広告クリック率（CTR）: 1%
- クリック単価（CPC）: ¥50

### **計算:**
```
月間広告表示回数 = 1,000人 × 30回 = 30,000回
月間クリック数 = 30,000回 × 1% = 300クリック
月間収益 = 300クリック × ¥50 = ¥15,000
```

**無料プランユーザー数による収益シミュレーション:**
- 100人/月: ¥1,500/月
- 500人/月: ¥7,500/月
- 1,000人/月: ¥15,000/月
- 5,000人/月: ¥75,000/月
- 10,000人/月: ¥150,000/月

---

## ⚠️ **AdSenseポリシー遵守事項**

### **禁止行為:**
- ❌ 自分で広告をクリックする
- ❌ 友人に広告クリックを依頼する
- ❌ 「広告をクリックしてください」と促す
- ❌ 誤クリックを誘発する配置
- ❌ ポップアップ広告との併用

### **推奨事項:**
- ✅ オリジナルコンテンツの作成
- ✅ ユーザー体験の向上
- ✅ 定期的なコンテンツ更新
- ✅ プライバシーポリシーの明記（既に実装済み）

---

## 🔧 **トラブルシューティング**

### **広告が表示されない場合:**

1. **AdSenseアカウントの確認:**
   - 審査が通過しているか確認
   - アカウントが停止されていないか確認

2. **コードの確認:**
   - Publisher IDが正しいか確認
   - Ad Slot IDが正しいか確認
   - `index.html`にスクリプトが追加されているか確認

3. **ブラウザの確認:**
   - 広告ブロッカーが有効になっていないか確認
   - シークレットモードで試す

4. **開発環境の確認:**
   - 本番環境でのみAdSense広告が表示される
   - 開発環境ではダミー広告が表示される

---

## 📞 **サポート**

- **AdSenseヘルプセンター**: https://support.google.com/adsense/
- **AdSenseコミュニティ**: https://support.google.com/adsense/community
- **Persona AI開発者**: support@persona-ai.com

---

**作成日**: 2026-02-12  
**最終更新**: 2026-02-12  
**バージョン**: 1.0.0
