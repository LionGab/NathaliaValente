import React, { useState } from 'react';
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
    notifications: [
      { id: 1, title: 'Nova dica disponível', message: 'Dicas para o 2º trimestre', time: '2h', unread: true },
      { id: 2, title: 'Parabéns!', message: 'Você completou 7 dias seguidos', time: '1d', unread: false },
    ]
  };

  const progressPercentage = (userStats.points / userStats.nextLevel) * 100;

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm safe-top">
      <div className="w-full mx-auto px-4 py-3 safe-left safe-right">
        <div className="flex items-center justify-between">
          {/* Logo/Título à esquerda */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center touch-target-sm">
              <span className="text-white font-bold text-sm">NM</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white hidden sm:block">
              Nossa Maternidade
            </h1>
          </div>

          {/* Meu Espaço no canto superior direito */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notificações */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 sm:p-2 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors touch-target-sm active:scale-98"
                aria-label="Notificações"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                {userStats.notifications.filter(n => n.unread).length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-4 sm:h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {userStats.notifications.filter(n => n.unread).length}
                    </span>
                  </div>
                )}
              </button>

              {/* Dropdown de Notificações - Mobile First */}
              {showNotifications && (
                <>
                  {/* Overlay para fechar ao clicar fora */}
                  <div 
                    className="fixed inset-0 z-40 bg-black/20" 
                    onClick={() => setShowNotifications(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 top-14 w-[calc(100vw-2rem)] max-w-sm sm:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2 text-base">
                        <Bell className="w-5 h-5" aria-hidden="true" />
                        Notificações
                      </h3>
                      <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                        {userStats.notifications.map((notification) => (
                          <button
                            key={notification.id}
                            onClick={() => setShowNotifications(false)}
                            className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-target ${notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{notification.title}</h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-xs text-gray-500 whitespace-nowrap">{notification.time}</span>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Meu Espaço */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 sm:p-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-200 border border-blue-200 dark:border-blue-800 touch-target-sm active:scale-98"
                aria-label="Meu Espaço"
                aria-expanded={showUserMenu}
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-10 h-10 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-blue-200 dark:ring-blue-800"
                  />
                ) : (
                  <div className="w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-semibold text-sm">
                    {profile?.full_name?.charAt(0) || 'M'}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {profile?.full_name?.split(' ')[0] || 'Mamãe'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Nível {userStats.level}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400 hidden sm:block" aria-hidden="true" />
              </button>

              {/* Dropdown do Meu Espaço - Mobile First */}
              {showUserMenu && (
                <>
                  {/* Overlay para fechar ao clicar fora */}
                  <div 
                    className="fixed inset-0 z-40 bg-black/20" 
                    onClick={() => setShowUserMenu(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 top-14 w-[calc(100vw-2rem)] max-w-sm sm:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-[85vh] overflow-y-auto">
                    <div className="p-4">
                      {/* Header do usuário */}
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={profile.full_name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-200 dark:ring-blue-800 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                            {profile?.full_name?.charAt(0) || 'M'}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 dark:text-white text-base truncate">
                            {profile?.full_name || 'Mamãe'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Nível {userStats.level} • {userStats.points} pontos
                          </p>
                          {/* Barra de progresso */}
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Estatísticas rápidas */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                        <div className="text-center p-2 sm:p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-base sm:text-lg font-bold text-blue-600">{userStats.streak}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Dias seguidos</div>
                        </div>
                        <div className="text-center p-2 sm:p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-base sm:text-lg font-bold text-blue-600">12</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Posts</div>
                        </div>
                        <div className="text-center p-2 sm:p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-base sm:text-lg font-bold text-blue-600">3</div>
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
                          className="w-full flex items-center gap-3 p-3 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors text-left touch-target"
                        >
                          <User className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" aria-hidden="true" />
                          <span className="text-gray-800 dark:text-white text-sm sm:text-base">Meu Perfil</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
                          }}
                          className="w-full flex items-center gap-3 p-3 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors text-left touch-target"
                        >
                          <BookOpen className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" aria-hidden="true" />
                          <span className="text-gray-800 dark:text-white text-sm sm:text-base">Minha Rotina</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'store' } }));
                          }}
                          className="w-full flex items-center gap-3 p-3 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors text-left touch-target"
                        >
                          <ShoppingBag className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" aria-hidden="true" />
                          <span className="text-gray-800 dark:text-white text-sm sm:text-base">Minhas Compras</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feed' } }));
                          }}
                          className="w-full flex items-center gap-3 p-3 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors text-left touch-target"
                        >
                          <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" aria-hidden="true" />
                          <span className="text-gray-800 dark:text-white text-sm sm:text-base">Favoritos</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
                          }}
                          className="w-full flex items-center gap-3 p-3 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors text-left touch-target"
                        >
                          <Award className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" aria-hidden="true" />
                          <span className="text-gray-800 dark:text-white text-sm sm:text-base">Conquistas</span>
                        </button>

                        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
                          }}
                          className="w-full flex items-center gap-3 p-3 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors text-left touch-target"
                        >
                          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" aria-hidden="true" />
                          <span className="text-gray-800 dark:text-white text-sm sm:text-base">Configurações</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
                          }}
                          className="w-full flex items-center gap-3 p-3 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors text-left touch-target"
                        >
                          <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" aria-hidden="true" />
                          <span className="text-gray-800 dark:text-white text-sm sm:text-base">Ajuda</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            // Implementar logout
                            console.log('Logout');
                          }}
                          className="w-full flex items-center gap-3 p-3 sm:p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 dark:active:bg-red-900/30 transition-colors text-left touch-target"
                        >
                          <LogOut className="w-5 h-5 text-red-600 flex-shrink-0" aria-hidden="true" />
                          <span className="text-red-600 text-sm sm:text-base">Sair</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
