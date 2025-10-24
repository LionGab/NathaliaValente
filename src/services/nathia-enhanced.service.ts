/**
 * NathIA Enhanced Service
 * Sistema de IA personalizado para ClubNath VIP
 * Focado exclusivamente em maternidade e nunca foge do contexto
 */

// import { logInfo, logDebug, handleError } from '../lib/errorHandler';

// Funções de log temporárias para build
const logInfo = (message: string, context: any) => {
  if (import.meta.env.DEV) {
    console.log(`[INFO] ${message}`, context);
  }
};

const logDebug = (message: string, context: any) => {
  if (import.meta.env.DEV) {
    console.log(`[DEBUG] ${message}`, context);
  }
};

const handleError = (error: Error, context: any, feature: string) => {
  console.error(`[ERROR] ${feature}:`, error.message, context);
};

interface NathIAContext {
    userId: string;
    chatHistory: any[];
    userProfile: any;
    currentTopic: string | null;
    emotionalState: 'calm' | 'anxious' | 'overwhelmed' | 'happy' | 'frustrated';
    previousTopics: string[];
    userPreferences: {
        responseStyle: 'warm' | 'direct' | 'spiritual' | 'practical';
        includeScripture: boolean;
        includePracticalTips: boolean;
    };
}

interface NathIAResponse {
    message: string;
    emotionalTone: string;
    responseType: string;
    suggestedActions?: string[];
    scripture?: string;
    practicalTips?: string[];
    followUpQuestions?: string[];
}

/**
 * Sistema de validação para manter contexto de maternidade
 */
const validateMaternityContext = (message: string): boolean => {
    const maternityKeywords = [
        // Maternidade geral
        'mãe', 'maternidade', 'filho', 'filha', 'criança', 'bebê', 'gravidez', 'parto',
        'amamentação', 'mamãe', 'papai', 'pai', 'família', 'parentalidade',

        // Desenvolvimento infantil
        'birra', 'birras', 'comportamento', 'desenvolvimento', 'crescimento', 'aprendizado',
        'sono', 'dormir', 'insônia', 'pesadelo', 'sonambulismo',
        'alimentação', 'comida', 'comer', 'nutrição', 'dieta', 'mamadeira', 'papinha',
        'rotina', 'organizar', 'cronograma', 'horário', 'agenda',

        // Emoções e bem-estar
        'culpa', 'culpada', 'sobrecarregada', 'cansada', 'exausta', 'estressada',
        'ansiosa', 'preocupada', 'triste', 'feliz', 'orgulhosa', 'gratidão',
        'bem-estar', 'saúde', 'exercício', 'meditação', 'relaxamento',

        // Relacionamentos
        'casamento', 'marido', 'esposo', 'namorado', 'namorada', 'relacionamento',
        'conflito', 'briga', 'discussão', 'comunicação', 'intimidade',

        // Espiritualidade
        'bíblico', 'bíblia', 'oração', 'orar', 'rezar', 'fé', 'espiritual',
        'versículo', 'estudo', 'reflexão', 'deus', 'jesus', 'cristo',
        'igreja', 'pastor', 'ministério', 'evangelho',

        // Educação e carreira
        'escola', 'professor', 'educação', 'aprender', 'ensinar', 'brincadeira',
        'brinquedo', 'diversão', 'criatividade', 'carreira', 'trabalho', 'emprego',
        'negócio', 'empreendedorismo', 'finanças', 'dinheiro', 'economia',

        // Saúde e cuidados
        'médico', 'pediatra', 'vacina', 'doença', 'febre', 'gripe', 'resfriado',
        'alergia', 'medicamento', 'tratamento', 'hospital', 'emergência'
    ];

    const messageLower = message.toLowerCase();
    return maternityKeywords.some(keyword => messageLower.includes(keyword));
};

/**
 * Analisa o estado emocional da usuária baseado na mensagem
 */
