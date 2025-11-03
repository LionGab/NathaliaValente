export interface NathTip {
  id: string;
  title: string;
  summary: string;
  category: TipCategory;
  stage: PregnancyStage[];
  content: string;
  faq: FAQItem[];
  practicalTips: string[];
  testimonial?: string;
  author: string;
  readTime: number; // em minutos
  isPremium: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export type TipCategory =
  | 'primeiros-cuidados'
  | 'amamentacao'
  | 'pos-parto'
  | 'saude-mental'
  | 'direitos-mulher'
  | 'comunidade-apoio'
  | 'desenvolvimento-bebe'
  | 'alimentacao'
  | 'sono'
  | 'seguranca';

export type PregnancyStage =
  | 'gravidez'
  | 'puerperio'
  | 'primeiros-meses'
  | 'primeiro-ano'
  | 'toddler';

export const tipCategories = {
  'primeiros-cuidados': {
    name: 'Primeiros Cuidados',
    icon: '👶',
    color: 'from-blue-50 to-cyan-100',
    description: 'Cuidados essenciais nos primeiros dias de vida',
  },
  amamentacao: {
    name: 'Amamentação',
    icon: '🤱',
    color: 'from-pink-50 to-rose-100',
    description: 'Tudo sobre amamentação e alimentação do bebê',
  },
  'pos-parto': {
    name: 'Pós-Parto',
    icon: '💕',
    color: 'from-purple-50 to-violet-100',
    description: 'Cuidados e recuperação no período pós-parto',
  },
  'saude-mental': {
    name: 'Saúde Mental',
    icon: '🧠',
    color: 'from-green-50 to-emerald-100',
    description: 'Bem-estar emocional e mental da mãe',
  },
  'direitos-mulher': {
    name: 'Direitos da Mulher',
    icon: '⚖️',
    color: 'from-orange-50 to-amber-100',
    description: 'Direitos trabalhistas e orientações legais',
  },
  'comunidade-apoio': {
    name: 'Comunidade e Apoio',
    icon: '👥',
    color: 'from-indigo-50 to-blue-100',
    description: 'Rede de apoio e conexões maternas',
  },
  'desenvolvimento-bebe': {
    name: 'Desenvolvimento',
    icon: '🌟',
    color: 'from-yellow-50 to-orange-100',
    description: 'Marcos do desenvolvimento infantil',
  },
  alimentacao: {
    name: 'Alimentação',
    icon: '🍎',
    color: 'from-red-50 to-pink-100',
    description: 'Introdução alimentar e nutrição',
  },
  sono: {
    name: 'Sono',
    icon: '😴',
    color: 'from-slate-50 to-gray-100',
    description: 'Rotinas de sono e descanso',
  },
  seguranca: {
    name: 'Segurança',
    icon: '🛡️',
    color: 'from-teal-50 to-cyan-100',
    description: 'Segurança do bebê em casa e fora',
  },
};

export const pregnancyStages = {
  gravidez: {
    name: 'Gravidez',
    icon: '🤰',
    description: 'Durante a gestação',
  },
  puerperio: {
    name: 'Puerpério',
    icon: '👶',
    description: 'Primeiras 6 semanas após o parto',
  },
  'primeiros-meses': {
    name: 'Primeiros Meses',
    icon: '🍼',
    description: '3-6 meses de vida',
  },
  'primeiro-ano': {
    name: 'Primeiro Ano',
    icon: '🎂',
    description: '6-12 meses de vida',
  },
  toddler: {
    name: 'Toddler',
    icon: '🚶',
    description: '1-3 anos de idade',
  },
};

// Dados das dicas da Nath
export const nathTips: NathTip[] = [
  {
    id: 'primeiros-cuidados-1',
    title: 'Primeiros Cuidados com o Recém-Nascido',
    summary: 'Tudo que você precisa saber para cuidar do seu bebê nos primeiros dias em casa.',
    category: 'primeiros-cuidados',
    stage: ['puerperio', 'primeiros-meses'],
    content: `Cuidar de um recém-nascido pode parecer assustador no início, mas com as informações certas, você se sentirá mais confiante. Aqui estão os cuidados essenciais:

**Banho do Bebê:**
- Use água morna (37°C)
- Banhe 2-3 vezes por semana nos primeiros meses
- Use produtos específicos para bebês
- Mantenha o ambiente aquecido

**Cuidados com o Cordão Umbilical:**
- Mantenha limpo e seco
- Use álcool 70% se recomendado pelo pediatra
- Não cubra com fraldas
- Procure sinais de infecção

**Troca de Fraldas:**
- Troque a cada 2-3 horas ou quando necessário
- Limpe delicadamente com água morna
- Use creme para assaduras se necessário
- Observe a cor e consistência das fezes

**Roupas:**
- Use tecidos macios e respiráveis
- Evite roupas com botões ou zíperes
- Mantenha o bebê confortável, não muito quente
- Lave as roupas com sabão neutro`,
    faq: [
      {
        question: 'Com que frequência devo trocar a fralda?',
        answer:
          'Troque a cada 2-3 horas ou sempre que estiver molhada ou suja. Recém-nascidos fazem cocô várias vezes ao dia.',
      },
      {
        question: 'Posso dar banho todos os dias?',
        answer:
          'Nos primeiros meses, 2-3 banhos por semana são suficientes. Banhos diários podem ressecar a pele sensível do bebê.',
      },
      {
        question: 'O que fazer se o cordão umbilical sangrar?',
        answer:
          'Um pequeno sangramento é normal. Se persistir ou aumentar, procure o pediatra imediatamente.',
      },
    ],
    practicalTips: [
      'Tenha todos os itens necessários organizados antes do banho',
      'Teste a temperatura da água com o cotovelo',
      'Mantenha uma rotina consistente para o bebê',
      'Não tenha medo de pedir ajuda quando precisar',
      'Confie nos seus instintos maternais',
    ],
    testimonial:
      'As dicas da Nath me ajudaram muito nos primeiros dias. Me senti mais preparada e confiante para cuidar do meu bebê! - Maria, mãe de 2 filhos',
    author: 'Nathália Valente',
    readTime: 8,
    isPremium: false,
    tags: ['recém-nascido', 'cuidados básicos', 'primeiros dias'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'amamentacao-1',
    title: 'Amamentação: Guia Completo para Mães',
    summary: 'Dicas práticas e apoio emocional para uma amamentação bem-sucedida e prazerosa.',
    category: 'amamentacao',
    stage: ['puerperio', 'primeiros-meses', 'primeiro-ano'],
    content: `A amamentação é uma jornada única e especial entre mãe e bebê. Aqui estão as informações essenciais:

**Posições Corretas:**
- Posição tradicional: bebê de frente para o peito
- Posição deitada: ideal para descanso
- Posição de rugby: boa para cesárea
- Encontre a posição mais confortável para vocês dois

**Sinais de Fome:**
- Movimentos de sucção
- Agitação e choro
- Mãos na boca
- Procure alimentar antes do choro intenso

**Dificuldades Comuns:**
- Rachaduras: use pomada de lanolina
- Ingurgitamento: massageie e extraia leite
- Mastite: procure ajuda médica
- Bebê não pega: seja paciente e persistente

**Alimentação Adequada:**
- Amamente em livre demanda
- Observe os sinais de saciedade
- Não force horários rígidos
- Confie no seu corpo e no seu bebê`,
    faq: [
      {
        question: 'Como saber se meu bebê está mamando o suficiente?',
        answer:
          'Observe se ele está ganhando peso adequadamente, fazendo cocô e xixi regularmente, e parece satisfeito após as mamadas.',
      },
      {
        question: 'Posso amamentar se estiver doente?',
        answer:
          'Na maioria dos casos, sim. O leite materno transmite anticorpos que protegem o bebê. Consulte seu médico.',
      },
      {
        question: 'E se eu não conseguir amamentar?',
        answer:
          'Cada mãe tem sua jornada. O importante é que o bebê seja alimentado e amado. Não se culpe.',
      },
    ],
    practicalTips: [
      'Beba bastante água durante a amamentação',
      'Alimente-se bem e descanse quando possível',
      'Peça ajuda de profissionais especializados',
      'Não compare sua experiência com outras mães',
      'Celebre cada conquista, por menor que seja',
    ],
    testimonial:
      'Graças às orientações da Nath, consegui superar as dificuldades iniciais e hoje amamento com prazer! - Ana, mãe de primeira viagem',
    author: 'Nathália Valente',
    readTime: 12,
    isPremium: true,
    tags: ['amamentação', 'posições', 'dificuldades', 'apoio'],
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  {
    id: 'saude-mental-1',
    title: 'Cuidando da Sua Saúde Mental na Maternidade',
    summary: 'Estratégias para manter o bem-estar emocional durante a jornada materna.',
    category: 'saude-mental',
    stage: ['gravidez', 'puerperio', 'primeiros-meses', 'primeiro-ano'],
    content: `A maternidade traz muitas emoções e é normal se sentir sobrecarregada às vezes. Aqui estão dicas para cuidar da sua saúde mental:

**Reconhecendo as Emoções:**
- É normal sentir alegria, medo, ansiedade e cansaço
- Não se culpe por ter sentimentos negativos
- Busque ajuda quando necessário
- Lembre-se: você não está sozinha

**Estratégias de Autocuidado:**
- Reserve momentos para você todos os dias
- Pratique respiração profunda
- Mantenha contato com amigos e família
- Peça ajuda quando precisar

**Sinais de Alerta:**
- Tristeza persistente por mais de 2 semanas
- Perda de interesse em atividades
- Dificuldade para cuidar do bebê
- Pensamentos de machucar a si mesma ou ao bebê

**Recursos de Apoio:**
- Grupos de mães
- Terapia psicológica
- Linha de apoio emocional
- Profissionais especializados`,
    faq: [
      {
        question: 'É normal me sentir triste após o parto?',
        answer:
          'Sim, é comum ter "baby blues" nas primeiras semanas. Se persistir, procure ajuda profissional.',
      },
      {
        question: 'Como posso encontrar tempo para mim?',
        answer:
          'Comece com pequenos momentos: 10 minutos de respiração, um banho relaxante, ou uma conversa com uma amiga.',
      },
      {
        question: 'Quando devo procurar ajuda profissional?',
        answer:
          'Se os sentimentos negativos persistirem por mais de 2 semanas ou interferirem na sua capacidade de cuidar do bebê.',
      },
    ],
    practicalTips: [
      'Conecte-se com outras mães que passam pela mesma fase',
      'Pratique gratidão diariamente',
      'Não se compare com outras mães',
      'Celebre suas pequenas conquistas',
      'Lembre-se: você está fazendo o seu melhor',
    ],
    testimonial:
      'As dicas de saúde mental da Nath me ajudaram a entender que não estou sozinha e que é normal ter altos e baixos. - Carla, mãe de 3 filhos',
    author: 'Nathália Valente',
    readTime: 10,
    isPremium: false,
    tags: ['saúde mental', 'autocuidado', 'bem-estar', 'apoio emocional'],
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25',
  },
  {
    id: 'direitos-mulher-1',
    title: 'Seus Direitos na Maternidade',
    summary: 'Conheça seus direitos trabalhistas e orientações legais durante a maternidade.',
    category: 'direitos-mulher',
    stage: ['gravidez', 'puerperio', 'primeiros-meses'],
    content: `Conhecer seus direitos é fundamental para viver a maternidade com mais tranquilidade:

**Licença Maternidade:**
- 120 dias para mães empregadas
- 180 dias para servidoras públicas
- Início: 28 dias antes do parto
- Estabilidade: 5 meses após o parto

**Licença Paternidade:**
- 5 dias corridos para o pai
- 20 dias para funcionários de empresas do programa Empresa Cidadã
- Pode ser estendida com acordo coletivo

**Amamentação no Trabalho:**
- 2 pausas de 30 minutos por dia
- Até 6 meses de idade do bebê
- Pode ser estendida com acordo coletivo
- Local adequado para amamentar

**Auxílio Maternidade:**
- Salário-maternidade para seguradas
- Auxílio-doença para gestantes
- Benefício assistencial se necessário
- Procure o INSS para informações

**Estabilidade e Proteção:**
- Não pode ser demitida durante a gestação
- Estabilidade até 5 meses após o parto
- Direito a mudança de função se necessário
- Proteção contra discriminação`,
    faq: [
      {
        question: 'Posso ser demitida durante a gravidez?',
        answer:
          'Não, há estabilidade durante a gestação e até 5 meses após o parto. A demissão só é possível por justa causa.',
      },
      {
        question: 'Como solicitar o salário-maternidade?',
        answer:
          'Apresente a certidão de nascimento do bebê no INSS. O benefício é pago automaticamente para seguradas.',
      },
      {
        question: 'Tenho direito a amamentar no trabalho?',
        answer:
          'Sim, você tem direito a 2 pausas de 30 minutos por dia para amamentar até o bebê completar 6 meses.',
      },
    ],
    practicalTips: [
      'Documente tudo relacionado à sua gravidez no trabalho',
      'Conheça os acordos coletivos da sua empresa',
      'Procure o RH para esclarecer dúvidas',
      'Mantenha cópias de todos os documentos',
      'Busque orientação jurídica se necessário',
    ],
    testimonial:
      'Graças às orientações sobre direitos, consegui me organizar melhor no trabalho e viver a maternidade com mais tranquilidade. - Juliana, advogada e mãe',
    author: 'Nathália Valente',
    readTime: 15,
    isPremium: true,
    tags: ['direitos trabalhistas', 'licença maternidade', 'amamentação', 'estabilidade'],
    createdAt: '2024-01-30',
    updatedAt: '2024-01-30',
  },
  {
    id: 'sono-1',
    title: 'Rotina de Sono para Bebês',
    summary: 'Estratégias para estabelecer uma rotina de sono saudável e tranquila.',
    category: 'sono',
    stage: ['puerperio', 'primeiros-meses', 'primeiro-ano'],
    content: `Uma boa rotina de sono é fundamental para o desenvolvimento do bebê e o bem-estar da família:

**Criando a Rotina:**
- Estabeleça horários regulares
- Crie uma rotina antes de dormir
- Mantenha o ambiente calmo e escuro
- Seja consistente todos os dias

**Ambiente Ideal:**
- Quarto escuro e silencioso
- Temperatura confortável (18-22°C)
- Berço seguro e confortável
- Evite estímulos visuais excessivos

**Ritual do Sono:**
- Banho relaxante
- Massagem suave
- Música calma ou ruído branco
- Leitura ou conversa tranquila
- Colocar no berço sonolento, mas acordado

**Dificuldades Comuns:**
- Regressões do sono são normais
- Cada bebê tem seu ritmo
- Seja paciente e persistente
- Procure ajuda se necessário

**Dicas Importantes:**
- Não compare com outros bebês
- Respeite o ritmo do seu filho
- Mantenha a calma durante as noites difíceis
- Lembre-se: é uma fase que passa`,
    faq: [
      {
        question: 'Quantas horas um bebê deve dormir?',
        answer:
          'Recém-nascidos dormem 16-18h por dia. Aos 3 meses, cerca de 15h. Aos 6 meses, 12-14h por dia.',
      },
      {
        question: 'É normal o bebê acordar várias vezes à noite?',
        answer: 'Sim, é normal nos primeiros meses. O sono vai se consolidando gradualmente.',
      },
      {
        question: 'Posso deixar o bebê chorar para dormir?',
        answer:
          'Cada família tem sua abordagem. O importante é ser consistente e respeitar as necessidades do bebê.',
      },
    ],
    practicalTips: [
      'Mantenha um diário do sono para identificar padrões',
      'Crie um ambiente propício ao sono',
      'Seja paciente com as regressões',
      'Peça ajuda do parceiro para revezar as noites',
      'Lembre-se: cada fase é temporária',
    ],
    testimonial:
      'A rotina de sono que aprendi com a Nath transformou nossas noites! Hoje todos dormimos melhor. - Patrícia, mãe de gêmeos',
    author: 'Nathália Valente',
    readTime: 9,
    isPremium: false,
    tags: ['sono', 'rotina', 'bebê', 'descanso'],
    createdAt: '2024-02-05',
    updatedAt: '2024-02-05',
  },
];

export const getTipsByCategory = (category: TipCategory) => {
  return nathTips.filter((tip) => tip.category === category);
};

export const getTipsByStage = (stage: PregnancyStage) => {
  return nathTips.filter((tip) => tip.stage.includes(stage));
};

export const getFilteredTips = (
  category?: TipCategory,
  stage?: PregnancyStage,
  search?: string
) => {
  let filtered = nathTips;

  if (category) {
    filtered = filtered.filter((tip) => tip.category === category);
  }

  if (stage) {
    filtered = filtered.filter((tip) => tip.stage.includes(stage));
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (tip) =>
        tip.title.toLowerCase().includes(searchLower) ||
        tip.summary.toLowerCase().includes(searchLower) ||
        tip.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }

  return filtered;
};
