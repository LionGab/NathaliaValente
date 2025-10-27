import { Routine, RoutineIcon, RoutineFrequency } from '../types/routine';

export const mockRoutines: Routine[] = [
  {
    id: '1',
    user_id: 'demo-user',
    title: 'Café da manhã',
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
    title: 'Banho da manhã',
    icon: RoutineIcon.Bathing,
    time: '09:00',
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
    title: 'Atividade criativa',
    icon: RoutineIcon.Activities,
    time: '16:00',
    frequency: RoutineFrequency.Weekdays,
    active: true,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    user_id: 'demo-user',
    title: 'Jantar',
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
    title: 'Banho da noite',
    icon: RoutineIcon.Bathing,
    time: '20:00',
    frequency: RoutineFrequency.Daily,
    active: true,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
