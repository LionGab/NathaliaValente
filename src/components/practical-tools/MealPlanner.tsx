import React, { useState } from 'react';
import { Utensils, Plus, Clock, Users, ChefHat, ShoppingCart } from 'lucide-react';

interface Meal {
  id: string;
  name: string;
  time: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  ingredients: string[];
  prepTime: number; // em minutos
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  notes?: string;
}

interface DayPlan {
  date: string;
  meals: Meal[];
}

export const MealPlanner: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState<DayPlan[]>([]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [newMeal, setNewMeal] = useState<Partial<Meal>>({
    name: '',
    time: '',
    type: 'breakfast',
    ingredients: [],
    prepTime: 15,
    servings: 4,
    difficulty: 'easy',
  });

  // Inicializar semana atual
  React.useEffect(() => {
    const today = new Date();
    const week = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      week.push({
        date: date.toISOString().split('T')[0],
        meals: [],
      });
    }

    setCurrentWeek(week);
  }, []);

  const addMeal = () => {
    if (!selectedDay || !newMeal.name || !newMeal.time) return;

    const meal: Meal = {
      id: Date.now().toString(),
      name: newMeal.name!,
      time: newMeal.time!,
      type: newMeal.type!,
      ingredients: newMeal.ingredients || [],
      prepTime: newMeal.prepTime || 15,
      servings: newMeal.servings || 4,
      difficulty: newMeal.difficulty!,
      notes: newMeal.notes,
    };

    setCurrentWeek((prev) =>
      prev.map((day) => (day.date === selectedDay ? { ...day, meals: [...day.meals, meal] } : day))
    );

    setNewMeal({
      name: '',
      time: '',
      type: 'breakfast',
      ingredients: [],
      prepTime: 15,
      servings: 4,
      difficulty: 'easy',
    });
    setShowAddMeal(false);
  };

  const removeMeal = (dayDate: string, mealId: string) => {
    setCurrentWeek((prev) =>
      prev.map((day) =>
        day.date === dayDate
          ? { ...day, meals: day.meals.filter((meal) => meal.id !== mealId) }
          : day
      )
    );
  };

  const getShoppingList = () => {
    const allIngredients = currentWeek.flatMap((day) =>
      day.meals.flatMap((meal) => meal.ingredients)
    );

    const ingredientCount = allIngredients.reduce(
      (acc, ingredient) => {
        acc[ingredient] = (acc[ingredient] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(ingredientCount).map(([ingredient, count]) => ({
      ingredient,
      count,
    }));
  };

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '🍽️';
      case 'dinner':
        return '🌙';
      case 'snack':
        return '🍎';
      default:
        return '🍽️';
    }
  };

  const getMealTypeColor = (type: string) => {
    switch (type) {
      case 'breakfast':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'lunch':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'dinner':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'snack':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 dark:text-green-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'hard':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday) return 'Hoje';

    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
          <Utensils className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            Planejador de Refeições
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Organize as refeições da semana</p>
        </div>
      </div>

      {/* Lista de compras */}
      {getShoppingList().length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-semibold text-blue-800 dark:text-blue-200">Lista de Compras</h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {getShoppingList()
              .slice(0, 8)
              .map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white dark:bg-gray-700 rounded-lg p-2"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {item.ingredient}
                  </span>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {item.count}x
                  </span>
                </div>
              ))}
          </div>
          {getShoppingList().length > 8 && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
              +{getShoppingList().length - 8} itens a mais
            </p>
          )}
        </div>
      )}

      {/* Semana */}
      <div className="space-y-4">
        {currentWeek.map((day) => (
          <div
            key={day.date}
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800 dark:text-white">
                {formatDate(day.date)}
              </h4>
              <button
                onClick={() => {
                  setSelectedDay(day.date);
                  setShowAddMeal(true);
                }}
                className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>

            {day.meals.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                Nenhuma refeição planejada
              </p>
            ) : (
              <div className="space-y-2">
                {day.meals.map((meal) => (
                  <div key={meal.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getMealTypeIcon(meal.type)}</span>
                        <div>
                          <h5 className="font-medium text-gray-800 dark:text-white">{meal.name}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {meal.time} • {meal.servings} porções
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeMeal(day.date, meal.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remover
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {meal.prepTime} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {meal.servings} pessoas
                      </div>
                      <div
                        className={`flex items-center gap-1 ${getDifficultyColor(meal.difficulty)}`}
                      >
                        <ChefHat className="w-3 h-3" />
                        {meal.difficulty === 'easy'
                          ? 'Fácil'
                          : meal.difficulty === 'medium'
                            ? 'Médio'
                            : 'Difícil'}
                      </div>
                    </div>

                    {meal.ingredients.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Ingredientes:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {meal.ingredients.slice(0, 3).map((ingredient, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 rounded-full text-xs ${getMealTypeColor(meal.type)}`}
                            >
                              {ingredient}
                            </span>
                          ))}
                          {meal.ingredients.length > 3 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              +{meal.ingredients.length - 3} mais
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal para adicionar refeição */}
      {showAddMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Adicionar Refeição
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome da refeição
                </label>
                <input
                  type="text"
                  value={newMeal.name || ''}
                  onChange={(e) => setNewMeal((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ex: Macarrão com frango"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Horário
                  </label>
                  <input
                    type="time"
                    value={newMeal.time || ''}
                    onChange={(e) => setNewMeal((prev) => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo
                  </label>
                  <select
                    value={newMeal.type || 'breakfast'}
                    onChange={(e) =>
                      setNewMeal((prev) => ({ ...prev, type: e.target.value as any }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="breakfast">Café da manhã</option>
                    <option value="lunch">Almoço</option>
                    <option value="dinner">Jantar</option>
                    <option value="snack">Lanche</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tempo de preparo (min)
                  </label>
                  <input
                    type="number"
                    value={newMeal.prepTime || 15}
                    onChange={(e) =>
                      setNewMeal((prev) => ({ ...prev, prepTime: Number(e.target.value) }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Porções
                  </label>
                  <input
                    type="number"
                    value={newMeal.servings || 4}
                    onChange={(e) =>
                      setNewMeal((prev) => ({ ...prev, servings: Number(e.target.value) }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ingredientes (separados por vírgula)
                </label>
                <input
                  type="text"
                  value={newMeal.ingredients?.join(', ') || ''}
                  onChange={(e) =>
                    setNewMeal((prev) => ({
                      ...prev,
                      ingredients: e.target.value
                        .split(',')
                        .map((i) => i.trim())
                        .filter((i) => i),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ex: macarrão, frango, molho de tomate"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddMeal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={addMeal}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
