import { Routine, RoutineIcon, RoutineFrequency } from '../types/routine';

export const mockRoutines: Routine[] = [
  {
    id: '1',
    user_id: 'demo-user',
    title: 'Café da manhã nutritivo',
    description: 'Frutas, cereais e proteínas para começar o dia',
    icon: RoutineIcon.Feeding,
    time: '08:00',
    frequency: RoutineFrequency.Daily,
    active: true,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'demo-user',
    title: 'Exercícios de alongamento',
    description: 'Movimentos suaves para aliviar tensões',
    icon: RoutineIcon.Activities,
    time: '09:30',
    frequency: RoutineFrequency.Daily,
    active: true,
    completed_at: new Date().toISOString(), // Já completado
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    user_id: 'demo-user',
    title: 'Soneca da tarde',
    description: 'Descanso para recarregar as energias',
    icon: RoutineIcon.Sleeping,
    time: '14:00',
    frequency: RoutineFrequency.Daily,
    active: true,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    user_id: 'demo-user',
    title: 'Caminhada leve',
    description: 'Atividade física moderada ao ar livre',
    icon: RoutineIcon.Activities,
    time: '16:00',
    frequency: RoutineFrequency.Daily,
    active: true,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    user_id: 'demo-user',
    title: 'Jantar balanceado',
    description: 'Refeição rica em nutrientes essenciais',
    icon: RoutineIcon.Feeding,
    time: '19:00',
    frequency: RoutineFrequency.Daily,
    active: true,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    user_id: 'demo-user',
    title: 'Relaxamento noturno',
    description: 'Técnicas de relaxamento para melhor sono',
    icon: RoutineIcon.Sleeping,
    time: '21:00',
    frequency: RoutineFrequency.Daily,
    active: true,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
