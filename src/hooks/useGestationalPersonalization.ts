import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface GestationalData {
  trimester: 1 | 2 | 3;
  weeks: number;
  days: number;
  phase: 'early' | 'mid' | 'late';
  personalizedMessage: string;
  recommendedActions: string[];
  healthTips: string[];
  emotionalSupport: string[];
}

export const useGestationalPersonalization = () => {
  const { profile } = useAuth();
  const [gestationalData, setGestationalData] = useState<GestationalData | null>(null);

  useEffect(() => {
    // Simular dados gestacionais baseados no perfil
    const calculateGestationalData = (): GestationalData => {
      // Por enquanto, vamos simular dados baseados em uma gestação de 20 semanas
      const weeks = 20;
      const days = weeks * 7;
      
      let trimester: 1 | 2 | 3;
      let phase: 'early' | 'mid' | 'late';
      
      if (weeks <= 13) {
        trimester = 1;
        phase = weeks <= 6 ? 'early' : weeks <= 10 ? 'mid' : 'late';
      } else if (weeks <= 26) {
        trimester = 2;
        phase = weeks <= 18 ? 'early' : weeks <= 22 ? 'mid' : 'late';
      } else {
        trimester = 3;
        phase = weeks <= 30 ? 'early' : weeks <= 36 ? 'mid' : 'late';
      }

      const personalizedMessages = {
        1: {
          early: "Parabéns! Você está no início desta jornada incrível. Cada dia é especial!",
          mid: "O primeiro trimestre é desafiador, mas você está indo muito bem!",
          late: "Você está quase chegando ao segundo trimestre. Continue assim!"
        },
        2: {
          early: "Bem-vinda ao segundo trimestre! A energia está voltando!",
          mid: "Este é o trimestre mais confortável. Aproveite cada momento!",
          late: "O bebê está crescendo rapidamente. Você está fazendo um trabalho incrível!"
        },
        3: {
          early: "Último trimestre! A contagem regressiva começou!",
          mid: "Estamos quase lá! O bebê está se preparando para conhecer o mundo!",
          late: "Qualquer momento agora! Você está pronta para ser mãe!"
        }
      };

      const recommendedActions = {
        1: [
          "Agende sua primeira consulta pré-natal",
          "Comece a tomar ácido fólico",
          "Evite alimentos crus e mal cozidos",
          "Descanse sempre que possível"
        ],
        2: [
          "Faça exercícios leves regularmente",
          "Mantenha uma alimentação equilibrada",
          "Comece a preparar o quarto do bebê",
          "Pratique técnicas de relaxamento"
        ],
        3: [
          "Prepare a bolsa da maternidade",
          "Finalize os preparativos para o parto",
          "Descanse e economize energia",
          "Mantenha contato regular com seu médico"
        ]
      };

      const healthTips = {
        1: [
          "Náuseas são normais no primeiro trimestre",
          "Mantenha-se hidratada",
          "Evite estresse desnecessário",
          "Durma 8-9 horas por noite"
        ],
        2: [
          "Você pode sentir o bebê se mexer",
          "Aumente a ingestão de ferro",
          "Use roupas confortáveis",
          "Faça caminhadas leves"
        ],
        3: [
          "Inchaços são comuns no final",
          "Mantenha uma postura correta",
          "Evite ficar muito tempo em pé",
          "Prepare-se para o parto"
        ]
      };

      const emotionalSupport = {
        1: [
          "É normal sentir ansiedade no início",
          "Converse com outras gestantes",
          "Mantenha um diário da gravidez",
          "Celebre cada marco importante"
        ],
        2: [
          "Aproveite a energia renovada",
          "Conecte-se com o bebê",
          "Compartilhe sua alegria",
          "Prepare-se mentalmente"
        ],
        3: [
          "A ansiedade do parto é normal",
          "Confie no seu corpo",
          "Mantenha pensamentos positivos",
          "Você está quase lá!"
        ]
      };

      return {
        trimester,
        weeks,
        days,
        phase,
        personalizedMessage: personalizedMessages[trimester][phase],
        recommendedActions: recommendedActions[trimester],
        healthTips: healthTips[trimester],
        emotionalSupport: emotionalSupport[trimester]
      };
    };

    setGestationalData(calculateGestationalData());
  }, [profile]);

  return {
    gestationalData,
    isLoading: !gestationalData
  };
};