const analyzeEmotionalState = (message: string, history: any[]): NathIAContext['emotionalState'] => {
    const messageLower = message.toLowerCase();

    // Palavras que indicam ansiedade
    if (messageLower.includes('ansiosa') || messageLower.includes('preocupada') ||
        messageLower.includes('nervosa') || messageLower.includes('medo')) {
        return 'anxious';
    }

    // Palavras que indicam sobrecarga
    if (messageLower.includes('sobrecarregada') || messageLower.includes('cansada') ||
        messageLower.includes('exausta') || messageLower.includes('não aguento')) {
        return 'overwhelmed';
    }

    // Palavras que indicam frustração
    if (messageLower.includes('frustrada') || messageLower.includes('raiva') ||
        messageLower.includes('irritada') || messageLower.includes('não consigo')) {
        return 'frustrated';
    }

    // Palavras que indicam felicidade
    if (messageLower.includes('feliz') || messageLower.includes('orgulhosa') ||
        messageLower.includes('conquista') || messageLower.includes('sucesso')) {
        return 'happy';
    }

    return 'calm';
};

/**
 * Gera resposta personalizada baseada no contexto
 */
const generatePersonalizedResponse = (
    message: string,
    context: NathIAContext
): NathIAResponse => {
    const messageLower = message.toLowerCase();

    // Se não for sobre maternidade, redirecionar gentilmente
    if (!validateMaternityContext(message)) {
        return {
            message: "Querida, sou especializada em apoiar mães em sua jornada! 💕 Posso te ajudar com questões sobre maternidade, desenvolvimento infantil, rotinas familiares, bem-estar materno, ou até mesmo momentos espirituais. Como posso te apoiar hoje? 🌟",
            emotionalTone: "gentle_redirect",
            responseType: "context_redirect",
            followUpQuestions: [
                "Como está sendo sua jornada materna?",
                "Há algum desafio específico que gostaria de conversar?",
                "Como posso te apoiar hoje?"
            ]
        };
    }

    // Respostas específicas por categoria
    if (messageLower.includes('birra') || messageLower.includes('birras') || messageLower.includes('comportamento')) {
        return generateBehavioralResponse(message, context);
    }

    if (messageLower.includes('sono') || messageLower.includes('dormir') || messageLower.includes('insônia')) {
        return generateSleepResponse(message, context);
    }

    if (messageLower.includes('sobrecarregada') || messageLower.includes('cansada') || messageLower.includes('exausta')) {
        return generateEmotionalSupportResponse(message, context);
    }

    if (messageLower.includes('rotina') || messageLower.includes('organizar') || messageLower.includes('cronograma')) {
        return generateRoutineResponse(message, context);
    }

    if (messageLower.includes('alimentação') || messageLower.includes('comida') || messageLower.includes('comer')) {
        return generateNutritionResponse(message, context);
    }

    if (messageLower.includes('culpa') || messageLower.includes('culpada') || messageLower.includes('erro')) {
        return generateGuiltResponse(message, context);
    }

    if (messageLower.includes('bíblico') || messageLower.includes('estudo') || messageLower.includes('bíblia')) {
        return generateBiblicalResponse(message, context);
    }

    if (messageLower.includes('versículo') || messageLower.includes('palavra')) {
        return generateScriptureResponse(message, context);
    }

    if (messageLower.includes('oração') || messageLower.includes('orar') || messageLower.includes('rezar')) {
        return generatePrayerResponse(message, context);
    }

    if (messageLower.includes('reflexão') || messageLower.includes('espiritual') || messageLower.includes('fé')) {
        return generateSpiritualResponse(message, context);
    }

    // Resposta contextual baseada no histórico
    return generateContextualResponse(message, context);
};

/**
 * Resposta para questões comportamentais
 */
