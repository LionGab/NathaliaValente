import { useState, useMemo } from 'react';
import { Search, Filter, Heart, Clock, Star, BookOpen, Users, MessageCircle } from 'lucide-react';
import { nathTips, tipCategories, pregnancyStages, getFilteredTips, type TipCategory, type PregnancyStage, type NathTip } from '../data/nath-tips';

interface NathTipsSectionProps {
    showHeader?: boolean;
    maxItems?: number;
}

export const NathTipsSection: React.FC<NathTipsSectionProps> = ({
    showHeader = true,
    maxItems
}) => {
    const [selectedCategory, setSelectedCategory] = useState<TipCategory | 'all'>('all');
    const [selectedStage, setSelectedStage] = useState<PregnancyStage | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [showFilters, setShowFilters] = useState(false);

    const filteredTips = useMemo(() => {
        let tips = getFilteredTips(
            selectedCategory === 'all' ? undefined : selectedCategory,
            selectedStage === 'all' ? undefined : selectedStage,
            searchQuery || undefined
        );

        if (maxItems) {
            tips = tips.slice(0, maxItems);
        }

        return tips;
    }, [selectedCategory, selectedStage, searchQuery, maxItems]);

    const toggleFavorite = (tipId: string) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(tipId)) {
                newFavorites.delete(tipId);
            } else {
                newFavorites.add(tipId);
            }
            return newFavorites;
        });
    };

    const clearFilters = () => {
        setSelectedCategory('all');
        setSelectedStage('all');
        setSearchQuery('');
    };

    const hasActiveFilters = selectedCategory !== 'all' || selectedStage !== 'all' || searchQuery;

    return (
        <div className="space-y-6">
            {showHeader && (
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Star className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
                            Dicas da Nath
                        </h2>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                        Conteúdo exclusivo e acolhedor para sua jornada materna. Dicas práticas,
                        orientações especializadas e muito apoio emocional.
                    </p>
                </div>
            )}

            {/* Filtros e Busca */}
            <div className="space-y-4">
                {/* Barra de Busca */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar dicas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                </div>

                {/* Botão de Filtros */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        Filtros
                        {hasActiveFilters && (
                            <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                        )}
                    </button>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-pink-600 dark:text-pink-400 hover:underline text-sm"
                        >
                            Limpar filtros
                        </button>
                    )}
                </div>

                {/* Filtros Expandidos */}
                {showFilters && (
                    <div className="grid md:grid-cols-2 gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                        {/* Categorias */}
                        <div>
                            <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
                                Categorias
                            </h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === 'all'
                                            ? 'bg-pink-500 text-white'
                                            : 'bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600'
                                        }`}
                                >
                                    Todas as categorias
                                </button>
                                {Object.entries(tipCategories).map(([key, category]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedCategory(key as TipCategory)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === key
                                                ? 'bg-pink-500 text-white'
                                                : 'bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600'
                                            }`}
                                    >
                                        <span className="mr-2">{category.icon}</span>
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Estágios da Maternidade */}
                        <div>
                            <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
                                Estágio da Jornada
                            </h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setSelectedStage('all')}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedStage === 'all'
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600'
                                        }`}
                                >
                                    Todos os estágios
                                </button>
                                {Object.entries(pregnancyStages).map(([key, stage]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedStage(key as PregnancyStage)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedStage === key
                                                ? 'bg-purple-500 text-white'
                                                : 'bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600'
                                            }`}
                                    >
                                        <span className="mr-2">{stage.icon}</span>
                                        {stage.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Lista de Dicas */}
            <div className="grid gap-6">
                {filteredTips.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                            Nenhuma dica encontrada
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Tente ajustar os filtros ou fazer uma nova busca.
                        </p>
                    </div>
                ) : (
                    filteredTips.map((tip) => (
                        <TipCard
                            key={tip.id}
                            tip={tip}
                            isFavorite={favorites.has(tip.id)}
                            onToggleFavorite={() => toggleFavorite(tip.id)}
                        />
                    ))
                )}
            </div>

            {/* Estatísticas */}
            {showHeader && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-pink-500">{nathTips.length}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Dicas Disponíveis</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-500">{Object.keys(tipCategories).length}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Categorias</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">{favorites.size}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Favoritos</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">
                            {nathTips.filter(tip => !tip.isPremium).length}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Gratuitas</div>
                    </div>
                </div>
            )}
        </div>
    );
};

interface TipCardProps {
    tip: NathTip;
    isFavorite: boolean;
    onToggleFavorite: () => void;
}

const TipCard: React.FC<TipCardProps> = ({ tip, isFavorite, onToggleFavorite }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const categoryInfo = tipCategories[tip.category];

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Header do Card */}
            <div className={`p-6 bg-gradient-to-r ${categoryInfo.color}`}>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{categoryInfo.icon}</span>
                        <div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                                {tip.title}
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {categoryInfo.name}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onToggleFavorite}
                        className={`p-2 rounded-full transition-colors ${isFavorite
                                ? 'text-pink-500 bg-pink-50 dark:bg-pink-950/20'
                                : 'text-neutral-400 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950/20'
                            }`}
                    >
                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                </div>

                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {tip.summary}
                </p>

                {/* Tags e Metadados */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                    {tip.stage.map((stage) => (
                        <span
                            key={stage}
                            className="px-2 py-1 bg-white/50 dark:bg-neutral-800/50 rounded-full text-xs font-medium text-neutral-700 dark:text-neutral-300"
                        >
                            {pregnancyStages[stage].icon} {pregnancyStages[stage].name}
                        </span>
                    ))}
                    <div className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                        <Clock className="w-3 h-3" />
                        {tip.readTime} min
                    </div>
                    {tip.isPremium && (
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-medium">
                            Premium
                        </span>
                    )}
                </div>
            </div>

            {/* Conteúdo Expandido */}
            {isExpanded && (
                <div className="p-6 space-y-6">
                    {/* Conteúdo Principal */}
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <div className="whitespace-pre-line text-neutral-700 dark:text-neutral-300">
                            {tip.content}
                        </div>
                    </div>

                    {/* FAQ */}
                    {tip.faq.length > 0 && (
                        <div>
                            <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                                <MessageCircle className="w-5 h-5" />
                                Perguntas Frequentes
                            </h4>
                            <div className="space-y-3">
                                {tip.faq.map((faq, index) => (
                                    <div key={index} className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
                                        <h5 className="font-medium text-neutral-900 dark:text-white mb-2">
                                            {faq.question}
                                        </h5>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Dicas Práticas */}
                    {tip.practicalTips.length > 0 && (
                        <div>
                            <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                                Dicas Práticas
                            </h4>
                            <ul className="space-y-2">
                                {tip.practicalTips.map((tipText, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                                        <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                                        {tipText}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Depoimento */}
                    {tip.testimonial && (
                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg p-4">
                            <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                                Depoimento
                            </h4>
                            <p className="text-sm italic text-neutral-700 dark:text-neutral-300">
                                "{tip.testimonial}"
                            </p>
                        </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {tip.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-full text-xs"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer do Card */}
            <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-700 border-t border-neutral-200 dark:border-neutral-600">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <Users className="w-4 h-4" />
                        <span>Por {tip.author}</span>
                    </div>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm font-medium"
                    >
                        {isExpanded ? 'Ver menos' : 'Ler mais'}
                    </button>
                </div>
            </div>
        </div>
    );
};
