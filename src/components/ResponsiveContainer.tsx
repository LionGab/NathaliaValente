import React from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  mobileClassName = '',
  tabletClassName = '',
  desktopClassName = ''
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  const getResponsiveClassName = () => {
    let responsiveClass = className;

    if (isMobile) {
      responsiveClass += ` ${mobileClassName}`;
    } else if (isTablet) {
      responsiveClass += ` ${tabletClassName}`;
    } else if (isDesktop) {
      responsiveClass += ` ${desktopClassName}`;
    }

    return responsiveClass.trim();
  };

  return (
    <div className={getResponsiveClassName()}>
      {children}
    </div>
  );
};

// Responsive Grid Component
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: string;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'gap-4',
  className = ''
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

  const getGridCols = () => {
    if (isMobile) return `grid-cols-${cols.mobile || 1}`;
    if (isTablet) return `grid-cols-${cols.tablet || 2}`;
    return `grid-cols-${cols.desktop || 3}`;
  };

  return (
    <div className={`grid ${getGridCols()} ${gap} ${className}`}>
      {children}
    </div>
  );
};

// Responsive Text Component
interface ResponsiveTextProps {
  children: React.ReactNode;
  mobileSize?: string;
  tabletSize?: string;
  desktopSize?: string;
  className?: string;
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  mobileSize = 'text-sm',
  tabletSize = 'text-base',
  desktopSize = 'text-lg',
  className = ''
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

  const getTextSize = () => {
    if (isMobile) return mobileSize;
    if (isTablet) return tabletSize;
    return desktopSize;
  };

  return (
    <span className={`${getTextSize()} ${className}`}>
      {children}
    </span>
  );
};

// Responsive Image Component
interface ResponsiveImageProps {
  src: string;
  alt: string;
  mobileSrc?: string;
  tabletSrc?: string;
  desktopSrc?: string;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  mobileSrc,
  tabletSrc,
  desktopSrc,
  className = '',
  mobileClassName = '',
  tabletClassName = '',
  desktopClassName = ''
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

  const getImageSrc = () => {
    if (isMobile && mobileSrc) return mobileSrc;
    if (isTablet && tabletSrc) return tabletSrc;
    if (desktopSrc) return desktopSrc;
    return src;
  };

  const getImageClassName = () => {
    let responsiveClass = className;

    if (isMobile) {
      responsiveClass += ` ${mobileClassName}`;
    } else if (isTablet) {
      responsiveClass += ` ${tabletClassName}`;
    } else {
      responsiveClass += ` ${desktopClassName}`;
    }

    return responsiveClass.trim();
  };

  return (
    <img
      src={getImageSrc()}
      alt={alt}
      className={getImageClassName()}
      loading="lazy"
    />
  );
};

// Responsive Spacing Component
interface ResponsiveSpacingProps {
  children: React.ReactNode;
  mobilePadding?: string;
  tabletPadding?: string;
  desktopPadding?: string;
  mobileMargin?: string;
  tabletMargin?: string;
  desktopMargin?: string;
  className?: string;
}

export const ResponsiveSpacing: React.FC<ResponsiveSpacingProps> = ({
  children,
  mobilePadding = '',
  tabletPadding = '',
  desktopPadding = '',
  mobileMargin = '',
  tabletMargin = '',
  desktopMargin = '',
  className = ''
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

  const getSpacingClasses = () => {
    let spacingClass = className;

    if (isMobile) {
      spacingClass += ` ${mobilePadding} ${mobileMargin}`;
    } else if (isTablet) {
      spacingClass += ` ${tabletPadding} ${tabletMargin}`;
    } else {
      spacingClass += ` ${desktopPadding} ${desktopMargin}`;
    }

    return spacingClass.trim();
  };

  return (
    <div className={getSpacingClasses()}>
      {children}
    </div>
  );
};
