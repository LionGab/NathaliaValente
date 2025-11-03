/**
 * Pre-screening questions for emotional and mental health assessment
 * Used before main app access to establish baseline and provide personalized support
 */

export interface Question {
  id: string;
  text: string;
  type: 'scale' | 'multiple-choice' | 'yes-no' | 'text';
  category: 'emotional' | 'physical' | 'social' | 'routine' | 'screening';
  options?: { value: number | string; label: string }[];
  required: boolean;
}

export const preScreeningQuestions: Question[] = [
  // Emotional State Questions
  {
    id: 'mood-today',
    text: 'Como você se sente hoje?',
    type: 'scale',
    category: 'emotional',
    options: [
      { value: 1, label: '😢 Muito mal' },
      { value: 2, label: '😔 Mal' },
      { value: 3, label: '😐 Neutro' },
      { value: 4, label: '🙂 Bem' },
      { value: 5, label: '😊 Muito bem' },
    ],
    required: true,
  },
  {
    id: 'anxiety-level',
    text: 'Você tem sentido ansiedade ou preocupação excessiva?',
    type: 'scale',
    category: 'emotional',
    options: [
      { value: 0, label: 'Nunca' },
      { value: 1, label: 'Raramente' },
      { value: 2, label: 'Às vezes' },
      { value: 3, label: 'Frequentemente' },
      { value: 4, label: 'Sempre' },
    ],
    required: true,
  },
  {
    id: 'sleep-quality',
    text: 'Como está a qualidade do seu sono?',
    type: 'scale',
    category: 'physical',
    options: [
      { value: 1, label: 'Muito ruim' },
      { value: 2, label: 'Ruim' },
      { value: 3, label: 'Regular' },
      { value: 4, label: 'Bom' },
      { value: 5, label: 'Excelente' },
    ],
    required: true,
  },
  {
    id: 'support-system',
    text: 'Você sente que tem apoio suficiente de família e amigos?',
    type: 'yes-no',
    category: 'social',
    options: [
      { value: 'yes', label: 'Sim' },
      { value: 'partial', label: 'Parcialmente' },
      { value: 'no', label: 'Não' },
    ],
    required: true,
  },
  {
    id: 'overwhelmed',
    text: 'Você tem se sentido sobrecarregada com as responsabilidades?',
    type: 'scale',
    category: 'emotional',
    options: [
      { value: 0, label: 'Nunca' },
      { value: 1, label: 'Raramente' },
      { value: 2, label: 'Às vezes' },
      { value: 3, label: 'Frequentemente' },
      { value: 4, label: 'Sempre' },
    ],
    required: true,
  },
  {
    id: 'energy-level',
    text: 'Como está seu nível de energia?',
    type: 'scale',
    category: 'physical',
    options: [
      { value: 1, label: 'Muito baixo' },
      { value: 2, label: 'Baixo' },
      { value: 3, label: 'Normal' },
      { value: 4, label: 'Alto' },
      { value: 5, label: 'Muito alto' },
    ],
    required: true,
  },
  {
    id: 'self-care',
    text: 'Você tem conseguido reservar tempo para cuidar de si mesma?',
    type: 'yes-no',
    category: 'routine',
    options: [
      { value: 'yes', label: 'Sim, regularmente' },
      { value: 'sometimes', label: 'Às vezes' },
      { value: 'no', label: 'Não' },
    ],
    required: true,
  },
  {
    id: 'happiness-level',
    text: 'Você tem conseguido sentir alegria e prazer nas atividades do dia a dia?',
    type: 'scale',
    category: 'emotional',
    options: [
      { value: 0, label: 'Nunca' },
      { value: 1, label: 'Raramente' },
      { value: 2, label: 'Às vezes' },
      { value: 3, label: 'Frequentemente' },
      { value: 4, label: 'Sempre' },
    ],
    required: true,
  },
  {
    id: 'crying-frequency',
    text: 'Com que frequência você tem chorado recentemente?',
    type: 'multiple-choice',
    category: 'emotional',
    options: [
      { value: 'never', label: 'Nunca' },
      { value: 'rarely', label: 'Raramente' },
      { value: 'sometimes', label: 'Às vezes' },
      { value: 'often', label: 'Frequentemente' },
      { value: 'daily', label: 'Diariamente' },
    ],
    required: true,
  },
  {
    id: 'concentration',
    text: 'Você tem tido dificuldade para se concentrar ou tomar decisões?',
    type: 'yes-no',
    category: 'emotional',
    options: [
      { value: 'no', label: 'Não' },
      { value: 'sometimes', label: 'Às vezes' },
      { value: 'yes', label: 'Sim' },
    ],
    required: true,
  },

  // Postpartum Depression Screening (Edinburgh Scale - Key Questions)
  {
    id: 'epds-1',
    text: 'Você consegue rir e ver o lado divertido das coisas?',
    type: 'scale',
    category: 'screening',
    options: [
      { value: 0, label: 'Tanto quanto antes' },
      { value: 1, label: 'Não tanto agora' },
      { value: 2, label: 'Muito menos agora' },
      { value: 3, label: 'De jeito nenhum' },
    ],
    required: true,
  },
  {
    id: 'epds-2',
    text: 'Você tem pensado no futuro com prazer?',
    type: 'scale',
    category: 'screening',
    options: [
      { value: 0, label: 'Tanto quanto antes' },
      { value: 1, label: 'Não tanto agora' },
      { value: 2, label: 'Muito menos agora' },
      { value: 3, label: 'Praticamente não' },
    ],
    required: true,
  },
  {
    id: 'epds-3',
    text: 'Você tem se culpado sem necessidade quando as coisas dão errado?',
    type: 'scale',
    category: 'screening',
    options: [
      { value: 3, label: 'Sim, na maioria das vezes' },
      { value: 2, label: 'Sim, algumas vezes' },
      { value: 1, label: 'Raramente' },
      { value: 0, label: 'Não, nunca' },
    ],
    required: true,
  },
  {
    id: 'epds-4',
    text: 'Você tem se sentido ansiosa ou preocupada sem uma boa razão?',
    type: 'scale',
    category: 'screening',
    options: [
      { value: 0, label: 'Não, de jeito nenhum' },
      { value: 1, label: 'Raramente' },
      { value: 2, label: 'Sim, às vezes' },
      { value: 3, label: 'Sim, muitas vezes' },
    ],
    required: true,
  },
  {
    id: 'epds-5',
    text: 'Você tem sentido medo ou pânico sem uma boa razão?',
    type: 'scale',
    category: 'screening',
    options: [
      { value: 3, label: 'Sim, muitas vezes' },
      { value: 2, label: 'Sim, às vezes' },
      { value: 1, label: 'Não, raramente' },
      { value: 0, label: 'Não, nunca' },
    ],
    required: true,
  },
];

