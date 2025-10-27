export enum RoutineIcon {
  Feeding = 'feeding',
  Bathing = 'bathing',
  Sleeping = 'sleeping',
  Activities = 'activities'
}

export enum RoutineFrequency {
  Daily = 'daily',
  Weekdays = 'weekdays',
  Weekends = 'weekends',
  Custom = 'custom'
}

export interface Routine {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  icon: RoutineIcon;
  time: string; // HH:MM
  frequency: RoutineFrequency;
  custom_days?: number[]; // 0-6 (domingo a sábado)
  active: boolean;
  completed_at: string | null;
  shared_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRoutineInput {
  title: string;
  icon: RoutineIcon;
  time: string;
  frequency: RoutineFrequency;
  custom_days?: number[];
}

export interface UpdateRoutineInput extends Partial<CreateRoutineInput> {
  id: string;
  active?: boolean;
  completed_at?: string | null;
}

export interface SharedRoutine {
  id: string;
  created_by: string;
  title: string;
  description?: string;
  routine_ids: string[];
  shared_count: number;
  created_at: string;
}

// Helper functions
export const getIconEmoji = (icon: RoutineIcon): string => {
  const emojiMap = {
    [RoutineIcon.Feeding]: '🍼',
    [RoutineIcon.Bathing]: '🛁',
    [RoutineIcon.Sleeping]: '😴',
    [RoutineIcon.Activities]: '🎨'
  };
  return emojiMap[icon];
};

export const getIconLabel = (icon: RoutineIcon): string => {
  const labelMap = {
    [RoutineIcon.Feeding]: 'Alimentação',
    [RoutineIcon.Bathing]: 'Banho',
    [RoutineIcon.Sleeping]: 'Sono',
    [RoutineIcon.Activities]: 'Atividades'
  };
  return labelMap[icon];
};

export const validateTime = (time: string): boolean => {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export const isRoutineActiveToday = (routine: Routine): boolean => {
  const today = new Date().getDay(); // 0-6

  switch (routine.frequency) {
    case RoutineFrequency.Daily:
      return true;
    case RoutineFrequency.Weekdays:
      return today >= 1 && today <= 5;
    case RoutineFrequency.Weekends:
      return today === 0 || today === 6;
    case RoutineFrequency.Custom:
      return routine.custom_days?.includes(today) ?? false;
    default:
      return false;
  }
};
