import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  BookOpen,
  Video,
  FileText,
  Heart,
  Clock,
  User,
  Star,
  ChevronDown,
  X,
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'guide' | 'tip';
  category: string;
  author: string;
  readTime: string;
  likes: number;
  image?: string;
  tags: string[];
  publishedAt: string;
  featured?: boolean;
}

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Guia Completo da Amamentação',
    description:
      'Tudo que você precisa saber sobre amamentação, desde os primeiros dias até o desmame natural.',
    type: 'guide',
    category: 'Amamentação',
    author: 'Dr. Ana Costa',
    readTime: '15 min',
    likes: 234,
    tags: ['amamentação', 'bebê', 'primeiros dias', 'dicas'],
    publishedAt: '2024-01-15',
    featured: true,
  },
  {
    id: '2',
    title: 'Exercícios Seguros na Gravidez',
    description: 'Rotina de exercícios adaptados para cada trimestre da gestação.',
    type: 'video',
    category: 'Exercícios',
    author: 'Prof. Maria Silva',
    readTime: '8 min',
    likes: 189,
    tags: ['exercícios', 'gravidez', 'saúde', 'bem-estar'],
    publishedAt: '2024-01-12',
    featured: true,
  },
  {
    id: '3',
    title: 'Alimentação na Gestação',
    description: 'Cardápio balanceado e suplementos essenciais para uma gravidez saudável.',
    type: 'article',
    category: 'Nutrição',
    author: 'Nutricionista Carla Santos',
    readTime: '12 min',
    likes: 156,
    tags: ['nutrição', 'gravidez', 'alimentação', 'suplementos'],
    publishedAt: '2024-01-10',
  },
  {
    id: '4',
    title: 'Dicas para o Sono do Bebê',
    description: 'Estratégias para estabelecer uma rotina de sono saudável para seu bebê.',
    type: 'tip',
    category: 'Sono',
    author: 'Consultora do Sono',
    readTime: '6 min',
    likes: 298,
    tags: ['sono', 'bebê', 'rotina', 'dicas'],
    publishedAt: '2024-01-08',
  },
  {
    id: '5',
    title: 'Preparação para o Parto',
    description: 'Exercícios de respiração e técnicas de relaxamento para o trabalho de parto.',
    type: 'video',
    category: 'Parto',
    author: 'Doula Patricia Lima',
    readTime: '20 min',
    likes: 167,
    tags: ['parto', 'respiração', 'relaxamento', 'preparação'],
    publishedAt: '2024-01-05',
  },
  {
    id: '6',
    title: 'Cuidados Pós-Parto',
    description: 'Guia completo para os cuidados com a mãe e o bebê após o nascimento.',
    type: 'guide',
    category: 'Pós-Parto',
    author: 'Enfermeira Obstétrica',
    readTime: '18 min',
    likes: 203,
    tags: ['pós-parto', 'cuidados', 'recuperação', 'bebê'],
    publishedAt: '2024-01-03',
  },
];

const categories = ['Todos', 'Amamentação', 'Exercícios', 'Nutrição', 'Sono', 'Parto', 'Pós-Parto'];
const types = ['Todos', 'Artigo', 'Vídeo', 'Guia', 'Dica'];

export const ResourcesLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedType, setSelectedType] = useState('Todos');
  const [showFilters, setShowFilters] = useState(false);

  const filteredResources = useMemo(() => {
    return mockResources.filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'Todos' || resource.category === selectedCategory;

      const matchesType =
        selectedType === 'Todos' ||
        (selectedType === 'Artigo' && resource.type === 'article') ||
        (selectedType === 'Vídeo' && resource.type === 'video') ||
        (selectedType === 'Guia' && resource.type === 'guide') ||
        (selectedType === 'Dica' && resource.type === 'tip');

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchQuery, selectedCategory, selectedType]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'guide':
        return <BookOpen className="w-4 h-4" />;
      case 'tip':
        return <Star className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'video':
        return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      case 'guide':
        return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'tip':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Biblioteca de Recursos
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Encontre artigos, vídeos, guias e dicas especializadas para sua jornada materna
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            aria-hidden="true"
          />
          <label htmlFor="search-resources" className="sr-only">
            Buscar recursos, dicas, artigos
          </label>
          <input
            id="search-resources"
            type="text"
            placeholder="Buscar recursos, dicas, artigos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
            aria-label="Buscar recursos, dicas, artigos"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-xl hover:bg-pink-200 dark:hover:bg-pink-900/30 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Filtros</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Categoria
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Tipo
                </label>
                <div className="flex flex-wrap gap-2">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedType === type
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setSelectedCategory('Todos');
                  setSelectedType('Todos');
                  setSearchQuery('');
                }}
                className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 text-sm font-medium"
              >
                Limpar todos os filtros
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          {filteredResources.length} recurso{filteredResources.length !== 1 ? 's' : ''} encontrado
          {filteredResources.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            {/* Featured Badge */}
            {resource.featured && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Destaque
                </span>
              </div>
            )}

            {/* Image Placeholder */}
            <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 flex items-center justify-center">
              <div className="text-6xl opacity-50">{getTypeIcon(resource.type)}</div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Type and Category */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}
                >
                  {getTypeIcon(resource.type)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {resource.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                {resource.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                {resource.description}
              </p>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{resource.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{resource.readTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{resource.likes}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {resource.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Action Button */}
              <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                Ler Agora
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Nenhum recurso encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Tente ajustar os filtros ou usar termos de busca diferentes
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Todos');
              setSelectedType('Todos');
            }}
            className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  );
};