const generateBehavioralResponse = (message: string, context: NathIAContext): NathIAResponse => {
    const hasDiscussedBehavior = context.previousTopics.includes('behavior');

    let response = "";
    let practicalTips: string[] = [];

    if (hasDiscussedBehavior) {
        response = "Vejo que as birras têm sido um tema recorrente para vocês. 💙 Isso é totalmente normal! Cada criança tem seu próprio ritmo. Que tal tentarmos uma abordagem diferente hoje?";
        practicalTips = [
            "Antecipe situações que podem gerar birras",
            "Use linguagem positiva ('Vamos fazer isso juntos')",
            "Crie um 'cantinho da calma' em casa",
            "Celebre quando ela se acalma sozinha"
        ];
    } else {
        response = "As birras são uma fase natural do desenvolvimento! 💫 Aqui estão estratégias que realmente funcionam:";
        practicalTips = [
            "Mantenha a calma - respire fundo antes de reagir",
            "Valide os sentimentos ('Vejo que você está chateado, isso é normal')",
            "Ofereça escolhas limitadas ('Quer o copo azul ou vermelho?')",
            "Use distração criativa",
            "Crie um 'cantinho da calma' juntos"
        ];
    }

    return {
        message: response + " Lembre-se: você está ensinando regulação emocional! 🌈",
        emotionalTone: "understanding",
        responseType: "behavioral_guidance",
        practicalTips,
        followUpQuestions: [
            "Como tem sido a evolução desde nossa última conversa?",
            "Qual situação específica tem sido mais desafiadora?",
            "O que você acha que pode funcionar melhor para vocês?"
        ]
    };
};

/**
 * Resposta para questões de sono
 */
const generateSleepResponse = (message: string, context: NathIAContext): NathIAResponse => {
    const hasDiscussedSleep = context.previousTopics.includes('sleep');

    let response = "";
    let practicalTips: string[] = [];

    if (hasDiscussedSleep) {
        response = "O sono continua sendo um desafio? 😴 Vamos revisar nossa estratégia! Como tem sido a rotina desde nossa última conversa?";
        practicalTips = [
            "Verifique se o ambiente está realmente propício (temperatura, escuridão, silêncio)",
            "A rotina pode precisar de pequenos ajustes",
            "Observe se há mudanças na vida da criança que afetam o sono"
        ];
    } else {
        response = "O sono dos pequenos pode ser um desafio, mas temos estratégias que funcionam! 😴 Vamos criar uma rotina personalizada:";
        practicalTips = [
            "Horário fixo para dormir (consistência é chave)",
            "Ambiente calmo e escuro",
            "Rotina relaxante de 30-45min (banho, história, música suave)",
            "Evite telas 1h antes",
            "Use aromaterapia suave (lavanda)"
        ];
    }

    return {
        message: response + " Cada criança é única - vamos encontrar o que funciona para vocês! 💤",
        emotionalTone: "calm",
        responseType: "sleep_guidance",
        practicalTips,
        followUpQuestions: [
            "Como tem sido a rotina atual?",
            "Há algum horário que funciona melhor?",
            "O que você acha que pode estar atrapalhando o sono?"
        ]
    };
};

/**
 * Resposta para apoio emocional
 */
const generateEmotionalSupportResponse = (message: string, context: NathIAContext): NathIAResponse => {
    const response = "Querida, é normal se sentir assim! 🤗 A maternidade é intensa e você está fazendo um trabalho incrível. Vamos cuidar de você também:";

    const practicalTips = [
        "Peça ajuda específica (não 'ajude-me', mas 'pode dar banho no João hoje?')",
        "Reserve 15 minutos diários só para você",
        "Conecte-se com outras mães - você não está sozinha",
        "Lembre-se: você não precisa ser perfeita, apenas presente"
    ];

    return {
        message: response + " Como posso te apoiar hoje? 💖",
        emotionalTone: "empathetic",
        responseType: "emotional_support",
        practicalTips,
        followUpQuestions: [
            "O que tem sido mais desafiador ultimamente?",
            "Você tem uma rede de apoio?",
            "Como posso te ajudar a se sentir mais apoiada?"
        ]
    };
};

