import { useState, useEffect, useRef } from 'react';
import { supabase, ChatMessage } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { Send, Sparkles, Copy, ThumbsUp, RotateCcw, Lightbulb } from 'lucide-react';
// import { generateNathIAResponse } from '../services/nathia-enhanced.service';
import { generateNathIAStudyResponse } from '../../../services/bible-studies.service';
import { logger } from '../../../utils/logger';

// Mock function for generateNathIAResponse
const generateNathIAResponse = async (message: string, context: any) => {
  return {
    response: `Olá! Recebi sua mensagem: "${message}". Como posso ajudá-la hoje?`,
    suggestions: ['Dicas de maternidade', 'Cuidados com o bebê', 'Rotina diária']
  };
};

export const ChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = [
    "Como lidar com birras?",
    "Dicas para sono do bebê",
    "Me sinto sobrecarregada",
    "Como organizar a rotina?",
    "Dicas de alimentação",
    "Como lidar com culpa materna?",
    "Quero um estudo bíblico",
    "Versículo para hoje",
    "Oração para mães",
    "Reflexão espiritual"
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
      fetchMessages();
    } catch (error) {
      logger.error('Error sending message', { context: 'ChatPage', data: error });
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = (message: string) => {
    navigator.clipboard.writeText(message);
  };

  const regenerateResponse = async (lastUserMessage: string) => {
    setLoading(true);
    try {
      // Remove last AI message
      const lastAIMessage = messages[messages.length - 1];
      if (lastAIMessage && !lastAIMessage.is_user) {
        await supabase
          .from('chat_messages')
          .delete()
          .eq('id', lastAIMessage.id);
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
      {/* Header Mobile-First */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">NathIA</h2>
              <p className="text-xs text-white/90">Sua assistente pessoal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs">Online</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-neutral-800 p-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-lg mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Olá! Eu sou a NathIA 💕
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 px-4">
              Estou aqui para te ajudar com dicas de maternidade, estudos bíblicos e muito mais!
            </p>

            {/* Quick Suggestions Mobile-First */}
            <div className="space-y-2 max-w-sm mx-auto">
              {quickSuggestions.slice(0, 6).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full p-3 text-left bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-lg hover:shadow-md transition-all text-sm text-gray-700 dark:text-gray-300 active:scale-95"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-pink-500" />
                    </div>
                    <span className="font-medium">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.is_user ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.is_user
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                : 'bg-white dark:bg-neutral-700 text-gray-800 dark:text-white shadow-md border border-gray-100 dark:border-neutral-600'
                }`}
            >
              {!message.is_user && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-pink-500">NathIA</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{message.message}</p>

              {/* Message Actions */}
              {!message.is_user && (
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-200 dark:border-neutral-600">
                  <button
                    onClick={() => copyMessage(message.message)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-600 rounded-lg transition-colors"
                    title="Copiar"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => regenerateResponse(messages[index - 1]?.message || '')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-600 rounded-lg transition-colors"
                    title="Regenerar"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-600 rounded-lg transition-colors"
                    title="Curtir"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-neutral-700 rounded-2xl px-4 py-3 shadow-md border border-gray-100 dark:border-neutral-600">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-medium text-pink-500">NathIA está digitando...</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-neutral-800 p-4 border-t border-gray-200 dark:border-neutral-700">
        <form onSubmit={handleSubmit} className="flex gap-3">
          {/* Message Input */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-full border border-gray-300 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all text-sm"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

