import { useState, useEffect, useRef } from 'react';
import { supabase, ChatMessage } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Send, Sparkles, Copy, ThumbsUp, RotateCcw, Lightbulb, Mic, Paperclip } from 'lucide-react';
import { MemoryIndicator, MemoryIndicatorCompact } from './chat/MemoryIndicator';
import { generateNathIAResponse } from '../services/chat-history.service';
import { generateNathIAStudyResponse } from '../services/bible-studies.service';
import { NathLogo } from './ui/Logo';

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
      console.error('Error getting AI response:', error);
      // Fallback response se os serviços falharem
      const fallbacks = [
        'Que lindo compartilhar isso comigo! Você está fazendo um trabalho maravilhoso como mãe. Lembre-se: você não precisa ser perfeita, apenas presente. 💕',
        'Entendo como você se sente. A maternidade traz desafios únicos, mas também tantas alegrias. Você é mais forte do que imagina! ✨',
        'Que benção poder conversar com você! Saiba que você está fazendo o melhor que pode. Cada pequeno passo é uma vitória. 🌸',
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
      console.error('Error sending message:', error);
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
      console.error('Error regenerating response:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      {/* Header Mobile-First */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NathLogo className="hover:scale-110 transition-transform duration-300" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold">NathIA</h2>
              <p className="text-xs sm:text-sm text-white/90">Seu assistente com memória 💜</p>
            </div>
          </div>
          <MemoryIndicatorCompact />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="relative mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Heart className="w-3 h-3 text-yellow-800" />
              </div>
            </div>
            
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">
              Olá! Eu sou a NathIA 💕
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 px-4">
              Estou aqui para ouvir, apoiar e refletir com você. Lembro das nossas conversas anteriores para te dar um apoio ainda mais personalizado. Como posso ajudar hoje?
            </p>
            
            {/* Memory Indicator */}
            <div className="mb-6 px-4">
              <MemoryIndicator compact={true} />
            </div>
            
            {/* Quick Suggestions Mobile-First */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-w-2xl mx-auto px-4">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-3 sm:p-4 text-left bg-white dark:bg-gray-800 border border-pink-200 dark:border-pink-700 rounded-xl hover:shadow-md transition-all text-sm sm:text-base text-gray-700 dark:text-gray-300 touch-target group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
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
            className={`flex ${message.is_user ? 'justify-end' : 'justify-start'} mb-3`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 sm:px-4 py-3 sm:py-4 ${
                message.is_user
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md border border-gray-100 dark:border-gray-700'
              }`}
            >
              {!message.is_user && (
                <div className="flex items-center gap-2 mb-2">
                  <NathLogo size="sm" />
                  <span className="text-xs font-semibold text-pink-500">Robô Nath</span>
                </div>
              )}
              <p className="text-sm sm:text-base leading-relaxed">{message.message}</p>
              
              {/* Message Actions */}
              {!message.is_user && (
                <div className="flex items-center gap-1 sm:gap-2 mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => copyMessage(message.message)}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors touch-target"
                    title="Copiar mensagem"
                  >
                    <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => regenerateResponse(messages[index - 1]?.message || '')}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors touch-target"
                    title="Regenerar resposta"
                  >
                    <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors touch-target"
                    title="Curtir"
                  >
                    <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span className="text-xs font-medium text-pink-500">Robô Nath</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl sm:rounded-b-3xl"
      >
        <div className="flex gap-2 sm:gap-3">
          {/* Attachment Button */}
          <button
            type="button"
            className="p-2 sm:p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors touch-target"
            title="Anexar arquivo"
          >
            <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          {/* Message Input */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={loading}
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all text-sm sm:text-base"
          />
          
          {/* Voice Message Button */}
          <button
            type="button"
            className="p-2 sm:p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors touch-target"
            title="Mensagem de voz"
          >
            <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          {/* Send Button */}
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="p-2 sm:p-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-target"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
