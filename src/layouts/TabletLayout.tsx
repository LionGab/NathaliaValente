import React from 'react';
import { Header } from '../components/Header';
import { Navigation } from '../components/Navigation';
import { NotificationContainer } from '../components/ErrorNotification';
import { useNotifications } from '../hooks/useNotifications';

interface TabletLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onProfileClick: () => void;
  showHeader?: boolean;
  showNavigation?: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
  headerActions?: React.ReactNode;
  className?: string;
  sidebar?: React.ReactNode;
  showSidebar?: boolean;
}

export const TabletLayout: React.FC<TabletLayoutProps> = ({
  children,
  currentPage,
  onNavigate,
  onProfileClick,
  showHeader = true,
  showNavigation = true,
  headerTitle,
  headerSubtitle,
  headerActions,
  className = '',
  sidebar,
  showSidebar = false,
}) => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="flex-1 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-neutral-900 dark:via-primary-950 dark:to-secondary-950">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-200/20 dark:bg-primary-800/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-200/20 dark:bg-secondary-800/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '1s' }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-200/10 dark:bg-accent-800/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Layout */}
      <div className="flex-1 relative z-10">
        {/* Header */}
        {showHeader && (
          <Header
            onProfileClick={onProfileClick}
          />
        )}

        {/* Content Area with Sidebar */}
        <div className="flex-1 flex-row">
          {/* Sidebar */}
          {showSidebar && sidebar && (
            <div className="w-80 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border-r border-neutral-200 dark:border-neutral-700">
              {sidebar}
            </div>
          )}

          {/* Main Content */}
          <div className={`flex-1 ${showHeader ? 'pt-2' : 'pt-4'} ${showNavigation ? 'pb-20' : 'pb-4'} ${className}`}>
            {children}
          </div>
        </div>

        {/* Bottom Navigation */}
        {showNavigation && (
          <Navigation
            currentPage={currentPage}
            onNavigate={onNavigate}
          />
        )}

        {/* Notifications */}
        <NotificationContainer
          notifications={notifications}
          onClose={removeNotification}
        />
      </div>
    </div>
  );
};
