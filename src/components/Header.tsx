import { HeaderLogo } from './ui/Logo';
import { HeaderMenu } from './ui/HeaderMenu';

type HeaderProps = {
  onProfileClick: () => void;
};

export const Header = ({ onProfileClick }: HeaderProps) => {
  return (
    <header className="glass sticky top-0 z-50 backdrop-blur-xl border-b border-claude-gray-200/50 dark:border-claude-gray-800/50 safe-area-inset">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <HeaderLogo className="hover:scale-110 transition-transform duration-300" />
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              ClubNath
            </h1>
          </div>

          {/* Simplified Header - Single Menu */}
          <HeaderMenu onSettingsClick={onProfileClick} />
        </div>
      </div>
    </header>
  );
};