/**
 * Resposta para questões de rotina
 */
const generateRoutineResponse = (message: string, context: NathIAContext): NathIAResponse => {
    const hasDiscussedRoutine = context.previousTopics.includes('routine');

    let response = "";
    let practicalTips: string[] = [];

    if (hasDiscussedRoutine) {
        response = "Como está funcionando a rotina que criamos? 📅 Às vezes precisamos de ajustes:";
        practicalTips = [
            "Seja flexível - a rotina serve vocês, não o contrário",
            "Inclua tempo para imprevistos (crianças são imprevisíveis!)",
            "Envolva a criança na criação da rotina",
            "Celebre pequenas conquistas"
        ];
    } else {
        response = "Organizar a rotina é um superpoder materno! 📅 Vamos criar algo que funcione para vocês:";
        practicalTips = [
            "Comece com horários fixos para refeições e sono",
            "Crie um cronograma visual (desenhos, cores)",
            "Inclua tempo para brincadeiras livres",
            "Seja realista - inclua tempo para imprevistos",
            "Envolva a criança nas tarefas (mesmo que demore mais)"
        ];
    }

    return {
        message: response + " O importante é ter uma base sólida, não perfeição! ✨",
        emotionalTone: "encouraging",
        responseType: "routine_planning",
        practicalTips,
        followUpQuestions: [
            "O que tem funcionado melhor na rotina atual?",
            "Qual parte da rotina precisa de mais atenção?",
            "Como podemos tornar a rotina mais divertida?"
        ]
    };
};

/**
 * Resposta para questões de alimentação
 */
const generateNutritionResponse = (message: string, context: NathIAContext): NathIAResponse => {
    const hasDiscussedNutrition = context.previousTopics.includes('nutrition');

    let response = "";
    let practicalTips: string[] = [];

    if (hasDiscussedNutrition) {
        response = "Como tem sido a alimentação desde nossa última conversa? 🍎 Lembre-se:";
        practicalTips = [
            "Ofereça variedade, mas sem pressão",
            "Seja paciente - pode levar 10+ tentativas para aceitar um alimento",
            "Torne a hora da refeição divertida (cores, formatos diferentes)",
            "Coma junto - crianças imitam o que veem"
        ];
    } else {
        response = "A alimentação é uma jornada de descobertas! 🍎 Estratégias que funcionam:";
        practicalTips = [
            "Ofereça variedade de cores e texturas",
            "Seja paciente - pode levar 10+ tentativas",
            "Coma junto com a criança (imitação é poderosa!)",
            "Torne a hora da refeição divertida",
            "Evite distrações (TV, brinquedos)",
            "Respeite a saciedade da criança"
        ];
    }

    return {
        message: response + " Você está criando hábitos saudáveis para a vida toda! 🌈",
        emotionalTone: "nurturing",
        responseType: "nutrition_guidance",
        practicalTips,
        followUpQuestions: [
            "Qual tem sido o maior desafio na alimentação?",
            "Há algum alimento que seu filho gosta mais?",
            "Como podemos tornar as refeições mais prazerosas?"
        ]
    };
};

/**
 * Resposta para questões de culpa
 */
const generateGuiltResponse = (message: string, context: NathIAContext): NathIAResponse => {
    const response = "A culpa materna é um sentimento que muitas de nós conhecemos. 💙 Mas saiba que:";

    const practicalTips = [
        "Você está fazendo o seu melhor a cada dia",
        "Erros fazem parte do aprendizado (para você e para a criança)",
        "Seu amor é incondicional e isso é o mais importante",
        "Você é humana e isso é lindo"
    ];

    return {
        message: response + " Permita-se ser gentil consigo mesma. Você é uma mãe incrível! ✨",
        emotionalTone: "compassionate",
        responseType: "emotional_healing",
        practicalTips,
        followUpQuestions: [
            "O que tem te causado mais culpa ultimamente?",
            "Como você tem lidado com esses sentimentos?",
            "O que te ajudaria a se sentir mais confiante?"
        ]
    };
};

