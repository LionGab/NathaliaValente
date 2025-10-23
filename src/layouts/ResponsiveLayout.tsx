import React, { useState, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
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
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const updateDimensions = () => {
      const { width, height } = Dimensions.get('window');
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

    const subscription = Dimensions.addEventListener('change', updateDimensions);
    updateDimensions(); // Initial call

    return () => subscription?.remove();
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
      return (
        <TabletLayout 
          {...commonProps}
          sidebar={sidebar}
          showSidebar={showSidebar}
        />
      );
    
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
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const updateDimensions = () => {
      const { width } = Dimensions.get('window');
      setDimensions({ width, height: dimensions.height });
      
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    const subscription = Dimensions.addEventListener('change', updateDimensions);
    updateDimensions();

    return () => subscription?.remove();
  }, [dimensions.height]);

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

  // Responsive values
  getResponsiveValue: <T>(
    mobile: T,
    tablet: T,
    desktop: T,
    currentBreakpoint: Breakpoint
  ): T => {
    switch (currentBreakpoint) {
      case 'mobile':
        return mobile;
      case 'tablet':
        return tablet;
      case 'desktop':
        return desktop;
      default:
        return mobile;
    }
  },

  // Responsive spacing
  getResponsiveSpacing: (
    mobile: string,
    tablet: string,
    desktop: string,
    currentBreakpoint: Breakpoint
  ): string => {
    return responsiveUtils.getResponsiveValue(mobile, tablet, desktop, currentBreakpoint);
  },

  // Responsive typography
  getResponsiveTypography: (
    mobile: string,
    tablet: string,
    desktop: string,
    currentBreakpoint: Breakpoint
  ): string => {
    return responsiveUtils.getResponsiveValue(mobile, tablet, desktop, currentBreakpoint);
  },

  // Responsive layout
  getResponsiveLayout: (
    mobile: React.ReactNode,
    tablet: React.ReactNode,
    desktop: React.ReactNode,
    currentBreakpoint: Breakpoint
  ): React.ReactNode => {
    return responsiveUtils.getResponsiveValue(mobile, tablet, desktop, currentBreakpoint);
  },
};

export default ResponsiveLayout;
