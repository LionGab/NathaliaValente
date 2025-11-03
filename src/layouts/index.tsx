/**
 * ClubNath Layouts - Responsive Layout System
 * Sistema de Layouts Responsivos para Mães
 * Foco: Acolhimento, Conexão e Pertencentimento
 */

import React, { useState, useEffect } from 'react';

// Layout Components
export { MobileLayout } from './MobileLayout';
export { TabletLayout } from './TabletLayout';
export { DesktopLayout } from './DesktopLayout';
// ResponsiveLayout is defined below

// Layout Types
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

// Layout Configuration
export const layoutConfig = {
  // Breakpoints
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1024,
  },

  // Layout Features
  features: {
    mobile: {
      header: true,
      navigation: true,
      sidebar: false,
      rightPanel: false,
      maxWidth: '100%',
    },
    tablet: {
      header: true,
      navigation: true,
      sidebar: true,
      rightPanel: false,
      maxWidth: '100%',
    },
    desktop: {
      header: true,
      navigation: true,
      sidebar: true,
      rightPanel: true,
      maxWidth: '100%',
    },
  },

  // Spacing
  spacing: {
    mobile: {
      header: 'pt-2',
      content: 'pt-2 pb-20',
      navigation: 'pb-20',
    },
    tablet: {
      header: 'pt-2',
      content: 'pt-2 pb-20',
      navigation: 'pb-20',
      sidebar: 'w-80',
    },
    desktop: {
      header: 'pt-2',
      content: 'pt-2 pb-20',
      navigation: 'pb-20',
      sidebar: 'w-80',
      rightPanel: 'w-80',
    },
  },

  // Z-Index
  zIndex: {
    background: 0,
    content: 10,
    header: 20,
    navigation: 30,
    sidebar: 40,
    rightPanel: 40,
    modal: 50,
    notification: 60,
    tooltip: 70,
  },
} as const;

// Layout Utilities
export const layoutUtils = {
  // Get layout features for breakpoint
  getFeatures: (breakpoint: Breakpoint) => {
    return layoutConfig.features[breakpoint];
  },

  // Get spacing for breakpoint
  getSpacing: (breakpoint: Breakpoint) => {
    return layoutConfig.spacing[breakpoint];
  },

  // Get z-index for element
  getZIndex: (element: keyof typeof layoutConfig.zIndex) => {
    return layoutConfig.zIndex[element];
  },

  // Check if breakpoint supports feature
  supportsFeature: (breakpoint: Breakpoint, feature: keyof typeof layoutConfig.features.mobile) => {
    return layoutConfig.features[breakpoint][feature];
  },

  // Get responsive class names
  getResponsiveClasses: (breakpoint: Breakpoint) => {
    const spacing = layoutConfig.spacing[breakpoint];
    const features = layoutConfig.features[breakpoint];

    return {
      header: spacing.header,
      content: spacing.content,
      navigation: spacing.navigation,
      sidebar: (features as any).sidebar ? (spacing as any).sidebar : '',
      rightPanel: (features as any).rightPanel ? (spacing as any).rightPanel : '',
    };
  },
};

// Layout Hooks
export const useLayout = () => {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) setBreakpoint('mobile');
      else if (width < 1024) setBreakpoint('tablet');
      else setBreakpoint('desktop');
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';
  const isDesktop = breakpoint === 'desktop';
  const width = typeof window !== 'undefined' ? window.innerWidth : 0;
  const height = typeof window !== 'undefined' ? window.innerHeight : 0;

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    width,
    height,
    features: layoutUtils.getFeatures(breakpoint),
    spacing: layoutUtils.getSpacing(breakpoint),
    classes: layoutUtils.getResponsiveClasses(breakpoint),
  };
};

// Layout Components with Props
export interface LayoutProps {
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
}

export interface ResponsiveLayoutProps extends LayoutProps {
  sidebar?: React.ReactNode;
  showSidebar?: boolean;
  rightPanel?: React.ReactNode;
  showRightPanel?: boolean;
}

// Layout Context
export const LayoutContext = React.createContext<{
  breakpoint: Breakpoint;
  features: typeof layoutConfig.features.mobile;
  spacing: typeof layoutConfig.spacing.mobile;
  classes: ReturnType<typeof layoutUtils.getResponsiveClasses>;
}>({
  breakpoint: 'mobile',
  features: layoutConfig.features.mobile,
  spacing: layoutConfig.spacing.mobile,
  classes: layoutUtils.getResponsiveClasses('mobile'),
});

// Layout Provider
export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { breakpoint } = useLayout();
  const features = layoutUtils.getFeatures(breakpoint);
  const spacing = layoutUtils.getSpacing(breakpoint);
  const classes = layoutUtils.getResponsiveClasses(breakpoint);

  return React.createElement(
    LayoutContext.Provider,
    { value: { breakpoint, features: features as any, spacing, classes } },
    children
  );
};

// Layout Consumer Hook
export const useLayoutContext = () => {
  const context = React.useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutContext must be used within a LayoutProvider');
  }
  return context;
};

// Export default layout component
export const ResponsiveLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMobile, isTablet, isDesktop } = useLayout();

  if (isMobile) {
    return React.createElement(require('./MobileLayout').MobileLayout, {}, children);
  } else if (isTablet) {
    return React.createElement(require('./TabletLayout').TabletLayout, {}, children);
  } else {
    return React.createElement(require('./DesktopLayout').DesktopLayout, {}, children);
  }
};

export default ResponsiveLayout;