export const getQuestionsByCategory = (category: Question['category']): Question[] => {
  return preScreeningQuestions.filter((q) => q.category === category);
};

export const calculateEmotionalScore = (answers: Record<string, number | string>): number => {
  const emotionalQuestions = getQuestionsByCategory('emotional');
  let totalScore = 0;
  let maxScore = 0;

  emotionalQuestions.forEach((question) => {
    const answer = answers[question.id];
    if (typeof answer === 'number') {
      totalScore += answer;
      maxScore += 5; // Assuming max score is 5 for scale questions
    }
  });

  return maxScore > 0 ? (totalScore / maxScore) * 10 : 5; // Return 0-10 score
};

export const getScreeningRecommendations = (answers: Record<string, number | string>): string[] => {
  const recommendations: string[] = [];
  const emotionalScore = calculateEmotionalScore(answers);

  if (emotionalScore < 3) {
    recommendations.push(
      'Recomendamos fortemente que você procure apoio profissional.',
      'Converse com seu médico sobre como está se sentindo.'
    );
  } else if (emotionalScore < 5) {
    recommendations.push(
      'Considere buscar apoio adicional de um profissional de saúde.',
      'Compartilhe seus sentimentos com pessoas de confiança.'
    );
  }

  if (answers['support-system'] === 'no') {
    recommendations.push(
      'Busque grupos de apoio para mães na sua comunidade ou online.',
      'Não hesite em pedir ajuda quando necessário.'
    );
  }

  if (answers['self-care'] === 'no' || answers['self-care'] === 'sometimes') {
    recommendations.push(
      'Reserve pequenos momentos do dia para cuidar de você.',
      'Lembre-se: cuidar de si mesma é essencial para cuidar dos outros.'
    );
  }

  return recommendations;
};
