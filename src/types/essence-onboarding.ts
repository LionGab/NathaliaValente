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
        color: 'from-success-50 to-maternity-nature-50'
    },
    {
        id: 'perdida',
        label: 'Sobrecarregada',
        icon: '🌫️',
        description: 'Precisando de apoio e orientação',
        color: 'from-neutral-50 to-neutral-100'
    },
    {
        id: 'cansada',
        label: 'Exausta',
        icon: '🔥',
        description: 'Sensação de esgotamento materno',
        color: 'from-warning-50 to-error-50'
    },
    {
        id: 'esperançosa',
        label: 'Inspirada',
        icon: '🌤️',
        description: 'Cheia de amor e possibilidades',
        color: 'from-accent-50 to-maternity-skin-50'
    }
];

export const DESIRE_OPTIONS: DesireOption[] = [
    {
        id: 'descanso',
        label: 'Descanso',
        icon: '🌙',
        description: 'Precisa de um momento só para você',
        color: 'from-accent-50 to-secondary-50'
    },
    {
        id: 'clareza',
        label: 'Orientação',
        icon: '☀️',
        description: 'Busca dicas e conselhos maternais',
        color: 'from-warning-50 to-maternity-skin-50'
    },
    {
        id: 'fe',
        label: 'Fé',
        icon: '✝️',
        description: 'Conecta-se com Deus na maternidade',
        color: 'from-secondary-50 to-primary-50'
    },
    {
        id: 'forca',
        label: 'Força',
        icon: '💪',
        description: 'Encontra coragem para os desafios',
        color: 'from-error-50 to-primary-100'
    },
    {
        id: 'recomeco',
        label: 'Renovação',
        icon: '🌸',
        description: 'Abre-se para uma nova fase',
        color: 'from-primary-50 to-maternity-baby-100'
    }
];

export const FEMININE_ARCHETYPES: ArchetypeOption[] = [
    {
        id: 'guerreira',
        label: 'Mãe Guerreira',
        description: 'Luta pelos seus filhos com coragem, mesmo quando se sente frágil.',
        audioIntro: 'Você escolheu a Mãe Guerreira. Aqui, aprenderemos a lutar com amor, sem perder a ternura.',
        color: 'from-error-50 to-primary-100',
        traits: ['Proteção', 'Coragem', 'Determinação', 'Liderança']
    },
    {
        id: 'resiliente',
        label: 'Mãe Resiliente',
        description: 'Transforma cada desafio em aprendizado e cada lágrima em força.',
        audioIntro: 'Você escolheu a Mãe Resiliente. Aqui, descobriremos como transformar dificuldades em sabedoria materna.',
        color: 'from-secondary-50 to-maternity-baby-100',
        traits: ['Cura', 'Transformação', 'Compaixão', 'Sabedoria']
    },
    {
        id: 'visionaria',
        label: 'Mãe Visionária',
        description: 'Vê o potencial em cada filho e constrói um futuro melhor.',
        audioIntro: 'Você escolheu a Mãe Visionária. Aqui, criaremos novos caminhos para sua família.',
        color: 'from-accent-50 to-maternity-nature-100',
        traits: ['Visão', 'Criatividade', 'Inspiração', 'Futuro']
    },
    {
        id: 'cuidadora',
        label: 'Mãe Cuidadora',
        description: 'Nutre com amor, protege com fé e constrói um lar sagrado.',
        audioIntro: 'Você escolheu a Mãe Cuidadora. Aqui, nutrimos o que é mais precioso: sua família.',
        color: 'from-success-50 to-maternity-nature-100',
        traits: ['Cuidado', 'Nutrição', 'Proteção', 'Amor']
    }
];
