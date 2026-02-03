// UTF-8対応のbase64エンコード関数
const utf8ToBase64 = (str: string): string => {
  // UTF-8文字列をバイト配列に変換してからbase64エンコード
  return btoa(unescape(encodeURIComponent(str)));
};

export const dummyBanners = {
  // 画面下部固定バナー（728x90）
  bottomBanner: 'data:image/svg+xml;base64,' + utf8ToBase64(`
    <svg width="728" height="90" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:rgb(59,130,246);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(147,51,234);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="728" height="90" fill="url(#grad1)"/>
      <text x="364" y="35" font-family="Arial" font-size="20" fill="white" text-anchor="middle" font-weight="bold">
        🎯 広告スペース - 728x90px
      </text>
      <text x="364" y="60" font-family="Arial" font-size="14" fill="white" text-anchor="middle" opacity="0.9">
        ここに広告バナーが表示されます
      </text>
    </svg>
  `),
  
  // インタースティシャル広告（300x250）
  interstitialAd: 'data:image/svg+xml;base64,' + utf8ToBase64(`
    <svg width="300" height="250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(236,72,153);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(249,115,22);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="300" height="250" fill="url(#grad2)"/>
      <text x="150" y="110" font-family="Arial" font-size="18" fill="white" text-anchor="middle" font-weight="bold">
        📺 インタースティシャル
      </text>
      <text x="150" y="140" font-family="Arial" font-size="14" fill="white" text-anchor="middle" opacity="0.9">
        300x250px
      </text>
    </svg>
  `),
  
  // リワード広告（320x480）
  rewardAd: 'data:image/svg+xml;base64,' + utf8ToBase64(`
    <svg width="320" height="480" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(16,185,129);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(5,150,105);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="320" height="480" fill="url(#grad3)"/>
      <text x="160" y="220" font-family="Arial" font-size="20" fill="white" text-anchor="middle" font-weight="bold">
        🎁 リワード広告
      </text>
      <text x="160" y="250" font-family="Arial" font-size="14" fill="white" text-anchor="middle" opacity="0.9">
        視聴完了で+1チケット
      </text>
      <text x="160" y="280" font-family="Arial" font-size="12" fill="white" text-anchor="middle" opacity="0.8">
        320x480px
      </text>
    </svg>
  `),
  
  // アフィリエイトバナー1（468x60）
  affiliateBanner1: 'data:image/svg+xml;base64,' + utf8ToBase64(`
    <svg width="468" height="60" xmlns="http://www.w3.org/2000/svg">
      <rect width="468" height="60" fill="#667eea"/>
      <text x="234" y="30" font-family="Arial" font-size="16" fill="white" text-anchor="middle" font-weight="bold">
        ✨ Canva Pro - プロ仕様のデザインツール
      </text>
      <text x="234" y="48" font-family="Arial" font-size="11" fill="white" text-anchor="middle" opacity="0.9">
        468x60px - アフィリエイト広告スペース
      </text>
    </svg>
  `),
  
  // アフィリエイトバナー2（468x60）
  affiliateBanner2: 'data:image/svg+xml;base64,' + utf8ToBase64(`
    <svg width="468" height="60" xmlns="http://www.w3.org/2000/svg">
      <rect width="468" height="60" fill="#f093fb"/>
      <text x="234" y="30" font-family="Arial" font-size="16" fill="white" text-anchor="middle" font-weight="bold">
        🎨 Adobe Creative Cloud - クリエイターの必須ツール
      </text>
      <text x="234" y="48" font-family="Arial" font-size="11" fill="white" text-anchor="middle" opacity="0.9">
        468x60px - アフィリエイト広告スペース
      </text>
    </svg>
  `)
};
