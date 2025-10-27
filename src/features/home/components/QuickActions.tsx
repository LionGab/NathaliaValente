import React from 'react';
import { Card } from '../../../components/ui/Card';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  ShoppingBag,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

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
    color: 'from-blue-500 to-cyan-500',
    href: '/routine'
  },
  {
    id: 'community',
    title: 'Comunidade',
    description: 'Conecte-se',
    icon: <Users className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-500',
    href: '/community'
  },
  {
    id: 'store',
    title: 'Loja',
    description: 'Produtos exclusivos',
    icon: <ShoppingBag className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500',
    href: '/store'
  },
  {
    id: 'support',
    title: 'Suporte',
    description: 'Ajuda e dicas',
    icon: <HelpCircle className="w-6 h-6" />,
    color: 'from-orange-500 to-red-500',
    href: '/support'
  }
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
            className={`bg-gradient-to-br ${action.color} p-6 text-white rounded-3xl cursor-pointer group relative overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-2 active:scale-95 transition-all duration-300`}
            data-testid={`quick-action-${action.id}`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-2xl group-hover:bg-white/30 transition-colors duration-300">
                  <div className="w-7 h-7 group-hover:scale-110 transition-transform duration-300">
                    {action.icon}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
              </div>

              <h3 className="font-bold text-lg mb-2 leading-tight">
                {action.title}
              </h3>
              <p className="text-sm text-white/90 font-medium">
                {action.description}
              </p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
