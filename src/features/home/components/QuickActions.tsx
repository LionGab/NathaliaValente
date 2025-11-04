import React from 'react';
import { Card } from '../../../components/ui/Card';
import { motion } from 'framer-motion';
import { Calendar, Users, ShoppingBag, HelpCircle, ChevronRight } from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  href: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'routine',
    title: 'Minha Rotina',
    description: 'Organize seu dia',
    icon: <Calendar className="w-6 h-6" />,
    color: 'bg-accent-100 text-accent-700 hover:bg-accent-200',
    href: '/routine',
  },
  {
    id: 'community',
    title: 'Comunidade',
    description: 'Conecte-se',
    icon: <Users className="w-6 h-6" />,
    color: 'bg-success-100 text-success-700 hover:bg-success-200',
    href: '/community',
  },
  {
    id: 'store',
    title: 'Loja',
    description: 'Produtos exclusivos',
    icon: <ShoppingBag className="w-6 h-6" />,
    color: 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200',
    href: '/store',
  },
  {
    id: 'support',
    title: 'Suporte',
    description: 'Ajuda e dicas',
    icon: <HelpCircle className="w-6 h-6" />,
    color: 'bg-warning-100 text-warning-700 hover:bg-warning-200',
    href: '/support',
  },
];

export const QuickActions: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {quickActions.map((action, index) => (
        <motion.div
          key={action.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <Card
            className={`${action.color} p-5 rounded-2xl border border-transparent cursor-pointer group relative overflow-hidden hover:shadow-sm active:scale-98 transition-all duration-200`}
            data-testid={`quick-action-${action.id}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-white/60 rounded-xl group-hover:bg-white transition-colors duration-200">
                <div className="w-5 h-5">{action.icon}</div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5" />
            </div>

            <h3 className="font-semibold text-base mb-1 leading-tight">{action.title}</h3>
            <p className="text-sm opacity-80">{action.description}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
