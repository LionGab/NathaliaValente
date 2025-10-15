import { useState, useEffect } from 'react';
import { supabase, DailyQuote } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, Bookmark, BookmarkCheck, RefreshCw } from 'lucide-react';

export const DailyQuotePage = () => {
  const [quote, setQuote] = useState<DailyQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useAuth();

  const fetchDailyQuote = async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];

    const { data } = await supabase
      .from('daily_quotes')
      .select('*')
      .eq('date', today)
      .maybeSingle();

    if (data) {
      setQuote(data);
      checkIfSaved(data.id);
    } else {
      const { data: anyQuote } = await supabase
        .from('daily_quotes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (anyQuote) {
        setQuote(anyQuote);
        checkIfSaved(anyQuote.id);
      }
    }
    setLoading(false);
  };

  const checkIfSaved = async (quoteId: string) => {
    if (!user) return;

    const { data } = await supabase
      .from('saved_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('content', quoteId)
      .eq('type', 'quote')
      .maybeSingle();

    setIsSaved(!!data);
  };

  const handleSave = async () => {
    if (!user || !quote) return;

    if (isSaved) {
      await supabase
        .from('saved_items')
        .delete()
        .eq('user_id', user.id)
        .eq('content', quote.id)
        .eq('type', 'quote');
      setIsSaved(false);
    } else {
      await supabase.from('saved_items').insert({
        user_id: user.id,
        content: quote.id,
        type: 'quote',
      });
      setIsSaved(true);
    }
  };

  useEffect(() => {
    fetchDailyQuote();
  }, []);

  const getTypeColor = (type: string) => {
    const colors = {
      motivational: 'from-pink-400 to-rose-400',
      verse: 'from-blue-400 to-cyan-400',
      reflection: 'from-purple-400 to-indigo-400',
    };
    return colors[type as keyof typeof colors] || 'from-gray-400 to-gray-500';
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      motivational: 'Motivação',
      verse: 'Versículo',
      reflection: 'Reflexão',
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-400 border-t-transparent"></div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Nenhuma frase disponível no momento
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 pb-24">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-8 h-8 text-pink-400" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Frase do Dia
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Uma mensagem especial para você hoje
        </p>
      </div>

      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-800 dark:via-purple-900/20 dark:to-gray-800 rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl"></div>

        <div className="relative">
          <div className="mb-6">
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getTypeColor(
                quote.type
              )}`}
            >
              {getTypeLabel(quote.type)}
            </span>
          </div>

          <blockquote className="text-xl md:text-2xl font-medium text-gray-800 dark:text-white leading-relaxed mb-6">
            "{quote.content}"
          </blockquote>

          {quote.author && (
            <p className="text-right text-gray-600 dark:text-gray-400 font-medium">
              — {quote.author}
            </p>
          )}

          <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                isSaved
                  ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-5 h-5" />
                  Salvo
                </>
              ) : (
                <>
                  <Bookmark className="w-5 h-5" />
                  Salvar
                </>
              )}
            </button>

            <button
              onClick={fetchDailyQuote}
              className="flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Atualizar
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          Esta frase é renovada diariamente para inspirar seu dia com amor,
          fé e reflexão.
        </p>
      </div>
    </div>
  );
};
