import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  User, Settings, LogOut, Heart, ShoppingBag,
  Bell, ChevronDown, Award, BookOpen, HelpCircle
} from 'lucide-react';

export const Header: React.FC = () => {
  const { profile } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Dados do usuário para o menu
  const userStats = {
    level: 5,
    points: 1250,
    nextLevel: 1500,
    streak: 7,
    badges: ['Primeira Postagem', 'Apoiadora', 'Especialista em Amamentação'],
    notifications: [
      { id: 1, title: 'Nova dica disponível', message: 'Dicas para o 2º trimestre', time: '2h', unread: true },
      { id: 2, title: 'Parabéns!', message: 'Você completou 7 dias seguidos', time: '1d', unread: false },
      { id: 3, title: 'Novo produto', message: 'Kit Baby o Boticário em promoção', time: '2d', unread: false }
    ]
  };

  const progressPercentage = (userStats.points / userStats.nextLevel) * 100;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="w-full mx-auto px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Título à esquerda */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">NM</span>
            </div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-white hidden sm:block">
              Nossa Maternidade
            </h1>
          </div>

          {/* Meu Espaço no canto superior direito */}
          <div className="flex items-center gap-3">
            {/* Notificações */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Notificações"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                {userStats.notifications.filter(n => n.unread).length > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {userStats.notifications.filter(n => n.unread).length}
                    </span>
                  </div>
                )}
              </motion.button>

              {/* Dropdown de Notificações */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        <Bell className="w-4 h-4" aria-hidden="true" />
                        Notificações
                      </h3>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {userStats.notifications.map((notification) => (
                          <div key={notification.id} className={`p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{notification.title}</h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">{notification.time}</span>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Meu Espaço */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl hover:from-pink-500/20 hover:to-purple-500/20 transition-all duration-200 border border-pink-200 dark:border-pink-800"
                aria-label="Meu Espaço"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-pink-200 dark:ring-pink-800"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {profile?.full_name?.charAt(0) || 'M'}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {profile?.full_name?.split(' ')[0] || 'Mamãe'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Nível {userStats.level}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" aria-hidden="true" />
              </motion.button>

              {/* Dropdown do Meu Espaço */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <div className="p-4">
                      {/* Header do usuário */}
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={profile.full_name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-200 dark:ring-pink-800"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                            {profile?.full_name?.charAt(0) || 'M'}
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 dark:text-white">
                            {profile?.full_name || 'Mamãe'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Nível {userStats.level} • {userStats.points} pontos
                          </p>
                          {/* Barra de progresso */}
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                            <div
                              className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Estatísticas rápidas */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-lg font-bold text-pink-600">{userStats.streak}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Dias seguidos</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">12</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Posts</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">3</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Conquistas</div>
                        </div>
                      </div>

                      {/* Menu de navegação */}
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'profile' } }));
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                        >
                          <User className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                          <span className="text-gray-800 dark:text-white">Meu Perfil</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                        >
                          <BookOpen className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                          <span className="text-gray-800 dark:text-white">Minha Rotina</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'store' } }));
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                        >
                          <ShoppingBag className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                          <span className="text-gray-800 dark:text-white">Minhas Compras</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feed' } }));
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                        >
                          <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                          <span className="text-gray-800 dark:text-white">Favoritos</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                        >
                          <Award className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                          <span className="text-gray-800 dark:text-white">Conquistas</span>
                        </button>

                        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                        >
                          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                          <span className="text-gray-800 dark:text-white">Configurações</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                        >
                          <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                          <span className="text-gray-800 dark:text-white">Ajuda</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            // Implementar logout
                            console.log('Logout');
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                        >
                          <LogOut className="w-5 h-5 text-red-600" aria-hidden="true" />
                          <span className="text-red-600">Sair</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
