import React, { useState, useEffect } from 'react';
import { MobileLayout } from './MobileLayout';
import { TabletLayout } from './TabletLayout';
import { DesktopLayout } from './DesktopLayout';

interface ResponsiveLayoutProps {
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
  rightPanel?: React.ReactNode;
  showRightPanel?: boolean;
}

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
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
  rightPanel,
  showRightPanel = false,
}) => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('mobile');
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const { width, height } = { width: window.innerWidth, height: window.innerHeight };
      setDimensions({ width, height });

      // Determine breakpoint based on width
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions(); // Initial call

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Common props for all layouts
  const commonProps = {
    children,
    currentPage,
    onNavigate,
    onProfileClick,
    showHeader,
    showNavigation,
    headerTitle,
    headerSubtitle,
    headerActions,
    className,
  };

  // Render appropriate layout based on breakpoint
  switch (breakpoint) {
    case 'mobile':
      return <MobileLayout {...commonProps} />;

    case 'tablet':
      return <TabletLayout {...commonProps} sidebar={sidebar} showSidebar={showSidebar} />;

    case 'desktop':
      return (
        <DesktopLayout
          {...commonProps}
          sidebar={sidebar}
          showSidebar={showSidebar}
          rightPanel={rightPanel}
          showRightPanel={showRightPanel}
        />
      );

    default:
      return <MobileLayout {...commonProps} />;
  }
};

// Hook for responsive breakpoints
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('mobile');
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const { width, height } = { width: window.innerWidth, height: window.innerHeight };
      setDimensions({ width, height });

      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    width: dimensions.width,
    height: dimensions.height,
  };
};

// Responsive utilities
export const responsiveUtils = {
  // Breakpoint values
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1024,
  },

  // Media queries
  mediaQueries: {
    mobile: '(max-width: 767px)',
    tablet: '(min-width: 768px) and (max-width: 1023px)',
    desktop: '(min-width: 1024px)',
    mobileAndTablet: '(max-width: 1023px)',
    tabletAndDesktop: '(min-width: 768px)',
  },
};

export default ResponsiveLayout;