/**
 * Resposta para estudos bíblicos
 */
const generateBiblicalResponse = (message: string, context: NathIAContext): NathIAResponse => {
    const response = "Que lindo momento espiritual! 🙏 Vamos refletir juntas: 'Ensina a criança no caminho em que deve andar, e ainda quando for velho não se desviará dele.' (Provérbios 22:6). A maternidade é um chamado sagrado.";

    return {
        message: response + " Que tal começarmos com um estudo bíblico sobre paciência e amor incondicional? Como você tem ensinado valores cristãos para seu filho? 💕",
        emotionalTone: "spiritual",
        responseType: "biblical_guidance",
        scripture: "Provérbios 22:6",
        followUpQuestions: [
            "Como você tem ensinado valores cristãos para seu filho?",
            "Há algum versículo que tem te fortalecido?",
            "Como podemos tornar a fé mais presente no dia a dia?"
        ]
    };
};

/**
 * Resposta para versículos
 */
const generateScriptureResponse = (message: string, context: NathIAContext): NathIAResponse => {
    const response = "Deus tem palavras especiais para nós, mães! 📖 'Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.' (Jeremias 29:11). Você está no lugar certo, no tempo certo.";

    return {
        message: response + " Confie no processo! Que versículo tem te fortalecido ultimamente? 🌟",
        emotionalTone: "inspiring",
        responseType: "scripture_sharing",
        scripture: "Jeremias 29:11",
        followUpQuestions: [
            "Que versículo tem te fortalecido ultimamente?",
            "Como você tem aplicado a Palavra na sua maternidade?",
            "Há algum versículo que gostaria de compartilhar?"
        ]
    };
};

/**
 * Resposta para orações
 */
const generatePrayerResponse = (message: string, context: NathIAContext): NathIAResponse => {
    const response = "Vamos orar juntas, querida! 🙏 'Senhor, abençoa esta mãe corajosa. Dá-lhe sabedoria para cada decisão, paciência para os momentos difíceis, e alegria para celebrar cada conquista. Que ela sinta Seu amor incondicional em cada dia. Fortalece-a para ser o exemplo de amor que seu filho precisa. Amém.'";

    return {
        message: response + " 💕 Você é abençoada e abençoadora!",
        emotionalTone: "prayerful",
        responseType: "prayer_guidance",
        followUpQuestions: [
            "Há algo específico que gostaria de orar?",
            "Como posso te apoiar em sua caminhada espiritual?",
            "Você tem sentido a presença de Deus na sua maternidade?"
        ]
    };
};

/**
 * Resposta para reflexões espirituais
 */
const generateSpiritualResponse = (message: string, context: NathIAContext): NathIAResponse => {
    const response = "Que momento especial de conexão! ✨ A maternidade é um reflexo do amor divino. Cada abraço, cada palavra de carinho, cada momento de paciência é um ato de amor. Você está sendo instrumento de Deus na vida do seu filho.";

    return {
        message: response + " Que lindo chamado! Como você tem visto a mão de Deus na sua jornada materna? 🌈",
        emotionalTone: "contemplative",
        responseType: "spiritual_reflection",
        followUpQuestions: [
            "Como você tem visto a mão de Deus na sua jornada materna?",
            "Há algum momento em que sentiu Sua presença de forma especial?",
            "Como podemos tornar a fé mais presente no dia a dia?"
        ]
    };
};

/**
 * Resposta contextual baseada no histórico
 */
