/**
 * Nossa Maternidade - Tipos para o Sistema de Onboarding "Essência"
 * Sistema emocional de conexão pessoal e identidade feminina
 */

export type EmotionalState = 'calma' | 'perdida' | 'cansada' | 'esperançosa';

export type CurrentDesire = 'descanso' | 'clareza' | 'fe' | 'forca' | 'recomeco';

export type FeminineArchetype = 'guerreira' | 'resiliente' | 'visionaria' | 'cuidadora';

export interface EmotionalStateOption {
    id: EmotionalState;
    label: string;
    icon: string;
    description: string;
    color: string;
}

export interface DesireOption {
    id: CurrentDesire;
    label: string;
    icon: string;
    description: string;
    color: string;
}

export interface ArchetypeOption {
    id: FeminineArchetype;
    label: string;
    description: string;
    audioIntro: string;
    color: string;
    traits: string[];
}

export interface OnboardingData {
    emotionalState: EmotionalState | null;
    currentDesire: CurrentDesire | null;
    selectedArchetype: FeminineArchetype | null;
    completedAt: string | null;
}

export interface OnboardingStep {
    step: number;
    title: string;
    subtitle?: string;
    isCompleted: boolean;
}

export const EMOTIONAL_STATES: EmotionalStateOption[] = [
    {
        id: 'calma',
        label: 'Serena',
        icon: '🌿',
        description: 'Encontrando paz na maternidade',
        color: 'from-green-50 to-emerald-50'
    },
    {
        id: 'perdida',
        label: 'Sobrecarregada',
        icon: '🌫️',
        description: 'Precisando de apoio e orientação',
        color: 'from-gray-50 to-slate-50'
    },
    {
        id: 'cansada',
        label: 'Exausta',
        icon: '🔥',
        description: 'Sensação de esgotamento materno',
        color: 'from-orange-50 to-red-50'
    },
    {
        id: 'esperançosa',
        label: 'Inspirada',
        icon: '🌤️',
        description: 'Cheia de amor e possibilidades',
        color: 'from-blue-50 to-cyan-50'
    }
];

export const DESIRE_OPTIONS: DesireOption[] = [
    {
        id: 'descanso',
        label: 'Descanso',
        icon: '🌙',
        description: 'Precisa de um momento só para você',
        color: 'from-indigo-50 to-purple-50'
    },
    {
        id: 'clareza',
        label: 'Orientação',
        icon: '☀️',
        description: 'Busca dicas e conselhos maternais',
        color: 'from-yellow-50 to-orange-50'
    },
    {
        id: 'fe',
        label: 'Fé',
        icon: '✝️',
        description: 'Conecta-se com Deus na maternidade',
        color: 'from-purple-50 to-pink-50'
    },
    {
        id: 'forca',
        label: 'Força',
        icon: '💪',
        description: 'Encontra coragem para os desafios',
        color: 'from-red-50 to-rose-50'
    },
    {
        id: 'recomeco',
        label: 'Renovação',
        icon: '🌸',
        description: 'Abre-se para uma nova fase',
        color: 'from-pink-50 to-rose-50'
    }
];

export const FEMININE_ARCHETYPES: ArchetypeOption[] = [
    {
        id: 'guerreira',
        label: 'Mãe Guerreira',
        description: 'Luta pelos seus filhos com coragem, mesmo quando se sente frágil.',
        audioIntro: 'Você escolheu a Mãe Guerreira. Aqui, aprenderemos a lutar com amor, sem perder a ternura.',
        color: 'from-red-50 to-rose-50',
        traits: ['Proteção', 'Coragem', 'Determinação', 'Liderança']
    },
    {
        id: 'resiliente',
        label: 'Mãe Resiliente',
        description: 'Transforma cada desafio em aprendizado e cada lágrima em força.',
        audioIntro: 'Você escolheu a Mãe Resiliente. Aqui, descobriremos como transformar dificuldades em sabedoria materna.',
        color: 'from-purple-50 to-violet-50',
        traits: ['Cura', 'Transformação', 'Compaixão', 'Sabedoria']
    },
    {
        id: 'visionaria',
        label: 'Mãe Visionária',
        description: 'Vê o potencial em cada filho e constrói um futuro melhor.',
        audioIntro: 'Você escolheu a Mãe Visionária. Aqui, criaremos novos caminhos para sua família.',
        color: 'from-blue-50 to-cyan-50',
        traits: ['Visão', 'Criatividade', 'Inspiração', 'Futuro']
    },
    {
        id: 'cuidadora',
        label: 'Mãe Cuidadora',
        description: 'Nutre com amor, protege com fé e constrói um lar sagrado.',
        audioIntro: 'Você escolheu a Mãe Cuidadora. Aqui, nutrimos o que é mais precioso: sua família.',
        color: 'from-green-50 to-emerald-50',
        traits: ['Cuidado', 'Nutrição', 'Proteção', 'Amor']
    }
];
