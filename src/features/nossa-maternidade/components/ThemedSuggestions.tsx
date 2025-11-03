/**
 * Themed Suggestions Screen
 * Recipes, activities, sleep stories, tantrum tips
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChefHat,
  Baby,
  Moon,
  AlertCircle,
  Clock,
  Play,
  CheckCircle,
  ChevronRight,
} from 'lucide-react';

type TabType = 'activities' | 'recipes' | 'stories' | 'tantrums';

const TABS = [
  { id: 'activities', label: 'Brincadeiras', icon: Baby },
  { id: 'recipes', label: 'Receitas', icon: ChefHat },
  { id: 'stories', label: 'Histórias', icon: Moon },
  { id: 'tantrums', label: 'Birras', icon: AlertCircle },
] as const;

const SENSORY_ACTIVITIES = [
  {
    id: '1',
    title: 'Caixa de texturas',
    description: 'Explore diferentes tecidos e superfícies',
    age: '6-12 meses',
    materials: ['Tecidos variados', 'Caixa de papelão', 'Fitas coloridas'],
    steps: [
      'Corte uma abertura lateral na caixa',
      'Cole diferentes tecidos nas paredes internas',
      'Deixe o bebê explorar com as mãos',
      'Nomeie as texturas: macio, áspero, liso',
    ],
    benefits: ['Desenvolvimento tátil', 'Vocabulário', 'Coordenação motora'],
  },
  {
    id: '2',
    title: 'Garrafas sensoriais',
    description: 'Garrafas coloridas que acalmam e entretêm',
    age: '3-12 meses',
    materials: [
      'Garrafas plásticas transparentes',
      'Água',
      'Corante alimentício',
      'Glitter',
      'Cola quente',
    ],
    steps: [
      'Encha a garrafa com água até 3/4',
      'Adicione corante e glitter',
      'Feche bem e cole a tampa com cola quente',
      'Deixe o bebê observar e balançar',
    ],
    benefits: ['Atenção visual', 'Calma', 'Coordenação'],
  },
];

const RECIPES = [
  {
    id: '1',
    title: 'Omelete nutritivo',
    ingredients: ['1 ovo', '1 colher de leite', 'Azeite', 'Cenoura ralada'],
    steps: [
      'Bata o ovo com o leite',
      'Adicione a cenoura ralada',
      'Aqueça o azeite em fogo baixo',
      'Despeje a mistura e cozinhe por 3 minutos de cada lado',
    ],
    prepTime: 10,
    age: '8+ meses',
    tips: 'Corte em pequenos pedaços para BLW',
  },
  {
    id: '2',
    title: 'Purê de batata com cenoura',
    ingredients: ['1 batata média', '1 cenoura', 'Leite materno ou fórmula', 'Azeite'],
    steps: [
      'Cozinhe a batata e cenoura até ficarem macias',
      'Amasse com um garfo',
      'Adicione um pouco de leite para a consistência desejada',
      'Finalize com um fio de azeite',
    ],
    prepTime: 15,
    age: '6+ meses',
    tips: 'Pode congelar em porções individuais',
  },
];

const SLEEP_STORIES = [
  {
    id: '1',
    title: 'A nuvem macia',
    duration: 5,
    preview: 'Era uma vez uma nuvenzinha bem macia que viajava pelo céu...',
    hasAudio: true,
  },
  {
    id: '2',
    title: 'O jardim dos sonhos',
    duration: 7,
    preview: 'No jardim dos sonhos, todas as flores cantavam baixinho...',
    hasAudio: true,
  },
];

const TANTRUM_TIPS = [
  {
    id: '1',
    situation: 'Criança chorando porque quer algo que não pode ter',
    empathy:
      'Eu sei que você está chateado porque queria isso. É difícil quando não podemos ter algo que queremos.',
    actions: [
      'Abaixe-se na altura da criança',
      'Valide o sentimento sem ceder',
      'Ofereça alternativas: "Você pode escolher entre X ou Y"',
      'Mantenha a calma e seja firme com carinho',
    ],
    prevention: [
      'Antecipe situações difíceis',
      'Evite ida ao mercado quando a criança está cansada',
      'Estabeleça limites claros antes de sair',
    ],
  },
  {
    id: '2',
    situation: 'Birra na hora de dormir',
    empathy:
      'Você não quer ir para a cama ainda, né? Eu entendo que você queria continuar brincando.',
    actions: [
      'Mantenha uma rotina previsível',
      'Avise 10 minutos antes: "Em breve será hora de dormir"',
      'Ofereça escolhas: "Quer escolher qual pijama vestir?"',
      'Seja gentil mas firme',
    ],
    prevention: [
      'Rotina de sono consistente',
      'Evite telas 1h antes de dormir',
      'Crie um ritual relaxante (banho, história, música)',
    ],
  },
];

export function ThemedSuggestions() {
  const [activeTab, setActiveTab] = useState<TabType>('activities');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'activities':
        return (
          <div className="space-y-4">
            {SENSORY_ACTIVITIES.map((activity, idx) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-1">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-neutral-600 mb-2">{activity.description}</p>
                    <span className="inline-block px-3 py-1 bg-accent-100 text-accent-700 text-xs rounded-full">
                      {activity.age}
                    </span>
                  </div>
                  <Baby className="w-8 h-8 text-accent-600 flex-shrink-0" />
                </div>

                <button
                  onClick={() => setExpandedItem(expandedItem === activity.id ? null : activity.id)}
                  className="w-full flex items-center justify-between px-4 py-2 bg-neutral-100 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-200 transition-colors"
                >
                  <span>Ver passo a passo</span>
                  <ChevronRight
                    className={`w-5 h-5 transition-transform ${
                      expandedItem === activity.id ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {expandedItem === activity.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-neutral-800 mb-2">
                            Materiais necessários:
                          </h4>
                          <ul className="space-y-1">
                            {activity.materials.map((material, idx) => (
                              <li
                                key={idx}
                                className="flex items-center gap-2 text-sm text-neutral-700"
                              >
                                <CheckCircle className="w-4 h-4 text-success-500" />
                                {material}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-neutral-800 mb-2">
                            Como fazer:
                          </h4>
                          <ol className="space-y-2">
                            {activity.steps.map((step, idx) => (
                              <li key={idx} className="flex gap-2 text-sm text-neutral-700">
                                <span className="flex-shrink-0 w-6 h-6 bg-accent-100 text-accent-700 rounded-full flex items-center justify-center text-xs font-semibold">
                                  {idx + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-neutral-800 mb-2">
                            Benefícios:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {activity.benefits.map((benefit, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-success-100 text-success-700 text-xs rounded-full"
                              >
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        );

      case 'recipes':
        return (
          <div className="space-y-4">
            {RECIPES.map((recipe, idx) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-1">{recipe.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-neutral-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {recipe.prepTime} min
                      </span>
                      <span className="px-2 py-1 bg-accent-100 text-accent-700 text-xs rounded-full">
                        {recipe.age}
                      </span>
                    </div>
                  </div>
                  <ChefHat className="w-8 h-8 text-accent-600 flex-shrink-0" />
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-800 mb-2">Ingredientes:</h4>
                    <ul className="space-y-1">
                      {recipe.ingredients.map((ingredient, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-neutral-700">
                          <CheckCircle className="w-4 h-4 text-success-500" />
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-neutral-800 mb-2">
                      Modo de preparo:
                    </h4>
                    <ol className="space-y-2">
                      {recipe.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-neutral-700">
                          <span className="flex-shrink-0 w-6 h-6 bg-accent-100 text-accent-700 rounded-full flex items-center justify-center text-xs font-semibold">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {recipe.tips && (
                    <div className="bg-warning-50 border border-warning-200 rounded-2xl p-3">
                      <p className="text-sm text-warning-800">
                        <strong>💡 Dica:</strong> {recipe.tips}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'stories':
        return (
          <div className="space-y-4">
            {SLEEP_STORIES.map((story, idx) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-secondary-500 to-primary-500 text-white rounded-3xl p-6 shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{story.title}</h3>
                    <p className="text-white/90 text-sm mb-3">{story.preview}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{story.duration} minutos</span>
                    </div>
                  </div>
                  <Moon className="w-8 h-8 flex-shrink-0 ml-3" />
                </div>

                {story.hasAudio && (
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/20 backdrop-blur rounded-2xl font-medium hover:bg-white/30 transition-colors">
                    <Play className="w-5 h-5" />
                    Ouvir história
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        );

      case 'tantrums':
        return (
          <div className="space-y-4">
            {TANTRUM_TIPS.map((tip, idx) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-lg"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-error-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-error-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">{tip.situation}</h3>
                    <div className="bg-primary-50 border border-primary-200 rounded-2xl p-3 mb-4">
                      <p className="text-sm text-primary-900">
                        <strong>💜 Resposta empática:</strong>
                        <br />"{tip.empathy}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-800 mb-2">O que fazer:</h4>
                    <ol className="space-y-2">
                      {tip.actions.map((action, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-neutral-700">
                          <span className="flex-shrink-0 w-6 h-6 bg-success-100 text-success-700 rounded-full flex items-center justify-center text-xs font-semibold">
                            {idx + 1}
                          </span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-neutral-800 mb-2">Como prevenir:</h4>
                    <ul className="space-y-2">
                      {tip.prevention.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-neutral-700">
                          <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 pb-24">
      {/* Header with tabs */}
      <div className="bg-white rounded-b-3xl shadow-lg p-6 mb-6 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-neutral-800 mb-4">Sugestões para você</h1>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-6">{renderContent()}</div>
    </div>
  );
}