const generateContextualResponse = (message: string, context: NathIAContext): NathIAResponse => {
    const contextualResponses = [
        "Entendo perfeitamente o que você está passando. Como mãe, sei que cada desafio é único. Vamos juntas encontrar a melhor solução para você! 💕",
        "Que coragem você tem em compartilhar isso comigo! Muitas mães passam por situações similares. Você não está sozinha nessa jornada. 🌟",
        "Sua preocupação é totalmente válida. A maternidade é cheia de momentos assim. Vamos conversar sobre isso com carinho e sabedoria. 🤱",
        "Admiro sua dedicação em buscar ajuda. Isso mostra o quanto você ama seu filho. Vamos trabalhar juntas para resolver isso. 💪",
        "Cada mãe tem sua própria jornada, mas compartilhamos muitos sentimentos em comum. Obrigada por confiar em mim. Vamos juntas! ✨"
    ];

    let response = "";

    if (context.emotionalState === 'anxious') {
        response = "Vejo que você está passando por momentos de ansiedade. 💙 Isso é normal na maternidade. Vamos trabalhar juntas para te trazer mais calma e confiança.";
    } else if (context.emotionalState === 'overwhelmed') {
        response = "Querida, é normal se sentir sobrecarregada. 🤗 A maternidade é intensa, mas você está fazendo um trabalho incrível. Vamos cuidar de você também.";
    } else if (context.emotionalState === 'frustrated') {
        response = "Entendo sua frustração. 💪 Ser mãe não é fácil, mas você está no caminho certo. Vamos encontrar estratégias que funcionem para vocês.";
    } else if (context.emotionalState === 'happy') {
        response = "Que lindo ver sua alegria! 🌟 A maternidade tem seus momentos mágicos, não é? Vamos celebrar essas conquistas juntas!";
    } else {
        response = contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
    }

    return {
        message: response,
        emotionalTone: "supportive",
        responseType: "contextual",
        followUpQuestions: [
            "Como você tem se sentido ultimamente?",
            "Há algo específico que gostaria de conversar?",
            "Como posso te apoiar melhor hoje?"
        ]
    };
};

/**
 * Função principal para gerar resposta da NathIA
 */
export const generateNathIAResponse = async (
    userMessage: string,
    userId: string,
    chatHistory: any[] = []
): Promise<NathIAResponse> => {
    try {
        logDebug('Generating NathIA response', {
            action: 'generateNathIAResponse',
            feature: 'nathia-enhanced',
            userId,
            messageLength: userMessage.length
        });

        // Simular delay de processamento mais realista
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1500));

        // Analisar contexto
        const emotionalState = analyzeEmotionalState(userMessage, chatHistory);
        const previousTopics = chatHistory
            .slice(-5)
            .map(msg => msg.content.toLowerCase())
            .join(' ')
            .split(' ')
            .filter(word => ['birra', 'sono', 'alimentação', 'rotina', 'culpa', 'bíblico', 'oração'].includes(word));

        const context: NathIAContext = {
            userId,
            chatHistory,
            userProfile: null, // Seria preenchido com dados reais do usuário
            currentTopic: null,
            emotionalState,
            previousTopics,
            userPreferences: {
                responseStyle: 'warm',
                includeScripture: true,
                includePracticalTips: true
            }
        };

        // Gerar resposta personalizada
        const response = generatePersonalizedResponse(userMessage, context);

        logInfo('NathIA response generated', {
            action: 'generateNathIAResponse',
            feature: 'nathia-enhanced',
            userId,
            responseType: response.responseType,
            emotionalTone: response.emotionalTone
        });

        return response;

    } catch (error) {
        handleError(error as Error, {
            action: 'generateNathIAResponse',
            feature: 'nathia-enhanced',
            userId
        }, 'nathia-enhanced');

        // Resposta de fallback
        return {
            message: "Desculpe, estou passando por um momento técnico. Mas saiba que estou aqui para te apoiar! 💕 Como posso te ajudar hoje?",
            emotionalTone: "apologetic",
            responseType: "fallback",
            followUpQuestions: [
                "Como posso te apoiar hoje?",
                "Há algo específico que gostaria de conversar?"
            ]
        };
    }
};
