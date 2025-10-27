import { useState, useEffect, useRef } from 'react';
import { supabase, ChatMessage } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  Send,
  Sparkles,
  Copy,
  ThumbsUp,
  RotateCcw,
  Lightbulb,
  Check,
  Share2,
  Trash2,
  Clock,
} from 'lucide-react';
import { generateNathIAResponse } from '../services/nathia-enhanced.service';
import { generateNathIAStudyResponse } from '../services/bible-studies.service';
import { logger } from '../utils/logger';
import { useHapticFeedback } from '../hooks/useGestures';

export const ChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { user } = useAuth();
  const { triggerHaptic } = useHapticFeedback();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = [
    'Como lidar com birras?',
    'Dicas para sono do bebê',
    'Me sinto sobrecarregada',
    'Como organizar a rotina?',
    'Dicas de alimentação',
    'Como lidar com culpa materna?',
    'Quero um estudo bíblico',
    'Versículo para hoje',
    'Oração para mães',
    'Reflexão espiritual',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data);
      setTimeout(scrollToBottom, 100);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    setTyping(true);
    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Verificar se a mensagem é sobre estudos bíblicos
      const isBibleStudyMessage =
        userMessage.toLowerCase().includes('estudo') ||
        userMessage.toLowerCase().includes('bíblia') ||
        userMessage.toLowerCase().includes('versículo') ||
        userMessage.toLowerCase().includes('oração') ||
        userMessage.toLowerCase().includes('deus') ||
        userMessage.toLowerCase().includes('fé') ||
        userMessage.toLowerCase().includes('espiritual');

      if (isBibleStudyMessage) {
        // Usar o serviço de estudos bíblicos
        const studyResponse = await generateNathIAStudyResponse(userMessage, user.id);
        return studyResponse.message;
      } else {
        // Usar o serviço de memória conversacional padrão
        const response = await generateNathIAResponse(userMessage, user.id);
        return response.message;
      }
    } catch (error) {
      logger.error('Error getting AI response', { context: 'ChatPage', data: error });
      // Fallback response premium da Nath
      const fallbacks = [
        'Oi, querida! Que lindo compartilhar isso comigo! Como mãe, sei exatamente como você se sente. Você está fazendo um trabalho maravilhoso - lembre-se: você não precisa ser perfeita, apenas presente. 💕 - Nath',
        'Entendo perfeitamente como você se sente! A maternidade traz desafios únicos, mas também tantas alegrias. Você é mais forte do que imagina! Se precisar de produtos NAVA para te ajudar, me chama! ✨ - Nath',
        'Que benção poder conversar com você! Saiba que você está fazendo o melhor que pode. Cada pequeno passo é uma vitória. Estou aqui para te apoiar sempre! 🌸 - Nath',
      ];
      return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    } finally {
      setTyping(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    setLoading(true);
    triggerHaptic('light');
    try {
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        message: newMessage.trim(),
        is_user: true,
      });

      const aiResponse = await getAIResponse(newMessage);

      await supabase.from('chat_messages').insert({
        user_id: user.id,
        message: aiResponse,
        is_user: false,
      });

      setNewMessage('');
      triggerHaptic('medium');
      fetchMessages();
    } catch (error) {
      logger.error('Error sending message', { context: 'ChatPage', data: error });
      triggerHaptic('heavy');
      showToastMessage('Erro ao enviar mensagem');
    } finally {
      setLoading(false);
    }
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const copyMessage = async (message: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(message);
      setCopiedMessageId(messageId);
      triggerHaptic('medium');
      showToastMessage('Mensagem copiada!');
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      logger.error('Error copying message', { context: 'ChatPage', data: error });
      showToastMessage('Erro ao copiar mensagem');
    }
  };

  const shareMessage = async (message: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Mensagem da NathIA',
          text: message,
        });
        triggerHaptic('medium');
      } else {
        await navigator.clipboard.writeText(message);
        showToastMessage('Mensagem copiada para compartilhar!');
      }
    } catch (error) {
      logger.error('Error sharing message', { context: 'ChatPage', data: error });
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await supabase.from('chat_messages').delete().eq('id', messageId);
      triggerHaptic('medium');
      showToastMessage('Mensagem deletada');
      fetchMessages();
    } catch (error) {
      logger.error('Error deleting message', { context: 'ChatPage', data: error });
      showToastMessage('Erro ao deletar mensagem');
    }
  };

  const regenerateResponse = async (lastUserMessage: string) => {
    setLoading(true);
    try {
      // Remove last AI message
      const lastAIMessage = messages[messages.length - 1];
      if (lastAIMessage && !lastAIMessage.is_user) {
        await supabase.from('chat_messages').delete().eq('id', lastAIMessage.id);
      }

      // Generate new response
      const aiResponse = await getAIResponse(lastUserMessage);
      await supabase.from('chat_messages').insert({
        user_id: user!.id,
        message: aiResponse,
        is_user: false,
      });

      fetchMessages();
    } catch (error) {
      logger.error('Error regenerating response', { context: 'ChatPage', data: error });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto bg-white dark:bg-neutral-900">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down">
          <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header Mobile-First Premium */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 p-4 text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-50"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                NathIA
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-semibold">
                  PRO
                </span>
              </h2>
              <div className="flex items-center gap-2 text-xs text-white/90">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Online agora</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => showToastMessage(`${messages.length} mensagens nesta conversa`)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Informações da sessão"
            >
              <Clock className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white dark:from-neutral-900 dark:to-neutral-800 p-4">
        {messages.length === 0 && (
          <div className="text-center py-8 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl mb-6 animate-bounce-slow">
              <Sparkles className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              Olá! Eu sou a NathIA 💕
            </h3>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-8 px-4 max-w-md mx-auto leading-relaxed">
              Sua assistente pessoal especializada em maternidade, fé e bem-estar. Como posso te
              ajudar hoje?
            </p>

            {/* Quick Suggestions Premium Mobile-First */}
            <div className="space-y-3 max-w-md mx-auto">
              {quickSuggestions.slice(0, 6).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleSuggestionClick(suggestion);
                    triggerHaptic('light');
                  }}
                  className="w-full p-4 text-left bg-white dark:bg-neutral-700 border-2 border-gray-200 dark:border-neutral-600 rounded-2xl hover:shadow-xl hover:border-pink-300 dark:hover:border-pink-600 transition-all text-sm text-gray-700 dark:text-gray-300 active:scale-95 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                      <Lightbulb className="w-5 h-5 text-pink-500" />
                    </div>
                    <span className="font-semibold flex-1">{suggestion}</span>
                    <Send className="w-4 h-4 text-gray-400 group-hover:text-pink-500 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.is_user ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in-up`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                message.is_user
                  ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-xl'
                  : 'bg-white dark:bg-neutral-700 text-gray-800 dark:text-white shadow-lg border border-gray-100 dark:border-neutral-600'
              }`}
            >
              {!message.is_user && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-bold text-pink-600 dark:text-pink-400">NathIA</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">agora</span>
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>

              {/* Message Actions Premium */}
              {!message.is_user && (
                <div className="flex items-center gap-1 mt-4 pt-3 border-t border-gray-200 dark:border-neutral-600">
                  <button
                    onClick={() => copyMessage(message.message, message.id)}
                    className={`p-2.5 hover:bg-pink-50 dark:hover:bg-neutral-600 rounded-xl transition-all ${
                      copiedMessageId === message.id ? 'bg-green-50 dark:bg-green-900/20' : ''
                    }`}
                    title="Copiar"
                  >
                    {copiedMessageId === message.id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      regenerateResponse(messages[index - 1]?.message || '');
                      triggerHaptic('medium');
                    }}
                    className="p-2.5 hover:bg-pink-50 dark:hover:bg-neutral-600 rounded-xl transition-all"
                    title="Regenerar"
                  >
                    <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => shareMessage(message.message)}
                    className="p-2.5 hover:bg-pink-50 dark:hover:bg-neutral-600 rounded-xl transition-all"
                    title="Compartilhar"
                  >
                    <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      showToastMessage('Obrigada pelo feedback!');
                    }}
                    className="p-2.5 hover:bg-pink-50 dark:hover:bg-neutral-600 rounded-xl transition-all"
                    title="Curtir"
                  >
                    <ThumbsUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              )}

              {/* User Message Actions */}
              {message.is_user && (
                <div className="flex items-center justify-end gap-1 mt-3 pt-2 border-t border-white/20">
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Deletar"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white/80" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator Premium */}
        {typing && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white dark:bg-neutral-700 rounded-2xl px-5 py-4 shadow-xl border border-gray-100 dark:border-neutral-600">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                </div>
                <span className="text-sm font-semibold text-pink-600 dark:text-pink-400">
                  NathIA está pensando...
                </span>
              </div>
              <div className="flex items-center gap-1.5 pl-10">
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2.5 h-2.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0.15s' }}
                ></div>
                <div
                  className="w-2.5 h-2.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0.3s' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area Premium */}
      <div className="bg-white dark:bg-neutral-800 p-4 border-t-2 border-gray-200 dark:border-neutral-700 shadow-2xl">
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
          {/* Message Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Pergunte algo para a NathIA..."
              disabled={loading}
              className="w-full px-5 py-4 pr-12 rounded-2xl border-2 border-gray-300 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-sm placeholder:text-gray-400 disabled:opacity-50"
            />
            {newMessage.trim() && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {newMessage.length} caracteres
              </div>
            )}
          </div>

          {/* Send Button Premium */}
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="p-4 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[56px] flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            ) : (
              <Send className="w-6 h-6" />
            )}
          </button>
        </form>

        {/* Character count and tips */}
        <div className="flex items-center justify-between mt-3 px-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Dica: Seja específica para respostas mais personalizadas
          </p>
          <p className="text-xs text-gray-400">{messages.length} mensagens</p>
        </div>
      </div>
    </div>
  );
};
