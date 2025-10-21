import { useState, useEffect } from 'react';
import { DEMO_USERS, DEMO_POSTS, DEMO_COMMENTS, DAILY_QUOTES, CHAT_MESSAGES } from '../utils/demoData';

export interface DemoPost {
  id: string;
  user_id: string;
  caption: string;
  category: 'Look do dia' | 'Desabafo' | 'Fé' | 'Dica de mãe';
  image_url?: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  user_has_liked?: boolean;
  profiles?: {
    id: string;
    full_name: string;
    avatar_url?: string;
    bio?: string;
  };
}

export interface DemoComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

// Define the type for the demo user object
export interface DemoUser {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
  };
}

export const useDemoMode = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    // Verificar se está em modo demo
    const demoMode = localStorage.getItem('clubnath_demo_mode') === 'true';
    setIsDemoMode(demoMode);

    if (demoMode) {
      // Usar primeiro usuário demo como usuário logado
      const user = DEMO_USERS[0];
      setDemoUser({
        id: user.id,
        email: 'demo@clubnath.com.br',
        user_metadata: {
          full_name: user.full_name,
        },
      });
    }
  }, []);

  const enableDemoMode = () => {
    localStorage.setItem('clubnath_demo_mode', 'true');
    setIsDemoMode(true);
    const user = DEMO_USERS[0];
    setDemoUser({
      id: user.id,
      email: 'demo@clubnath.com.br',
      user_metadata: {
        full_name: user.full_name,
      },
    });
  };

  const disableDemoMode = () => {
    localStorage.removeItem('clubnath_demo_mode');
    setIsDemoMode(false);
    setDemoUser(null);
  };

  const getDemoPosts = (): DemoPost[] => {
    return DEMO_POSTS.map((post, index) => {
      const user = DEMO_USERS.find((u) => u.id === post.user_id);
      return {
        id: `demo-post-${index + 1}`,
        ...post,
        image_url: undefined,
        created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        user_has_liked: Math.random() > 0.5,
        profiles: user
          ? {
              id: user.id,
              full_name: user.full_name,
              avatar_url: user.avatar_url,
              bio: user.bio,
            }
          : undefined,
      };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const getDemoComments = (postId: string): DemoComment[] => {
    // Encontrar índice do post
    const postIndex = parseInt(postId.split('-')[2]) - 1;
    const commentData = DEMO_COMMENTS.find((c) => c.post_index === postIndex);

    if (!commentData) return [];

    return commentData.comments.map((comment, index) => {
      const user = DEMO_USERS.find((u) => u.id === comment.user_id);
      return {
        id: `demo-comment-${postIndex}-${index}`,
        post_id: postId,
        user_id: comment.user_id,
        content: comment.content,
        created_at: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString(),
        profiles: user
          ? {
              id: user.id,
              full_name: user.full_name,
              avatar_url: user.avatar_url,
            }
          : undefined,
      };
    });
  };

  const getDemoUserProfile = () => {
    const user = DEMO_USERS[0];
    return {
      id: user.id,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      bio: user.bio,
      created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      onboarding_completed: user.onboarding_completed,
      goals: user.goals,
      life_phase: user.life_phase,
      interests: user.interests,
    };
  };

  const getDailyQuote = () => {
    const today = new Date().getDate();
    const quoteIndex = today % DAILY_QUOTES.length;
    return {
      id: `demo-quote-${today}`,
      ...DAILY_QUOTES[quoteIndex],
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };
  };

  const getChatMessages = () => {
    return CHAT_MESSAGES.map((msg, index) => ({
      id: `demo-chat-${index}`,
      user_id: demoUser?.id || 'demo-user-1',
      message: msg.message,
      is_user: msg.is_user,
      created_at: new Date(Date.now() - (CHAT_MESSAGES.length - index) * 1000).toISOString(),
    }));
  };

  const simulateLike = (postId: string, currentLiked: boolean) => {
    // Simular like/unlike
    return !currentLiked;
  };

  const simulateComment = (postId: string, content: string) => {
    // Simular adicionar comentário
    const user = DEMO_USERS[0];
    return {
      id: `demo-comment-new-${Date.now()}`,
      post_id: postId,
      user_id: user.id,
      content,
      created_at: new Date().toISOString(),
      profiles: {
        id: user.id,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
      },
    };
  };

  const simulateChatResponse = (userMessage: string) => {
    // Simular resposta do chat bot com base na mensagem
    const responses = [
      'Que lindo compartilhar isso comigo! Estou aqui para te apoiar. 💛',
      'Entendo como você se sente. Lembre-se: cada dia é uma nova oportunidade de crescimento.',
      'Você está no caminho certo! Continue firme em sua jornada. ✨',
      'Isso é muito importante. Que tal refletir sobre isso em seu journal hoje?',
      'Admiro sua força e determinação. Você é capaz de muito mais do que imagina! 🌟',
      'Gratidão é sempre um bom caminho. O que você é grata hoje?',
      'Lembre-se de cuidar de si mesma. Você merece amor e cuidado, assim como todos ao seu redor. 💕',
    ];

    // Escolher resposta baseada em palavras-chave
    const lowerMessage = userMessage.toLowerCase();
    let response = responses[Math.floor(Math.random() * responses.length)];

    if (lowerMessage.includes('triste') || lowerMessage.includes('difícil') || lowerMessage.includes('cansad')) {
      response =
        'Sinto muito que esteja passando por isso. Lembre-se: você não está sozinha. A comunidade ClubNath está aqui para te apoiar. Que tal conversar com outras mulheres no Feed? 💛';
    } else if (lowerMessage.includes('feliz') || lowerMessage.includes('conquista') || lowerMessage.includes('vitória')) {
      response = 'Que alegria! Parabéns por essa conquista! Compartilhe isso com a comunidade, sua vitória inspira outras mulheres! 🎉✨';
    } else if (lowerMessage.includes('ansied') || lowerMessage.includes('preocupad')) {
      response =
        'A ansiedade pode ser desafiadora. Que tal experimentar uma técnica de respiração? Inspire por 4 segundos, segure por 4, expire por 4. Repita 3 vezes. Estou aqui com você. 🌸';
    } else if (lowerMessage.includes('obrigad') || lowerMessage.includes('gratidão')) {
      response = 'Por nada! Estou sempre aqui para você. A gratidão transforma nossa perspectiva. Continue cultivando esse sentimento lindo! 💛';
    }

    return {
      id: `demo-chat-response-${Date.now()}`,
      user_id: demoUser?.id || 'demo-user-1',
      message: response,
      is_user: false,
      created_at: new Date().toISOString(),
    };
  };

  return {
    isDemoMode,
    demoUser,
    enableDemoMode,
    disableDemoMode,
    getDemoPosts,
    getDemoComments,
    getDemoUserProfile,
    getDailyQuote,
    getChatMessages,
    simulateLike,
    simulateComment,
    simulateChatResponse,
  };
};
