import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TestTube2, ShoppingBag, Heart, Plus, Search, Filter,
  Star, Eye, ShoppingCart, Share2, Clock,
  Truck, Shield, Award, TrendingUp, Grid, List
} from 'lucide-react';
import { SimpleNathTips } from '../../../components/SimpleNathTips';
import { NAVAHeroSection } from '../../../components/NAVAHeroSection';
import { useHapticFeedback } from '../../../hooks/useGestures';
import { OptimizedImage } from '../../../components/OptimizedImage';

export const StorePage = () => {
  const { triggerHaptic } = useHapticFeedback();

  // Estados para funcionalidades da loja
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showCart, setShowCart] = useState(false);

  // Categorias da loja
  const categories = [
    { id: 'all', name: 'Todos', icon: '🛍️', count: 0 },
    { id: 'enxoval', name: 'Enxoval', icon: '👶', count: 45 },
    { id: 'acessorios', name: 'Acessórios', icon: '🎀', count: 32 },
    { id: 'higiene', name: 'Higiene', icon: '🧴', count: 28 },
    { id: 'amamentacao', name: 'Amamentação', icon: '🍼', count: 19 },
    { id: 'brinquedos', name: 'Brinquedos', icon: '🧸', count: 24 },
    { id: 'roupas', name: 'Roupas', icon: '👕', count: 67 },
    { id: 'carrinho', name: 'Carrinho', icon: '🛒', count: 12 }
  ];

  // Produtos para Desapega das Mamães
  const desapegaProducts = [
    {
      id: 1,
      name: 'Berço de Madeira Maciça',
      price: 'R$ 450,00',
      originalPrice: 'R$ 800,00',
      image: 'https://i.imgur.com/pElL8zD.jpg',
      author: 'Ana S.',
      avatar: 'AS',
      backgroundColor: 'bg-gradient-to-br from-amber-50 to-orange-100',
      condition: 'Usado 6 meses, conservado',
      category: 'enxoval'
    },
    {
      id: 2,
      name: 'Bebê Conforto Premium',
      price: 'R$ 320,00',
      originalPrice: 'R$ 600,00',
      image: 'https://i.imgur.com/gxOThQR.jpg',
      author: 'Mariana L.',
      avatar: 'ML',
      backgroundColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      condition: 'Até 13kg, conservado',
      category: 'acessorios'
    },
    {
      id: 3,
      name: 'Carrinho Galzerano Preto',
      price: 'R$ 450,00',
      originalPrice: 'R$ 800,00',
      image: 'https://i.imgur.com/DLPkytI.jpg',
      author: 'Julia C.',
      avatar: 'JC',
      backgroundColor: 'bg-gradient-to-br from-gray-100 to-gray-200',
      condition: 'Usado 8 meses, excelente estado',
      category: 'carrinho'
    },
    {
      id: 4,
      name: 'Ergo Baby Carrier',
      price: 'R$ 180,00',
      originalPrice: 'R$ 300,00',
      image: 'https://i.imgur.com/6AOi9vY.jpg',
      author: 'Carla D.',
      avatar: 'CD',
      backgroundColor: 'bg-gradient-to-br from-purple-50 to-pink-100',
      condition: 'Pouco usado, limpo',
      category: 'acessorios'
    },
    {
      id: 5,
      name: 'Enxoval de Berço Completo',
      price: 'R$ 280,00',
      originalPrice: 'R$ 450,00',
      image: 'https://i.imgur.com/76haTca.jpg',
      author: 'Patricia M.',
      avatar: 'PM',
      backgroundColor: 'bg-gradient-to-br from-green-50 to-emerald-100',
      condition: 'Novo, lacrado',
      category: 'enxoval'
    },
    {
      id: 6,
      name: 'Kit Baby o Boticário',
      price: 'R$ 120,00',
      originalPrice: 'R$ 200,00',
      image: 'https://i.imgur.com/tf0GHwz.jpg',
      author: 'Fernanda R.',
      avatar: 'FR',
      backgroundColor: 'bg-gradient-to-br from-rose-50 to-pink-100',
      condition: 'Usado 3 meses, conservado',
      category: 'higiene'
    },
  ];

  // Funções de callback
  const handleAddToCart = useCallback((product: any) => {
    triggerHaptic('light');
    setCartItems(prev => [...prev, product]);
    console.log('Produto adicionado ao carrinho:', product.name);
  }, [triggerHaptic]);

  const handleToggleFavorite = useCallback((productId: number) => {
    triggerHaptic('light');
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, [triggerHaptic]);

  const handleShareProduct = useCallback((product: any) => {
    triggerHaptic('light');
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Confira este produto: ${product.name}`,
        url: window.location.href
      });
    } else {
      console.log('Compartilhar:', product.name);
    }
  }, [triggerHaptic]);

  // Filtrar produtos
  const filteredProducts = desapegaProducts.filter(product => {
    const matchesSearch = searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      {/* Header da Loja Melhorado - Mobile Optimized */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-full mx-auto px-3 sm:px-4 py-2 sm:py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2 sm:gap-3 mobile-text-lg">
                <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-pink-500" aria-hidden="true" />
                <span className="hidden sm:inline">Loja Nossa Maternidade</span>
                <span className="sm:hidden">Loja</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mobile-text-sm">Produtos cuidadosamente selecionados para você</p>
            </div>

            {/* Carrinho e Favoritos */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCart(!showCart)}
                className="relative p-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl hover:from-pink-500/20 hover:to-purple-500/20 transition-all duration-200 border border-pink-200 dark:border-pink-800"
                aria-label="Carrinho de compras"
              >
                <ShoppingCart className="w-5 h-5 text-pink-600" aria-hidden="true" />
                {cartItems.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{cartItems.length}</span>
                  </div>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFavorites(prev => prev.length > 0 ? [] : [1, 2, 3])}
                className="p-3 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-xl hover:from-red-500/20 hover:to-pink-500/20 transition-all duration-200 border border-red-200 dark:border-red-800"
                aria-label="Favoritos"
              >
                <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : 'text-red-600'}`} aria-hidden="true" />
              </motion.button>
            </div>
          </div>

          {/* Barra de busca e filtros - Mobile Optimized */}
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm mobile-text-sm touch-target"
                aria-label="Buscar produtos"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="p-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors touch-target"
              aria-label="Filtros"
            >
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" aria-hidden="true" />
            </motion.button>

            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 touch-target">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                aria-label="Visualização em grade"
              >
                <Grid className="w-4 h-4 text-gray-600 dark:text-gray-400" aria-hidden="true" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                aria-label="Visualização em lista"
              >
                <List className="w-4 h-4 text-gray-600 dark:text-gray-400" aria-hidden="true" />
              </motion.button>
            </div>
          </div>

          {/* Filtros expandidos */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ordenar por:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="recent">Mais recentes</option>
                      <option value="price-low">Menor preço</option>
                      <option value="price-high">Maior preço</option>
                      <option value="popular">Mais populares</option>
                      <option value="rating">Melhor avaliados</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Categorias */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 ${selectedCategory === category.id
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              aria-label={`Filtrar por ${category.name}`}
            >
              <span className="text-lg" aria-hidden="true">{category.icon}</span>
              <span className="font-medium text-sm">{category.name}</span>
              {category.count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === category.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                  {category.count}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* NAVA Hero Section */}
      <NAVAHeroSection />

      {/* Babytest Section */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="text-center space-y-4 sm:space-y-6">
          {/* Texto acima */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <TestTube2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary-500" />
              <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                Babytest by OLLIN
              </h3>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto px-2">
              O melhor para o seu bebê desde os primeiros dias de vida. O Babytest by OLLIN investiga mais de 600 doenças genéticas tratáveis.
            </p>
          </div>

          {/* Imagem abaixo */}
          <div className="relative max-w-2xl mx-auto rounded-xl overflow-hidden bg-pink-100">
            <OptimizedImage
              src="https://i.imgur.com/JPBuHrw.jpg"
              alt="Babytest by OLLIN"
              className="mobile-image-hero"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 text-white">
              <p className="text-xs sm:text-sm font-medium mobile-text-sm">Teste de Triagem Neonatal</p>
              <p className="text-xs opacity-90 mobile-text-sm">Prepare-se para a Maternidade com Confiança!</p>
            </div>
          </div>

          {/* Botão centralizado */}
          <div className="flex justify-center">
            <button
              onClick={() => window.open('https://www.babytest.com.br/', '_blank')}
              className="bg-pink-500 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl font-semibold hover:bg-pink-600 transition-all duration-200 shadow-medium flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <TestTube2 className="w-4 h-4 sm:w-5 sm:h-5" />
              ACESSAR O SITE APENAS
            </button>
          </div>
        </div>
      </div>

      {/* Primeiros Cuidados com o Recém-Nascido Section - Mobile Optimized */}
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white mb-2 sm:mb-3 mobile-text-lg">
            Primeiros Cuidados com o Recém-Nascido
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto px-2 mobile-text">
            Tudo que você precisa saber para cuidar do seu bebê nos primeiros dias em casa
          </p>
        </div>

        {/* Cards de Cuidados - Mobile Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Alimentação */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl p-4 shadow-lg border border-pink-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-pink-500 rounded-xl">
                <TestTube2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-pink-800 mobile-text">Alimentação</h3>
            </div>
            <ul className="space-y-1.5 sm:space-y-2 text-pink-700 text-xs sm:text-sm mobile-text-sm">
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Amamentação em livre demanda</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Posição correta para amamentar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Como identificar fome e saciedade</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Armazenamento do leite materno</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Higiene */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-800">Higiene</h3>
            </div>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Banho do recém-nascido</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Cuidados com o coto umbilical</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Troca de fraldas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Limpeza dos olhos e nariz</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Sono */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-purple-800">Sono</h3>
            </div>
            <ul className="space-y-2 text-purple-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Posição segura para dormir</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Rotina de sono</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Ambiente ideal para o sono</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Como acalmar o bebê</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Desenvolvimento */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-800">Desenvolvimento</h3>
            </div>
            <ul className="space-y-2 text-green-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Marcos do desenvolvimento</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Estimulação precoce</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Reflexos do recém-nascido</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Brincadeiras adequadas</span>
              </li>
            </ul>
          </div>

          {/* Card 5: Saúde */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-6 shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-orange-800">Saúde</h3>
            </div>
            <ul className="space-y-2 text-orange-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Vacinação</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Quando procurar o pediatra</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Sinais de alerta</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Medicamentos seguros</span>
              </li>
            </ul>
          </div>

          {/* Card 6: Cuidados com a Mãe */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl p-6 shadow-lg border border-rose-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-rose-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-rose-800">Cuidados com a Mãe</h3>
            </div>
            <ul className="space-y-2 text-rose-700">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>Recuperação pós-parto</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>Cuidados com os seios</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>Alimentação da mãe</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>Bem-estar emocional</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Quer Aprender Mais?</h3>
          <p className="text-lg mb-6 opacity-90">
            Acesse nosso guia completo de primeiros cuidados com o recém-nascido
          </p>
          <button
            onClick={() => {
              // Navegar para página de guia completo
              window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
            }}
            className="bg-white text-pink-600 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Acessar Guia Completo
          </button>
        </div>
      </div>

      {/* Amamentação: Guia Completo para Mães Section */}
      <div className="space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">🤱</span>
            <h2 className="text-4xl font-bold text-neutral-900 dark:text-white">
              Amamentação: Guia Completo para Mães
            </h2>
          </div>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Dicas práticas e apoio emocional para uma amamentação bem-sucedida e prazerosa
          </p>
        </div>

        {/* Cards de Amamentação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Técnicas de Amamentação */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl p-6 shadow-lg border border-pink-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-pink-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-pink-800">Técnicas de Amamentação</h3>
            </div>
            <ul className="space-y-2 text-pink-700">
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Posições corretas para amamentar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Como fazer a pega adequada</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Sinais de fome e saciedade</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Frequência e duração das mamadas</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Desafios Comuns */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-800">Desafios Comuns</h3>
            </div>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Dores e fissuras nos mamilos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Ingurgitamento mamário</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Bebê que não quer mamar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Produção de leite insuficiente</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Alimentação da Mãe */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-800">Alimentação da Mãe</h3>
            </div>
            <ul className="space-y-2 text-green-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Alimentos que aumentam a produção</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Hidratação adequada</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Suplementação necessária</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Alimentos a evitar</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Armazenamento do Leite */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-purple-800">Armazenamento do Leite</h3>
            </div>
            <ul className="space-y-2 text-purple-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Como ordenhar corretamente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Conservação na geladeira</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Congelamento e descongelamento</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Equipamentos necessários</span>
              </li>
            </ul>
          </div>

          {/* Card 5: Apoio Emocional */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-6 shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-orange-800">Apoio Emocional</h3>
            </div>
            <ul className="space-y-2 text-orange-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Lidando com a pressão social</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Ansiedade e insegurança</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Busca por ajuda profissional</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Grupos de apoio</span>
              </li>
            </ul>
          </div>

          {/* Card 6: Amamentação e Trabalho */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl p-6 shadow-lg border border-rose-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-rose-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-rose-800">Amamentação e Trabalho</h3>
            </div>
            <ul className="space-y-2 text-rose-700">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>Direitos da mãe trabalhadora</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>Como manter a produção</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>Ordenha no local de trabalho</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>Transição para mamadeira</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">🤱 Quer Aprender Mais sobre Amamentação?</h3>
          <p className="text-lg mb-6 opacity-90">
            Acesse nosso guia completo de amamentação com dicas práticas e apoio emocional
          </p>
          <button
            onClick={() => {
              // Navegar para página de amamentação
              window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
            }}
            className="bg-white text-pink-600 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Acessar Guia de Amamentação
          </button>
        </div>
      </div>

      {/* Desapega das Mamães Section - Melhorada */}
      <div className="px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <Heart className="w-6 h-6 text-pink-500" aria-hidden="true" />
                Desapega das Mamães
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Produtos em excelente estado, vendidos por outras mães da nossa comunidade
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <TrendingUp className="w-4 h-4" aria-hidden="true" />
              <span>{filteredProducts.length} produtos encontrados</span>
            </div>
          </div>

          {/* Grid de produtos melhorado */}
          <div className={`grid gap-6 ${viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
            }`}>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`${product.backgroundColor} rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group ${viewMode === 'list' ? 'flex gap-4' : ''
                  }`}
              >
                <div className={`space-y-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  {/* Imagem do produto */}
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`object-cover rounded-xl ${viewMode === 'list'
                        ? 'w-24 h-24'
                        : 'w-full h-40'
                        }`}
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleFavorite(product.id)}
                        className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
                        aria-label={`${favorites.includes(product.id) ? 'Remover dos' : 'Adicionar aos'} favoritos`}
                      >
                        <Heart
                          className={`w-4 h-4 ${favorites.includes(product.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-600 dark:text-gray-400'
                            }`}
                          aria-hidden="true"
                        />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleShareProduct(product)}
                        className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
                        aria-label="Compartilhar produto"
                      >
                        <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                      </motion.button>
                    </div>

                    {/* Badge de desconto */}
                    {product.originalPrice && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{Math.round((1 - parseFloat(product.price.replace('R$ ', '').replace(',', '.')) / parseFloat(product.originalPrice.replace('R$ ', '').replace(',', '.'))) * 100)}%
                      </div>
                    )}
                  </div>

                  {/* Informações do produto */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white text-lg group-hover:text-pink-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {product.condition}
                      </p>
                    </div>

                    {/* Autor */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {product.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {product.author}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                          <span className="text-xs text-gray-500 ml-1">(4.9)</span>
                        </div>
                      </div>
                    </div>

                    {/* Preços */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-green-600">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        <span>Publicado há 2 dias</span>
                      </div>
                    </div>

                    {/* Botões de ação */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                        Comprar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        aria-label="Ver detalhes"
                      >
                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust elements melhorados */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                  <Truck className="w-5 h-5 text-green-600" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 dark:text-green-200">Entrega Segura</h4>
                  <p className="text-sm text-green-600 dark:text-green-400">Rastreamento em tempo real</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">Avaliações Verificadas</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Comunidade confiável</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                  <Award className="w-5 h-5 text-purple-600" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200">Garantia de Qualidade</h4>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Produtos selecionados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dicas da Nath Section */}
      <SimpleNathTips />

      {/* Carrinho de Compras */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-pink-500" aria-hidden="true" />
                  Carrinho ({cartItems.length})
                </h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Fechar carrinho"
                >
                  <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400 rotate-45" aria-hidden="true" />
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" aria-hidden="true" />
                  <p className="text-gray-500 dark:text-gray-400">Seu carrinho está vazio</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Adicione produtos para começar
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 dark:text-white text-sm">
                          {item.name}
                        </h4>
                        <p className="text-green-600 font-semibold text-sm">{item.price}</p>
                      </div>
                      <button
                        onClick={() => setCartItems(prev => prev.filter((_, i) => i !== index))}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        aria-label="Remover item"
                      >
                        <Plus className="w-4 h-4 text-red-500 rotate-45" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {cartItems.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-gray-800 dark:text-white">Total:</span>
                    <span className="text-xl font-bold text-green-600">
                      R$ {cartItems.reduce((total, item) => {
                        const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
                        return total + price;
                      }, 0).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Finalizar Compra
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB - Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          // Navegar para página de criação de post ou adicionar item
          window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feed' } }));
        }}
        className="fixed bottom-20 right-4 w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-40 group"
        aria-label="Adicionar item"
      >
        <Plus className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
      </motion.button>
    </div>
  );
};


