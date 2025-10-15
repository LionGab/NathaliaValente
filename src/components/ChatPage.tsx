import { useState, useEffect, useRef } from 'react';
import { supabase, ChatMessage } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Send, Sparkles } from 'lucide-react';

export const ChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    const responses = [
      'Que lindo compartilhar isso comigo! Você está fazendo um trabalho maravilhoso como mãe. Lembre-se: você não precisa ser perfeita, apenas presente.',
      'Entendo como você se sente. A maternidade traz desafios únicos, mas também tantas alegrias. Você é mais forte do que imagina!',
      'Que benção poder conversar com você! Saiba que Deus conhece seu coração e vê todo seu esforço. Provérbios 31:28 diz: "Seus filhos se levantam e a elogiam."',
      'É completamente normal sentir-se assim. Você está fazendo o seu melhor, e isso é mais do que suficiente. Permita-se descansar também.',
      'Que inspiração! Continue assim, mãe guerreira. Cada pequeno passo é uma vitória. Você está escrevendo uma história linda.',
    ];

    return responses[Math.floor(Math.random() * responses.length)];
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

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-6 rounded-t-3xl text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-full">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Robô Nath</h2>
            <p className="text-sm text-white/90">Seu assistente de apoio e reflexão</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Olá! Eu sou a Robô Nath. Estou aqui para ouvir, apoiar e refletir com você.
              Como posso ajudar hoje?
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.is_user ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.is_user
                  ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
            >
              {!message.is_user && (
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  <span className="text-xs font-medium text-pink-500">Robô Nath</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{message.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 rounded-b-3xl"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="p-3 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            ) : (
              <Send className="w-6 h-6" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
