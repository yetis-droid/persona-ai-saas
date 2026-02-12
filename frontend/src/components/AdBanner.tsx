import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

interface AdBannerProps {
  /**
   * 広告スロットID（Google AdSenseから取得）
   * 例: "1234567890"
   */
  adSlot: string;
  
  /**
   * 広告フォーマット
   * - 'horizontal': 横長バナー (728x90, 970x90)
   * - 'rectangle': 長方形 (336x280, 300x250)
   * - 'vertical': 縦長 (160x600, 120x600)
   * - 'auto': レスポンシブ（推奨）
   */
  format?: 'horizontal' | 'rectangle' | 'vertical' | 'auto';
  
  /**
   * フルWidthレスポンシブ広告にするか
   */
  fullWidthResponsive?: boolean;
  
  /**
   * カスタムスタイル
   */
  className?: string;
}

/**
 * Google AdSense広告コンポーネント
 * 
 * 使用方法:
 * 1. Google AdSenseに登録: https://www.google.com/adsense/
 * 2. サイトを追加して審査を通過
 * 3. 広告ユニットを作成してスロットIDを取得
 * 4. index.htmlに<script>タグを追加:
 *    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
 * 5. このコンポーネントでadSlotを指定
 * 
 * 注意:
 * - 無料プランユーザーのみに表示（プレミアムは広告非表示）
 * - AdSense審査に合格するまではテスト広告が表示される
 * - 本番環境でのみ実際の広告が表示される
 */
const AdBanner: React.FC<AdBannerProps> = ({
  adSlot,
  format = 'auto',
  fullWidthResponsive = true,
  className = ''
}) => {
  const { user } = useAuthStore();

  useEffect(() => {
    try {
      // AdSenseスクリプトが読み込まれているか確認
      if (window.adsbygoogle) {
        // 広告をプッシュ
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  // プレミアムユーザーには広告を表示しない
  if (user?.plan === 'premium') {
    return null;
  }

  // 広告フォーマットに応じたスタイルクラス
  const getFormatClass = () => {
    switch (format) {
      case 'horizontal':
        return 'min-h-[90px] md:min-h-[90px]';
      case 'rectangle':
        return 'min-h-[250px] md:min-h-[280px]';
      case 'vertical':
        return 'min-h-[600px]';
      case 'auto':
      default:
        return 'min-h-[100px]';
    }
  };

  return (
    <div className={`w-full flex justify-center items-center my-4 ${className}`}>
      <div className={`w-full max-w-full overflow-hidden ${getFormatClass()}`}>
        {/* Google AdSense広告 */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // TODO: 実際のAdSenseクライアントIDに置き換え
          data-ad-slot={adSlot}
          data-ad-format={format}
          data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
        ></ins>
        
        {/* 開発環境用のダミー広告表示 */}
        {import.meta.env.DEV && (
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="text-gray-500 mb-2">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">Google AdSense広告枠</p>
            <p className="text-xs text-gray-500 mt-1">開発環境ではダミー表示</p>
            <p className="text-xs text-gray-400 mt-1">Format: {format} | Slot: {adSlot}</p>
            <p className="text-xs text-blue-600 mt-2 font-medium">
              プレミアムプランで広告非表示 →
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdBanner;

// TypeScript用のWindow型拡張
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
