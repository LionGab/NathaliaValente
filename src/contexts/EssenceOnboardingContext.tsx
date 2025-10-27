/**
 * Nossa Maternidade - Contexto do Onboarding "Essência"
 * Gerencia o estado emocional e a jornada de descoberta da identidade feminina
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    OnboardingData,
    EmotionalState,
    CurrentDesire,
    FeminineArchetype,
    OnboardingStep
} from '../types/essence-onboarding';

interface EssenceOnboardingContextType {
    // Estado do onboarding
    onboardingData: OnboardingData;
    currentStep: number;
    isOnboardingComplete: boolean;
    isOnboardingActive: boolean;

    // Ações
    setEmotionalState: (state: EmotionalState) => void;
    setCurrentDesire: (desire: CurrentDesire) => void;
    setSelectedArchetype: (archetype: FeminineArchetype) => void;
    nextStep: () => void;
    previousStep: () => void;
    completeOnboarding: () => void;
    startOnboarding: () => void;
    skipOnboarding: () => void;

    // Dados do progresso
    steps: OnboardingStep[];
    getPersonalizedMessage: () => string;
    getPersonalizedRitual: () => string;
}

const EssenceOnboardingContext = createContext<EssenceOnboardingContextType | undefined>(undefined);

const STORAGE_KEY = 'clubnath_essence_onboarding';

const initialOnboardingData: OnboardingData = {
    emotionalState: null,
    currentDesire: null,
    selectedArchetype: null,
    completedAt: null
};

const initialSteps: OnboardingStep[] = [
    { step: 1, title: 'Conexão Pessoal', subtitle: 'Como você está se sentindo?', isCompleted: false },
    { step: 2, title: 'Identidade', subtitle: 'Qual sua essência?', isCompleted: false },
    { step: 3, title: 'Boas-Vindas', subtitle: 'Seu espaço personalizado', isCompleted: false }
];

export const EssenceOnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [onboardingData, setOnboardingData] = useState<OnboardingData>(initialOnboardingData);
    const [currentStep, setCurrentStep] = useState(1);
    const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
    const [isOnboardingActive, setIsOnboardingActive] = useState(false);
    const [steps, setSteps] = useState<OnboardingStep[]>(initialSteps);

    // Carregar dados salvos
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setOnboardingData(parsed);
                setIsOnboardingComplete(!!parsed.completedAt);
                setIsOnboardingActive(!parsed.completedAt);
            } catch (error) {
                console.error('Erro ao carregar dados do onboarding:', error);
            }
        } else {
            // Se não há dados salvos, iniciar onboarding
            setIsOnboardingActive(true);
        }
    }, []);

    // Salvar dados automaticamente
    useEffect(() => {
        if (onboardingData !== initialOnboardingData) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(onboardingData));
        }
    }, [onboardingData]);

    const setEmotionalState = useCallback((state: EmotionalState) => {
        setOnboardingData(prev => ({ ...prev, emotionalState: state }));
        setSteps(prev => prev.map(step =>
            step.step === 1 ? { ...step, isCompleted: true } : step
        ));
    }, []);

    const setCurrentDesire = useCallback((desire: CurrentDesire) => {
        setOnboardingData(prev => ({ ...prev, currentDesire: desire }));
        setSteps(prev => prev.map(step =>
            step.step === 1 ? { ...step, isCompleted: true } : step
        ));
    }, []);

    const setSelectedArchetype = useCallback((archetype: FeminineArchetype) => {
        setOnboardingData(prev => ({ ...prev, selectedArchetype: archetype }));
        setSteps(prev => prev.map(step =>
            step.step === 2 ? { ...step, isCompleted: true } : step
        ));
    }, []);

    const nextStep = useCallback(() => {
        setCurrentStep(prev => {
            const newStep = Math.min(prev + 1, 4);
            console.log('Onboarding nextStep:', { from: prev, to: newStep });
            return newStep;
        });
    }, []);

    const previousStep = useCallback(() => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    }, []);

    const completeOnboarding = useCallback(() => {
        setOnboardingData(prev => ({
            ...prev,
            completedAt: new Date().toISOString()
        }));
        setIsOnboardingComplete(true);
        setIsOnboardingActive(false);
        setSteps(prev => prev.map(step => ({ ...step, isCompleted: true })));
    }, []);

    const startOnboarding = useCallback(() => {
        setIsOnboardingActive(true);
        setCurrentStep(1);
        setOnboardingData(initialOnboardingData);
        setSteps(initialSteps);
    }, []);

    const skipOnboarding = useCallback(() => {
        setIsOnboardingActive(false);
        setIsOnboardingComplete(true);
        setOnboardingData(prev => ({
            ...prev,
            completedAt: new Date().toISOString()
        }));
    }, []);

    const getPersonalizedMessage = useCallback(() => {
        if (!onboardingData.selectedArchetype) {
            return "Bem-vinda à Nossa Maternidade, querida.";
        }

        const messages = {
            guerreira: "Você não precisa ser forte o tempo todo. Aqui, a força materna é construída em silêncio, com amor e propósito. Vamos começar.",
            resiliente: "Sua capacidade de transformar cada desafio em sabedoria materna é sua maior força. Aqui, honramos sua jornada.",
            visionaria: "Sua visão pode transformar o futuro dos seus filhos. Aqui, damos vida aos seus sonhos de família.",
            cuidadora: "O amor que você oferece à sua família é sagrado. Aqui, cuidamos de quem cuida com tanto amor."
        };

        return messages[onboardingData.selectedArchetype];
    }, [onboardingData.selectedArchetype]);

    const getPersonalizedRitual = useCallback(() => {
        if (!onboardingData.selectedArchetype) {
            return "Ritual de Conexão Materna";
        }

        const rituals = {
            guerreira: "Ritual da Mãe Guerreira",
            resiliente: "Ritual da Transformação Materna",
            visionaria: "Ritual da Visão de Futuro",
            cuidadora: "Ritual do Cuidado Sagrado"
        };

        return rituals[onboardingData.selectedArchetype];
    }, [onboardingData.selectedArchetype]);

    const value: EssenceOnboardingContextType = {
        onboardingData,
        currentStep,
        isOnboardingComplete,
        isOnboardingActive,
        setEmotionalState,
        setCurrentDesire,
        setSelectedArchetype,
        nextStep,
        previousStep,
        completeOnboarding,
        startOnboarding,
        skipOnboarding,
        steps,
        getPersonalizedMessage,
        getPersonalizedRitual
    };

    return (
        <EssenceOnboardingContext.Provider value={value}>
            {children}
        </EssenceOnboardingContext.Provider>
    );
};

export const useEssenceOnboarding = () => {
    const context = useContext(EssenceOnboardingContext);
    if (context === undefined) {
        throw new Error('useEssenceOnboarding must be used within an EssenceOnboardingProvider');
    }
    return context;
};
