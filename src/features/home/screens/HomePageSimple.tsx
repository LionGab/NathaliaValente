import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useHapticFeedback } from '../../../hooks/useGestures';
import { useGestationalPersonalization } from '../../../hooks/useGestationalPersonalization';
import { Header } from '../../../components/Header/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar, Users, Heart, Baby, BookOpen, Shield,
  CheckCircle, Plus, Bell, Target, ChevronRight, Sparkles,
  TrendingUp, Flame, Activity, Star, MessageCircle
} from 'lucide-react';

const HomePageSimple = () => {
  const { profile } = useAuth();
  const { triggerHaptic } = useHapticFeedback();
  const { gestationalData, isLoading } = useGestationalPersonalization();
  const [activeTab, setActiveTab] = useState<'home' | 'nathia' | 'mundo' | 'habits' | 'trendings'>('home');

  const userName = useMemo(() => profile?.full_name?.split(' ')[0] || 'Mamãe', [profile]);

  // Dicas do Dia
  const dailyTips = useMemo(() => [
    {
      id: 1,
      title: 'Hidratação é essencial',
      description: 'Beba pelo menos 2 litros de água por dia durante a gestação',
      category: 'Saúde',
      icon: Sparkles
    },
    {
      id: 2,
      title: 'Exercícios leves',
      description: 'Caminhadas de 30 minutos ajudam na circulação e bem-estar',
      category: 'Exercício',
      icon: Activity
    },
    {
      id: 3,
      title: 'Descanso adequado',
      description: 'Durma 8-9 horas por noite para o desenvolvimento do bebê',
      category: 'Bem-estar',
      icon: Star
    }
  ], []);

  // Notícias Tendência sobre Mães
  const trendingNews = useMemo(() => [
    {
      id: 1,
      title: 'Novo estudo sobre amamentação',
      description: 'Pesquisa revela benefícios da amamentação prolongada',
      category: 'Amamentação',
      time: '2h',
      trending: true
    },
    {
      id: 2,
      title: 'Dicas de autocuidado pós-parto',
      description: 'Especialistas compartilham estratégias para o período pós-parto',
      category: 'Autocuidado',
      time: '5h',
      trending: true
    }
  ], []);

  // Habit Tracker - Dados
  const [habits, setHabits] = useState([
    { id: 1, name: 'Beber água', icon: '💧', completed: true, streak: 5 },
    { id: 2, name: 'Exercício leve', icon: '🏃', completed: false, streak: 3 },
    { id: 3, name: 'Meditação', icon: '🧘', completed: true, streak: 7 },
    { id: 4, name: 'Leitura', icon: '📚', completed: false, streak: 2 }
  ]);

  const toggleHabit = useCallback((id: number) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id 
        ? { ...habit, completed: !habit.completed, streak: habit.completed ? habit.streak : habit.streak + 1 }
        : habit
    ));
    triggerHaptic('light');
  }, [triggerHaptic]);

  // Trendings - Notícias
  const trendings = useMemo(() => [
    {
      id: 1,
      title: 'Autocuidado na gestação',
      description: 'Como manter o bem-estar durante os 9 meses',
      category: 'Autocuidado',
      image: null,
      time: '1h'
    },
    {
      id: 2,
      title: 'Amamentação: guia completo',
      description: 'Tudo que você precisa saber sobre amamentação',
      category: 'Amamentação',
      image: null,
      time: '3h'
    },
    {
      id: 3,
      title: 'Exercícios seguros na gestação',
      description: 'Atividades físicas recomendadas por trimestre',
      category: 'Exercício',
      image: null,
      time: '5h'
    }
  ], []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-safe">
      <Header />

      <div className="max-w-full mx-auto px-4 py-4 pb-24">
        {/* Tabs de Navegação - Mobile First */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant={activeTab === 'home' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              setActiveTab('home');
              triggerHaptic('light');
            }}
            className="whitespace-nowrap"
          >
            Home
          </Button>
          <Button
            variant={activeTab === 'nathia' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              setActiveTab('nathia');
              triggerHaptic('light');
            }}
            className="whitespace-nowrap"
          >
            NathIA
          </Button>
          <Button
            variant={activeTab === 'mundo' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              setActiveTab('mundo');
              triggerHaptic('light');
            }}
            className="whitespace-nowrap"
          >
            Mundo Nath
          </Button>
          <Button
            variant={activeTab === 'habits' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              setActiveTab('habits');
              triggerHaptic('light');
            }}
            className="whitespace-nowrap"
          >
            Hábitos
          </Button>
          <Button
            variant={activeTab === 'trendings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              setActiveTab('trendings');
              triggerHaptic('light');
            }}
            className="whitespace-nowrap"
          >
            Trendings
          </Button>
        </div>

        {/* Conteúdo por Tab */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* Hero Card */}
            <Card className="border-blue-200 bg-gradient-to-br from-blue-100 to-blue-50 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl sm:text-2xl text-gray-900">
                  Olá, {userName}! 👶
                </CardTitle>
                {gestationalData && (
                  <div className="flex items-center gap-2 flex-wrap mt-2">
                    <span className="text-xs sm:text-sm font-semibold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                      {gestationalData.weeks} semanas
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-blue-800 bg-blue-200 px-2.5 py-1 rounded-full">
                      {gestationalData.trimester}º trimestre
                    </span>
                  </div>
                )}
              </CardHeader>
            </Card>

            {/* Dicas do Dia */}
            <Card className="border-blue-200 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">Dicas do Dia</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {dailyTips.map((tip) => {
                  const Icon = tip.icon;
                  return (
                    <div
                      key={tip.id}
                      className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100"
                    >
                      <Icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-800 text-sm">{tip.title}</h4>
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                            {tip.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{tip.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Notícias Tendência */}
            <Card className="border-blue-200 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <CardTitle className="text-lg">Tendências sobre Mães</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingNews.map((news) => (
                  <div
                    key={news.id}
                    className="flex items-start gap-3 p-3 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg border border-orange-100"
                  >
                    <TrendingUp className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800 text-sm">{news.title}</h4>
                        {news.trending && (
                          <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                            🔥 Trending
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed mb-1">{news.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{news.category}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{news.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* NathIA - O MAIS IMPORTANTE */}
        {activeTab === 'nathia' && (
          <NathIASection userName={userName} gestationalData={gestationalData} />
        )}

        {/* Mundo Nath */}
        {activeTab === 'mundo' && (
          <MundoNathSection />
        )}

        {/* Habit Tracker */}
        {activeTab === 'habits' && (
          <HabitTrackerSection habits={habits} onToggleHabit={toggleHabit} />
        )}

        {/* Trendings */}
        {activeTab === 'trendings' && (
          <TrendingsSection trendings={trendings} />
        )}
      </div>
    </div>
  );
};

// NathIA Component - O MAIS IMPORTANTE
const NathIASection = ({ userName, gestationalData }: { userName: string; gestationalData: any }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: `Olá ${userName}! 👋 Sou a NathIA, sua assistente gestacional pessoal. Como posso te ajudar hoje?`,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const { triggerHaptic } = useHapticFeedback();

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;

    // Adicionar mensagem do usuário
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    triggerHaptic('light');

    // Resposta automática da NathIA (simulada)
    setTimeout(() => {
      const responses = [
        'Entendo sua preocupação. Vamos trabalhar juntas nisso! 💙',
        'Que ótimo! Estou aqui para te apoiar em cada etapa. 🌸',
        'Essa é uma dúvida muito comum. Deixa eu te ajudar com isso.',
        `Com ${gestationalData?.weeks || 20} semanas, você está no ${gestationalData?.trimester || 2}º trimestre. Vamos focar no seu bem-estar!`
      ];
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
      triggerHaptic('light');
    }, 1000);
  }, [inputValue, messages, gestationalData, triggerHaptic]);

  const quickQuestions = [
    'Como está meu bebê?',
    'Dicas para hoje',
    'Meu progresso',
    'Preciso de ajuda'
  ];

  return (
    <div className="space-y-4">
      <Card className="border-blue-200 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg">
              <Baby className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">NathIA</CardTitle>
              <p className="text-xs text-gray-600">Sua assistente gestacional pessoal</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Chat Messages */}
          <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-gray-800 border border-blue-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <span className={`text-xs mt-1 block ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {quickQuestions.map((question) => (
              <Button
                key={question}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInputValue(question);
                  handleSend();
                }}
                className="text-xs h-auto py-2 px-3 text-left justify-start"
              >
                {question}
              </Button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <Button
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700 px-4"
              size="icon"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Mundo Nath Component
const MundoNathSection = () => {
  const posts = useMemo(() => [
    {
      id: 1,
      title: 'Meu dia de hoje',
      description: 'Compartilhando momentos especiais da minha jornada',
      image: null,
      likes: 1250,
      comments: 45,
      time: '2h'
    },
    {
      id: 2,
      title: 'Dica de maternidade',
      description: 'O que aprendi nesses meses de gestação',
      image: null,
      likes: 890,
      comments: 32,
      time: '5h'
    }
  ], []);

  return (
    <div className="space-y-4">
      <Card className="border-blue-200 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Mundo Nath</CardTitle>
              <p className="text-xs text-gray-600">Onde Nath compartilha sua vida</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg border border-pink-100"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  N
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">{post.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{post.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-pink-200">
                <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">{post.comments}</span>
                </button>
                <span className="text-xs text-gray-400 ml-auto">{post.time}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

// Habit Tracker Component
const HabitTrackerSection = ({ habits, onToggleHabit }: { habits: any[]; onToggleHabit: (id: number) => void }) => {
  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => h.completed).length;
  const progress = (completedHabits / totalHabits) * 100;
  const longestStreak = Math.max(...habits.map(h => h.streak));

  return (
    <div className="space-y-4">
      {/* Stats Card */}
      <Card className="border-blue-200 shadow-md bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Meu Progresso Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-gray-700 font-medium">Hábitos completos</span>
                <span className="font-bold text-blue-700">{completedHabits}/{totalHabits}</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full h-3 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{longestStreak}</div>
                <div className="text-xs text-gray-600">Sequência máxima</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-cyan-600">{Math.round(progress)}%</div>
                <div className="text-xs text-gray-600">Concluído hoje</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Habits List */}
      <Card className="border-blue-200 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Meus Hábitos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {habits.map((habit) => (
            <button
              key={habit.id}
              onClick={() => onToggleHabit(habit.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                habit.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200 hover:border-blue-300'
              } active:scale-[0.98]`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                habit.completed ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {habit.completed ? '✓' : habit.icon}
              </div>
              <div className="flex-1 text-left">
                <h4 className={`font-semibold text-sm mb-1 ${habit.completed ? 'text-green-800' : 'text-gray-800'}`}>
                  {habit.name}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">{habit.streak} dias seguidos</span>
                  {habit.streak >= 7 && (
                    <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                      🔥 Streak!
                    </span>
                  )}
                </div>
              </div>
              {habit.completed && (
                <CheckCircle className="w-6 h-6 text-green-600" />
              )}
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

// Trendings Component
const TrendingsSection = ({ trendings }: { trendings: any[] }) => {
  return (
    <div className="space-y-4">
      <Card className="border-blue-200 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <CardTitle className="text-lg">Trendings</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {trendings.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg border border-orange-100"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-500 rounded-lg flex-shrink-0">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-800 text-sm">{item.title}</h4>
                    <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                      Trending
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-2">{item.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePageSimple;
