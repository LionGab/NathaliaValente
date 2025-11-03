import { ReactNode, useState } from 'react';
import { cn } from '../../lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  tap?: boolean;
  glow?: boolean;
  delay?: number;
}

export const AnimatedCard = ({
  children,
  className,
  hover = true,
  tap = true,
  glow = false,
  delay = 0,
}: AnimatedCardProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    if (tap) setIsPressed(true);
  };

  const handleMouseUp = () => {
    if (tap) setIsPressed(false);
  };

  const handleMouseLeave = () => {
    if (tap) setIsPressed(false);
  };

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-out',
        hover && 'hover:scale-[1.02] hover:shadow-xl',
        tap && isPressed && 'scale-[0.98]',
        glow && 'hover:shadow-pink-500/25',
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards',
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};
