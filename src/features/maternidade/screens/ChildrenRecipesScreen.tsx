import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, ChefHat, Star, Check, AlertCircle } from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  description: string;
  ageRange: string;
  prepTime: string;
  servings: number;
  difficulty: 'easy' | 'medium';
  mainIngredients: string[];
  ingredients: string[];
  steps: string[];
  nutritionTips: string[];
  allergyWarnings: string[];
}

export const ChildrenRecipesScreen: React.FC = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  const recipes: Recipe[] = [
    {
      id: '1',
      title: 'Omelete Nutritiva de Legumes',
      description: 'Refeição completa e colorida para o bebê',
      ageRange: '8+ meses',
      prepTime: '15 min',
      servings: 2,
      difficulty: 'easy',
      mainIngredients: ['Ovos', 'Cenoura', 'Batata'],
      ingredients: [
        '2 ovos',
        '1/4 xícara de cenoura ralada',
        '1/4 xícara de batata cozida amassada',
        '2 colheres de leite',
        '1 pitada de sal (opcional)',
      ],
      steps: [
        'Cozinhe a batata e a cenoura até ficarem macias',
        'Bata os ovos com o leite',
        'Adicione os legumes cozidos e amassados',
        'Despeje em frigideira antiaderente untada',
        'Cozinhe em fogo baixo até firmar',
        'Vire e doure o outro lado',
        'Corte em pedaços pequenos para o bebê',
      ],
      nutritionTips: [
        'Rico em proteínas e vitamina A',
        'Ótima opção para o almoço',
        'Pode congelar porções',
      ],
      allergyWarnings: ['Ovos', 'Leite'],
    },
    {
      id: '2',
      title: 'Purê Cremoso de Batata e Cenoura',
      description: 'Acompanhamento suave e nutritivo',
      ageRange: '6+ meses',
      prepTime: '20 min',
      servings: 3,
      difficulty: 'easy',
      mainIngredients: ['Batata', 'Cenoura', 'Leite'],
      ingredients: [
        '2 batatas médias',
        '1 cenoura grande',
        '1/4 xícara de leite',
        '1 colher de chá de manteiga (opcional)',
      ],
      steps: [
        'Descasque e corte batatas e cenouras em cubos',
        'Cozinhe em água até ficarem muito macias',
        'Escorra e amasse bem',
        'Adicione o leite aquecido aos poucos',
        'Mexa até ficar cremoso',
        'Adicione manteiga se desejar',
        'Sirva morno',
      ],
      nutritionTips: ['Rico em vitaminas e fibras', 'Boa fonte de energia', 'Ajuda na digestão'],
      allergyWarnings: ['Leite'],
    },
    {
      id: '3',
      title: 'Mingau de Leite com Ovo',
      description: 'Café da manhã nutritivo e cremoso',
      ageRange: '8+ meses',
      prepTime: '10 min',
      servings: 1,
      difficulty: 'easy',
      mainIngredients: ['Leite', 'Ovo', 'Aveia'],
      ingredients: [
        '1 xícara de leite',
        '1 gema de ovo',
        '2 colheres de aveia em flocos',
        '1 pitada de canela (opcional)',
      ],
      steps: [
        'Aqueça o leite em fogo baixo',
        'Adicione a aveia e mexa',
        'Cozinhe por 5 minutos mexendo sempre',
        'Desligue o fogo',
        'Adicione a gema crua e mexa rapidamente',
        'O calor residual cozinha a gema',
        'Sirva morno',
      ],
      nutritionTips: [
        'Excelente fonte de proteínas',
        'Rico em cálcio e ferro',
        'Energia para o dia',
      ],
      allergyWarnings: ['Leite', 'Ovos', 'Aveia (glúten)'],
    },
    {
      id: '4',
      title: 'Panqueca de Batata Doce',
      description: 'Lanche saudável e gostoso',
      ageRange: '10+ meses',
      prepTime: '20 min',
      servings: 4,
      difficulty: 'medium',
      mainIngredients: ['Batata', 'Ovos', 'Leite'],
      ingredients: [
        '1 batata doce média cozida',
        '1 ovo',
        '2 colheres de leite',
        '3 colheres de farinha de aveia',
        'Canela a gosto',
      ],
      steps: [
        'Amasse a batata doce cozida',
        'Adicione o ovo e o leite',
        'Misture bem',
        'Adicione a farinha aos poucos',
        'Tempere com canela',
        'Despeje pequenas porções na frigideira',
        'Doure dos dois lados',
      ],
      nutritionTips: [
        'Rica em betacaroteno',
        'Fonte de carboidratos complexos',
        'Naturalmente adocicada',
      ],
      allergyWarnings: ['Ovos', 'Leite', 'Aveia (glúten)'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-b-3xl shadow-lg p-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <ChefHat className="w-6 h-6 text-white" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Receitas Infantis</h1>
          </div>
          <p className="text-orange-100 text-sm">
            Preparos saudáveis com ovos, leite, batata e cenoura
          </p>
        </motion.div>
      </div>

      {/* Recipes List */}
      <div className="px-6 space-y-4">
        {recipes.map((recipe, index) => {
          const isExpanded = selectedRecipe === recipe.id;

          return (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => setSelectedRecipe(isExpanded ? null : recipe.id)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0 text-3xl">
                    🍳
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{recipe.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="flex items-center gap-1 text-orange-600">
                        <Clock className="w-3 h-3" />
                        {recipe.prepTime}
                      </span>
                      <span className="flex items-center gap-1 text-orange-600">
                        <Users className="w-3 h-3" />
                        {recipe.servings} porções
                      </span>
                      <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded-full">
                        {recipe.ageRange}
                      </span>
                    </div>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t border-gray-100 p-4 space-y-4"
                >
                  {/* Ingredients */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Ingredientes</h4>
                    <ul className="space-y-1">
                      {recipe.ingredients.map((ing, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-gray-700">
                          <span className="text-orange-500">•</span>
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Steps */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Modo de Preparo</h4>
                    <ol className="space-y-2">
                      {recipe.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-gray-700">
                          <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Nutrition Tips */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4 text-orange-500" />
                      Dicas Nutricionais
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {recipe.nutritionTips.map((tip, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                        >
                          ✓ {tip}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Allergy Warnings */}
                  {recipe.allergyWarnings.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <h4 className="font-semibold text-red-800 mb-2 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Atenção - Alergênicos
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {recipe.allergyWarnings.map((allergen, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium"
                          >
                            {allergen}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    Preparei Esta Receita
                  </button>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
