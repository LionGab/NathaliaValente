import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
    children,
    className,
    variant = 'default',
    ...props
}) => {
    const baseClasses = 'rounded-lg border bg-card text-card-foreground shadow-sm';

    const variantClasses = {
        default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
        elevated: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg',
        outlined: 'bg-transparent border-gray-200 dark:border-gray-700'
    };

    return (
        <div
            className={cn(
                baseClasses,
                variantClasses[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
