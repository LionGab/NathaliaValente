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
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-claude-gray-800 rounded-2xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">2.5K</div>
          <div className="text-xs text-claude-gray-500 dark:text-claude-gray-400">Mães ativas</div>
        </div>
        <div className="bg-white dark:bg-claude-gray-800 rounded-2xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">15K</div>
          <div className="text-xs text-claude-gray-500 dark:text-claude-gray-400">Posts hoje</div>
        </div>
        <div className="bg-white dark:bg-claude-gray-800 rounded-2xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">98%</div>
          <div className="text-xs text-claude-gray-500 dark:text-claude-gray-400">Satisfação</div>
        </div>
      </div>

      {/* Preview da Rotina */}
      <RoutinePreview />

      {/* Preview de Produtos */}
      <ProductPreview />

      {/* Ações Rápidas Adicionais */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => handleQuickAction('community')}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
        >
          <Users className="w-6 h-6" />
          <div className="text-left">
            <div className="font-semibold">Comunidade</div>
            <div className="text-sm opacity-90">Ver posts das mães</div>
          </div>
        </button>

        <button
          onClick={() => handleQuickAction('nathia')}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
        >
          <MessageCircle className="w-6 h-6" />
          <div className="text-left">
            <div className="font-semibold">NathIA</div>
            <div className="text-sm opacity-90">Conversar com IA</div>
          </div>
        </button>
      </div>

      {/* Destaque do Dia */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-6 mb-6 border border-pink-200 dark:border-pink-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white">Dica do Dia</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Com a Nathália</p>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          "Lembre-se: você não precisa ser perfeita, apenas presente. Cada pequeno gesto de amor conta mais do que você imagina. 💕"
        </p>
      </div>

      {/* Botão de Criar Post Flutuante */}
      <button
        onClick={handleCreatePost}
        className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-40"
        aria-label="Criar post"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default HomePage;
