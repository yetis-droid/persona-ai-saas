import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PersonaFormData } from '../types';
import api from '../utils/api';

const PersonaForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<PersonaFormData>();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formData = watch();

  const totalSteps = 8;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: PersonaFormData) => {
    setLoading(true);
    setError('');

    try {
      await api.post('/api/personas', data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || '人格作成に失敗しました');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            ダッシュボードに戻る
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">新しい人格を作成</h1>
          <p className="text-gray-600 mt-2">ステップ {currentStep} / {totalSteps}</p>
          
          {/* プログレスバー */}
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Step 1: 基本情報 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">基本情報</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    活動ジャンル *
                  </label>
                  <input
                    {...register('genre', { required: '活動ジャンルを入力してください' })}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 音楽、イラスト、文学、YouTuber など"
                  />
                  {errors.genre && <p className="mt-1 text-sm text-red-600">{errors.genre.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    一言説明 *
                  </label>
                  <input
                    {...register('oneLiner', { required: '一言説明を入力してください' })}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: ポップでカラフルな世界を描くイラストレーター"
                  />
                  {errors.oneLiner && <p className="mt-1 text-sm text-red-600">{errors.oneLiner.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    呼ばれたい名前 *
                  </label>
                  <input
                    {...register('creatorCallname', { required: '呼ばれたい名前を入力してください' })}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: まりん、太郎、Kei など"
                  />
                  {errors.creatorCallname && <p className="mt-1 text-sm text-red-600">{errors.creatorCallname.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ファンの呼び方 *
                  </label>
                  <input
                    {...register('fanCallname', { required: 'ファンの呼び方を入力してください' })}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: みんな、フォロワーさん、◯◯民 など"
                  />
                  {errors.fanCallname && <p className="mt-1 text-sm text-red-600">{errors.fanCallname.message}</p>}
                </div>
              </div>
            )}

            {/* Step 2: 話し方 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">話し方</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    口調 *
                  </label>
                  <input
                    {...register('tone', { required: '口調を入力してください' })}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: フレンドリー、丁寧、カジュアル、元気 など"
                  />
                  {errors.tone && <p className="mt-1 text-sm text-red-600">{errors.tone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    丁寧度 (1-5) *
                  </label>
                  <input
                    {...register('politenessLevel', {
                      required: '丁寧度を選択してください',
                      min: { value: 1, message: '1以上を選択してください' },
                      max: { value: 5, message: '5以下を選択してください' }
                    })}
                    type="number"
                    min="1"
                    max="5"
                    defaultValue="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-sm text-gray-500">1=超カジュアル, 5=超丁寧</p>
                  {errors.politenessLevel && <p className="mt-1 text-sm text-red-600">{errors.politenessLevel.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    絵文字使用頻度 *
                  </label>
                  <select
                    {...register('emojiUsage', { required: '絵文字使用頻度を選択してください' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">選択してください</option>
                    <option value="使わない">使わない</option>
                    <option value="少し使う">少し使う</option>
                    <option value="普通に使う">普通に使う</option>
                    <option value="よく使う">よく使う</option>
                    <option value="たくさん使う">たくさん使う</option>
                  </select>
                  {errors.emojiUsage && <p className="mt-1 text-sm text-red-600">{errors.emojiUsage.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    返信の長さ *
                  </label>
                  <select
                    {...register('replyLength', { required: '返信の長さを選択してください' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">選択してください</option>
                    <option value="短め（1-2行）">短め（1-2行）</option>
                    <option value="普通（3-5行）">普通（3-5行）</option>
                    <option value="長め（6行以上）">長め（6行以上）</option>
                  </select>
                  {errors.replyLength && <p className="mt-1 text-sm text-red-600">{errors.replyLength.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    よく使う言い回し
                  </label>
                  <textarea
                    {...register('phrasingExamples')}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 「ありがとうね！」「嬉しいな〜」など"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    使わない言葉
                  </label>
                  <textarea
                    {...register('bannedPhrases')}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 「マジで」「ヤバい」など"
                  />
                </div>
              </div>
            )}

            {/* Step 3: 距離感 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">距離感・境界線</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    距離感タイプ
                  </label>
                  <select
                    {...register('relationshipStyle')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">選択してください</option>
                    <option value="友達のような近さ">友達のような近さ</option>
                    <option value="適度な距離感">適度な距離感</option>
                    <option value="ビジネスライク">ビジネスライク</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    雑談許容度
                  </label>
                  <select
                    {...register('smalltalkLevel')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">選択してください</option>
                    <option value="雑談OK">雑談OK</option>
                    <option value="活動に関することのみ">活動に関することのみ</option>
                    <option value="質問のみ対応">質問のみ対応</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    対応範囲
                  </label>
                  <textarea
                    {...register('supportScope')}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 活動に関する質問、作品の感想など"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    断り方のスタイル
                  </label>
                  <input
                    {...register('refusalStyle')}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: やんわり、はっきり、ユーモアを交えて など"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    境界線・注意事項
                  </label>
                  <textarea
                    {...register('boundaries')}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: プライベートな質問には答えません、他のクリエイターとの比較は避けてください など"
                  />
                </div>
              </div>
            )}

            {/* Step 4: 世界観 */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">世界観・価値観</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    世界観キーワード
                  </label>
                  <input
                    {...register('worldKeywords')}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: カラフル、ポップ、夢、希望、冒険 など"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    大切にしている価値観
                  </label>
                  <textarea
                    {...register('coreValues')}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 自由に表現すること、誰もが楽しめる作品作り など"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    一貫性を保つルール
                  </label>
                  <input
                    {...register('consistencyRule')}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 常にポジティブに、本人の視点は入れない など"
                  />
                </div>
              </div>
            )}

            {/* Step 5: FAQ */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">よくある質問（FAQ）</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Q&Aペア
                  </label>
                  <textarea
                    {...register('faqPairs')}
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例:&#10;Q: 作品のリクエストはできますか？&#10;A: ありがとうございます！今はリクエストを受け付けていませんが、将来的に検討しています。&#10;&#10;Q: コラボはしていますか？&#10;A: 条件次第で対応可能です。詳細はお問い合わせください。"
                  />
                  <p className="mt-1 text-sm text-gray-500">Q: と A: の形式で記入してください</p>
                </div>
              </div>
            )}

            {/* Step 6: 追加NG */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">追加NG話題</h2>
                
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>固定NG話題:</strong> 恋愛、政治、宗教、医療、法律、投資、他者批判、個人情報
                    <br />
                    これらは自動的に拒否されます。
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    追加で避けたい話題
                  </label>
                  <textarea
                    {...register('ngTopicsExtra')}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 過去の作品への批判、他のクリエイターとの比較、個人的な質問 など"
                  />
                </div>
              </div>
            )}

            {/* Step 7: 共有情報 */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">共有情報</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    共有リンク
                  </label>
                  <textarea
                    {...register('shareLinks')}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例:&#10;公式サイト: https://...&#10;Twitter: https://...&#10;作品集: https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    固定で伝えたい情報
                  </label>
                  <textarea
                    {...register('shareInfo')}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 新作情報、イベント情報、お知らせ など"
                  />
                </div>
              </div>
            )}

            {/* Step 8: 確認 */}
            {currentStep === 8 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">確認</h2>
                
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">入力内容のプレビュー</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">活動ジャンル:</span> {formData.genre}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">一言説明:</span> {formData.oneLiner}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">呼ばれたい名前:</span> {formData.creatorCallname}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">ファンの呼び方:</span> {formData.fanCallname}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">口調:</span> {formData.tone}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">丁寧度:</span> {formData.politenessLevel}/5
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 mr-3"
                    />
                    <span className="text-sm text-gray-700">
                      利用規約に同意し、固定NG話題（恋愛、政治、宗教、医療、法律、投資、他者批判、個人情報）を
                      遵守することを確認します。
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* ナビゲーションボタン */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                戻る
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  次へ
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? '作成中...' : '作成'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonaForm;
