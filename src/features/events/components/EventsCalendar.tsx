import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Video, 
  ExternalLink,
  Plus,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  Share2,
  Bookmark,
  Bell,
  BellOff
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  duration: number; // in minutes
  type: 'online' | 'presencial' | 'híbrido';
  location?: string;
  link?: string;
  maxParticipants?: number;
  currentParticipants: number;
  category: string;
  organizer: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  tags: string[];
  isBookmarked: boolean;
  isRegistered: boolean;
  isRecurring: boolean;
  recurringPattern?: 'weekly' | 'monthly' | 'yearly';
  price: 'free' | 'paid';
  priceValue?: number;
  image?: string;
  requirements?: string[];
  materials?: string[];
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Workshop: Preparação para o Parto',
    description: 'Aprenda técnicas de respiração, relaxamento e posições para o trabalho de parto com especialistas.',
    date: new Date('2024-02-15'),
    time: '19:00',
    duration: 120,
    type: 'online',
    link: 'https://zoom.us/j/123456789',
    maxParticipants: 50,
    currentParticipants: 23,
    category: 'Educação',
    organizer: {
      name: 'Dr. Ana Costa',
      avatar: '/avatars/ana.jpg',
      verified: true
    },
    tags: ['parto', 'preparação', 'respiração'],
    isBookmarked: false,
    isRegistered: false,
    isRecurring: false,
    price: 'free',
    image: '/images/workshop-parto.jpg',
    requirements: ['Cadastro prévio', 'Conexão com internet'],
    materials: ['Roupas confortáveis', 'Água']
  },
  {
    id: '2',
    title: 'Encontro Presencial: Amamentação',
    description: 'Grupo de apoio presencial para mães que estão amamentando. Traga seu bebê!',
    date: new Date('2024-02-18'),
    time: '14:00',
    duration: 90,
    type: 'presencial',
    location: 'Centro de Saúde Materno-Infantil - São Paulo',
    maxParticipants: 20,
    currentParticipants: 8,
    category: 'Apoio',
    organizer: {
      name: 'Consultora Lactação',
      avatar: '/avatars/consultora.jpg',
      verified: true
    },
    tags: ['amamentação', 'apoio', 'presencial'],
    isBookmarked: true,
    isRegistered: true,
    isRecurring: true,
    recurringPattern: 'weekly',
    price: 'free',
    image: '/images/encontro-amamentacao.jpg'
  },
  {
    id: '3',
    title: 'Curso Online: Nutrição na Gravidez',
    description: 'Aprenda sobre alimentação saudável durante a gestação com nutricionista especializada.',
    date: new Date('2024-02-20'),
    time: '20:00',
    duration: 60,
    type: 'online',
    link: 'https://youtube.com/live/abc123',
    maxParticipants: 100,
    currentParticipants: 67,
    category: 'Educação',
    organizer: {
      name: 'Nutricionista Carla',
      avatar: '/avatars/carla.jpg',
      verified: true
    },
    tags: ['nutrição', 'gravidez', 'alimentação'],
    isBookmarked: false,
    isRegistered: false,
    isRecurring: false,
    price: 'paid',
    priceValue: 29.90,
    image: '/images/curso-nutricao.jpg',
    requirements: ['Cadastro no site', 'Pagamento antecipado']
  }
];

const categories = ['Todos', 'Educação', 'Apoio', 'Exercícios', 'Saúde', 'Social'];
const eventTypes = ['Todos', 'Online', 'Presencial', 'Híbrido'];

export const EventsCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedType, setSelectedType] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [showFilters, setShowFilters] = useState(false);
  const [events, setEvents] = useState<Event[]>(mockEvents);

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'Todos' || event.category === selectedCategory;
    const matchesType = selectedType === 'Todos' || event.type === selectedType;
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesType && matchesSearch;
  });

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleEventAction = (eventId: string, action: 'bookmark' | 'register') => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        if (action === 'bookmark') {
          return { ...event, isBookmarked: !event.isBookmarked };
        } else {
          return { ...event, isRegistered: !event.isRegistered };
        }
      }
      return event;
    }));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'online':
        return <Video className="w-4 h-4" />;
      case 'presencial':
        return <MapPin className="w-4 h-4" />;
      case 'híbrido':
        return <Users className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'online':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'presencial':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'híbrido':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Calendário de Eventos
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Participe de workshops, encontros e cursos para mães
        </p>
      </div>

      {/* Search and Controls */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
          <label htmlFor="events-search" className="sr-only">
            Buscar eventos
          </label>
          <input
            id="events-search"
            type="text"
            placeholder="Buscar eventos, tópicos, organizadores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            aria-label="Buscar eventos"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-xl hover:bg-pink-200 dark:hover:bg-pink-900/30 transition-colors"
              aria-label={showFilters ? "Fechar filtros" : "Abrir filtros"}
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>

            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                aria-label="Visualização em calendário"
              >
                <Calendar className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                aria-label="Visualização em lista"
              >
                <Users className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all"
            aria-label="Criar novo evento"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Evento</span>
          </button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
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
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    aria-label="Selecionar categoria"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Tipo
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    aria-label="Selecionar tipo de evento"
                  >
                    {eventTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Mês anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Hoje
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Próximo mês"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {weekDays.map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentDate).map((day, index) => {
              if (!day) {
                return <div key={index} className="h-24"></div>;
              }

              const dayEvents = getEventsForDate(day);
              const isToday = day.toDateString() === new Date().toDateString();
              const isSelected = selectedDate?.toDateString() === day.toDateString();

              return (
                <motion.div
                  key={day.toISOString()}
                  className={`h-24 p-2 border border-gray-100 dark:border-gray-700 rounded-lg cursor-pointer transition-all ${
                    isToday ? 'bg-pink-50 dark:bg-pink-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  } ${isSelected ? 'ring-2 ring-pink-500' : ''}`}
                  onClick={() => setSelectedDate(day)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-pink-600 dark:text-pink-400' : 'text-gray-800 dark:text-white'
                  }`}>
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`text-xs px-2 py-1 rounded truncate ${
                          event.type === 'online' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                          event.type === 'presencial' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                          'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                        }`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{dayEvents.length - 2} mais
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                {/* Event Image */}
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 flex items-center justify-center flex-shrink-0">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <Calendar className="w-8 h-8 text-pink-500" />
                  )}
                </div>

                {/* Event Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                          {getEventTypeIcon(event.type)}
                          <span className="ml-1 capitalize">{event.type}</span>
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                          {event.category}
                        </span>
                        {event.price === 'paid' && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                            R$ {event.priceValue?.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEventAction(event.id, 'bookmark')}
                        className={`p-2 rounded-full transition-colors ${
                          event.isBookmarked 
                            ? 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20'
                        }`}
                        aria-label={event.isBookmarked ? 'Remover dos salvos' : 'Salvar evento'}
                      >
                        <Bookmark className={`w-5 h-5 ${event.isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleEventAction(event.id, 'register')}
                        className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                          event.isRegistered
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700'
                        }`}
                        aria-label={event.isRegistered ? 'Cancelar inscrição' : 'Inscrever-se no evento'}
                      >
                        {event.isRegistered ? 'Inscrito' : 'Inscrever-se'}
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(event.time)} ({event.duration}min)</span>
                    </div>
                    {event.type === 'presencial' && event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{event.currentParticipants}/{event.maxParticipants || '∞'} participantes</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Nenhum evento encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Tente ajustar os filtros ou criar um novo evento
          </p>
          <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all">
            Criar Primeiro Evento
          </button>
        </div>
      )}
    </div>
  );
};
