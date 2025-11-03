import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface UserStats {
  streak: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  badges: string[];
  todayCompleted: number;
  totalTasks: number;
  lastActiveDate: string;
  weeklyGoal: number;
  monthlyGoal: number;
}

export interface Task {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  icon: string;
  xpReward: number;
  category: 'routine' | 'wellness' | 'community' | 'learning';
}

export const useUserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    streak: 0,
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    badges: [],
    todayCompleted: 0,
    totalTasks: 5,
    lastActiveDate: new Date().toISOString().split('T')[0],
    weeklyGoal: 20,
    monthlyGoal: 80,
  });

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Café da manhã',
      time: '08:00',
      completed: false,
      icon: '☕',
      xpReward: 10,
      category: 'routine',
    },
    {
      id: '2',
      title: 'Banho da manhã',
      time: '09:00',
      completed: false,
      icon: '🛁',
      xpReward: 10,
      category: 'routine',
    },
    {
      id: '3',
      title: 'Soneca da tarde',
      time: '14:00',
      completed: false,
      icon: '😴',
      xpReward: 15,
      category: 'wellness',
    },
    {
      id: '4',
      title: 'Exercício leve',
      time: '16:00',
      completed: false,
      icon: '🧘',
      xpReward: 20,
      category: 'wellness',
    },
    {
      id: '5',
      title: 'Momento de leitura',
      time: '20:00',
      completed: false,
      icon: '📚',
      xpReward: 15,
      category: 'learning',
    },
  ]);

  // Load stats from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedStats = localStorage.getItem(`userStats_${user.id}`);
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    }
  }, [user]);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`userStats_${user.id}`, JSON.stringify(stats));
    }
  }, [stats, user]);

  // Check for streak maintenance
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = stats.lastActiveDate;

    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastActive === yesterdayStr) {
        // Streak continues
        setStats((prev) => ({
          ...prev,
          streak: prev.streak + 1,
          lastActiveDate: today,
        }));
      } else if (lastActive !== today) {
        // Streak broken
        setStats((prev) => ({
          ...prev,
          streak: 1,
          lastActiveDate: today,
        }));
      }
    }
  }, [stats.lastActiveDate]);

  const completeTask = useCallback(
    (taskId: string) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, completed: true } : task))
      );

      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        setStats((prev) => {
          const newXp = prev.xp + task.xpReward;
          const newLevel = Math.floor(newXp / 100) + 1;
          const nextLevelXp = newLevel * 100;
          const newCompleted = prev.todayCompleted + 1;

          // Check for level up
          const leveledUp = newLevel > prev.level;

          // Check for badges
          const newBadges = [...prev.badges];
          if (newCompleted === 1 && !newBadges.includes('first_task')) {
            newBadges.push('first_task');
          }
          if (newCompleted === 5 && !newBadges.includes('daily_complete')) {
            newBadges.push('daily_complete');
          }
          if (prev.streak >= 7 && !newBadges.includes('week_streak')) {
            newBadges.push('week_streak');
          }
          if (newLevel >= 5 && !newBadges.includes('level_5')) {
            newBadges.push('level_5');
          }

          return {
            ...prev,
            xp: newXp,
            level: newLevel,
            nextLevelXp,
            todayCompleted: newCompleted,
            badges: newBadges,
          };
        });
      }
    },
    [tasks]
  );

  const getProgressPercentage = useCallback(() => {
    return (stats.todayCompleted / stats.totalTasks) * 100;
  }, [stats.todayCompleted, stats.totalTasks]);

  const getLevelProgress = useCallback(() => {
    const currentLevelXp = (stats.level - 1) * 100;
    const xpInCurrentLevel = stats.xp - currentLevelXp;
    const xpNeededForLevel = 100;
    return (xpInCurrentLevel / xpNeededForLevel) * 100;
  }, [stats.xp, stats.level]);

  const getBadgeInfo = useCallback((badgeId: string) => {
    const badgeMap: Record<string, { name: string; description: string; icon: string }> = {
      first_task: {
        name: 'Primeira Tarefa',
        description: 'Complete sua primeira tarefa',
        icon: '⭐',
      },
      daily_complete: {
        name: 'Dia Completo',
        description: 'Complete todas as tarefas do dia',
        icon: '🏆',
      },
      week_streak: {
        name: 'Semana de Fogo',
        description: 'Mantenha o streak por 7 dias',
        icon: '🔥',
      },
      level_5: { name: 'Experiente', description: 'Alcance o nível 5', icon: '👑' },
    };
    return (
      badgeMap[badgeId] || { name: 'Badge', description: 'Conquista desbloqueada', icon: '🏅' }
    );
  }, []);

  return {
    stats,
    tasks,
    completeTask,
    getProgressPercentage,
    getLevelProgress,
    getBadgeInfo,
  };
};
