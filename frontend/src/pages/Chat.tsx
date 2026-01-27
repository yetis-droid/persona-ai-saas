import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Persona, Conversation } from '../types';
import api from '../utils/api';

const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState<Array<{ role: 'user' | 'ai'; content: string; isNgDetected?: boolean }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPersona();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadPersona = async () => {
    try {
      const response = await api.get(`/api/personas/${id}`);
      setPersona(response.data.persona);
    } catch (err: any) {
      setError(err.response?.data?.error || '人格の取得に失敗しました');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage('');
    setLoading(true);
    setError('');

    // ユーザーメッセージを即座に表示
    setConversations(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await api.post('/api/chat', {
        personaId: id,
        message: userMessage
      });

      const { reply, isNgDetected } = response.data;

      // AI返信を表示
      setConversations(prev => [...prev, { role: 'ai', content: reply, isNgDetected }]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'メッセージの送信に失敗しました');
      // エラーの場合は最後のユーザーメッセージを削除
      setConversations(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  if (!persona) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{persona.creatorCallname}</h1>
              <p className="text-sm text-gray-600">{persona.oneLiner}</p>
            </div>
          </div>
          
          <Link
            to={`/personas/${id}/conversations`}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            会話ログ
          </Link>
        </div>
      </header>

      {/* チャットエリア */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {conversations.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-600">メッセージを送信して会話を始めましょう</p>
            </div>
          ) : (
            conversations.map((conv, index) => (
              <div key={index} className={`flex ${conv.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    conv.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : conv.isNgDetected
                      ? 'bg-red-50 border border-red-200 text-red-700'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  {conv.role === 'ai' && conv.isNgDetected && (
                    <div className="text-xs text-red-600 mb-2 font-semibold">⚠️ NG話題検知</div>
                  )}
                  <p className="whitespace-pre-wrap">{conv.content}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 入力エリア */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              placeholder="メッセージを入力..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '送信中...' : '送信'}
            </button>
          </form>
          
          <p className="mt-2 text-xs text-gray-500 text-center">
            NG話題（恋愛、政治、宗教、医療、法律、投資、他者批判、個人情報）は自動的に拒否されます
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
