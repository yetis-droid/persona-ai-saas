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

  const stepTitles = [
    '基本情報',
    '話し方',
    '距離感',
    '世界観',
    'よくある質問',
    '追加NG話題',
    '共有情報',
    '確認'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            ダッシュボードに戻る
          </Link>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">新しい人格を作成</h1>
                <p className="text-gray-600 mt-1">ステップ {currentStep} / {totalSteps}: {stepTitles[currentStep - 1]}</p>
              </div>
            </div>
            
            {/* ステップインジケーター */}
            <div className="flex items-center justify-between mb-4">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      step < currentStep
                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg'
                        : step === currentStep
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {step < currentStep ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : step}
                    </div>
                    <span className={`text-xs mt-1 font-medium ${
                      step === currentStep ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {stepTitles[step - 1]}
                    </span>
                  </div>
                  {step < totalSteps && (
                    <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                      step < currentStep ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {/* プログレスバー */}
            <div className="mt-6 bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center space-x-3 shadow-lg">
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">
              {error}</span>
            </div>
          )}

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-10">
            {/* Step 1: 基本情報 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl font-bold">1</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">基本情報</h2>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    活動ジャンル *
                  </label>
                  <input
                    {...register('genre', { required: '活動ジャンルを入力してください' })}
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="例: 音楽、イラスト、文学、YouTuber など"
                  />
                  {errors.genre && <p className="mt-2 text-sm text-red-600 flex items-center"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.genre.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    一言説明 *
                  </label>
                  <input
                    {...register('oneLiner', { required: '一言説明を入力してください' })}
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="例: ポップでカラフルな世界を描くイラストレーター"
                  />
                  {errors.oneLiner && <p className="mt-2 text-sm text-red-600 flex items-center"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.oneLiner.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    呼ばれたい名前 *
                  </label>
                  <input
                    {...register('creatorCallname', { required: '呼ばれたい名前を入力してください' })}
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="例: まりん、太郎、Kei など"
                  />
                  {errors.creatorCallname && <p className="mt-2 text-sm text-red-600 flex items-center"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.creatorCallname.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ファンの呼び方 *
                  </label>
                  <input
                    {...register('fanCallname', { required: 'ファンの呼び方を入力してください' })}
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="例: みんな、フォロワーさん、◯◯民 など"
                  />
                  {errors.fanCallname && <p className="mt-2 text-sm text-red-600 flex items-center"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.fanCallname.message}</p>}
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
            <div className="flex justify-between mt-10 pt-8 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="inline-flex items-center space-x-2 px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>戻る</span>
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 font-medium"
                >
                  <span>次へ</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 font-medium"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>作成中...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>作成</span>
                    </>
                  )}
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
