import React from 'react';
import { Card } from '../../components/ui/Card';
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
    <div className="grid grid-cols-2 gap-4 mb-6">
      {quickActions.map((action) => (
        <Card
          key={action.id}
          className={`bg-gradient-to-br ${action.color} p-4 text-white hover:scale-105 transition-all duration-200 cursor-pointer group`}
          data-testid={`quick-action-${action.id}`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              {action.icon}
            </div>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <h3 className="font-semibold text-sm mb-1">
            {action.title}
          </h3>
          <p className="text-xs text-white/80">
            {action.description}
          </p>
        </Card>
      ))}
    </div>
  );
};
