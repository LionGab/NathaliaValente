import { useState, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useHapticFeedback } from '../../../hooks/useGestures';
import { HeroCard } from '../components/HeroCard';
import { QuickActions } from '../components/QuickActions';
import { CollapsibleVerse } from '../components/CollapsibleVerse';
import { RoutinePreview } from '../components/RoutinePreview';
import { ProductPreview } from '../components/ProductPreview';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Plus, Users, MessageCircle, Heart, Sparkles } from 'lucide-react';

const HomePage = () => {
  const { user, profile } = useAuth();
  const { triggerHaptic } = useHapticFeedback();
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleCreatePost = useCallback(() => {
    triggerHaptic('medium');
    setShowCreatePost(true);
  }, [triggerHaptic]);

  const handleQuickAction = useCallback((action: string) => {
    triggerHaptic('light');
    console.log('Ação rápida:', action);
    // Implementar navegação para outras páginas
  }, [triggerHaptic]);

  return (
    <div className="max-w-full mx-auto px-4 py-4 pb-24 mobile-padding">
      {/* Hero Card - Boas-vindas personalizado */}
      <HeroCard />

      {/* Quick Actions - Atalhos rápidos */}
      <QuickActions />

      {/* Versículo do Dia - Colapsível */}
      <CollapsibleVerse verse={{
        text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.",
        reference: "Jeremias 29:11",
        date: "27 de Janeiro, 2025"
      }} />

      {/* Estatísticas da Comunidade */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
          <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-1">2.5K</div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Mães ativas</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">15K</div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Posts hoje</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">98%</div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Satisfação</div>
        </div>
      </div>

      {/* Preview da Rotina */}
      <RoutinePreview />

      {/* Preview de Produtos */}
      <ProductPreview />

      {/* Ações Rápidas Adicionais */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => handleQuickAction('community')}
          className="bg-gradient-to-br from-pink-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-4 group hover:scale-105 active:scale-95"
        >
          <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
            <Users className="w-6 h-6" />
          </div>
          <div className="text-left">
            <div className="font-bold text-lg">Comunidade</div>
            <div className="text-sm text-white/90 font-medium">Ver posts das mães</div>
          </div>
        </button>

        <button
          onClick={() => handleQuickAction('nathia')}
          className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-4 group hover:scale-105 active:scale-95"
        >
          <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="text-left">
            <div className="font-bold text-lg">NathIA</div>
            <div className="text-sm text-white/90 font-medium">Conversar com IA</div>
          </div>
        </button>
      </div>

      {/* Destaque do Dia */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-3xl p-8 mb-8 border border-pink-200 dark:border-pink-800 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-800 dark:text-white">Dica do Dia</h3>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Com a Nathália</p>
          </div>
        </div>
        <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-medium italic">
          "Lembre-se: você não precisa ser perfeita, apenas presente. Cada pequeno gesto de amor conta mais do que você imagina. 💕"
        </blockquote>
      </div>

      {/* Botão de Criar Post Flutuante */}
      <button
        onClick={handleCreatePost}
        className="fixed bottom-20 right-4 w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-40 hover:scale-110 active:scale-95 group"
        aria-label="Criar post"
      >
        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
};

export default HomePage;
