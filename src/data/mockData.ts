// Mock data para uma experiência completa
export const mockUsers = [
  {
    id: '1',
    full_name: 'Nathália Valente',
    email: 'nath@clubnath.com',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Influenciadora digital com 35M+ seguidores, CEO da NAVA e especialista em maternidade consciente. Mãe, empresária e apaixonada por conectar mulheres através de experiências autênticas.',
    followers_count: 29000000,
    following_count: 500,
    posts_count: 1250,
    verified: true
  },
  {
    id: '2',
    full_name: 'Maria Silva',
    email: 'maria@teste.com',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Mãe de 2 filhos, empreendedora e apaixonada por finanças pessoais. Aprendendo com a Nath todos os dias! 💕',
    followers_count: 1250,
    following_count: 890,
    posts_count: 45,
    verified: false
  },
  {
    id: '3',
    full_name: 'Ana Costa',
    email: 'ana@teste.com',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    bio: 'Mãe solo, investidora iniciante e fã número 1 do Club Nath! 📈✨',
    followers_count: 890,
    following_count: 1200,
    posts_count: 23,
    verified: false
  },
  {
    id: '4',
    full_name: 'Carla Mendes',
    email: 'carla@teste.com',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    bio: 'Empresária, mãe de 3 e especialista em investimentos. Compartilhando minha jornada financeira! 💼',
    followers_count: 5600,
    following_count: 2100,
    posts_count: 78,
    verified: true
  }
];

export const mockPosts = [
  {
    id: '1',
    user_id: '1',
    caption: 'Mamães, hoje quero falar sobre algo que mudou minha vida: o autocuidado não é egoísmo, é necessidade! 💕\n\nMuitas de vocês me perguntam: "Nath, como conciliar maternidade e autocuidado?"\n\nA resposta é simples: comece com 15 minutos por dia. Um banho relaxante, uma leitura, ou simplesmente respirar fundo.\n\nVocê não pode cuidar de ninguém se não cuidar de si mesma primeiro! 🌸\n\n#Autocuidado #MaternidadeConsciente #ClubNath',
    category: 'Autocuidado',
    image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
    likes_count: 1250,
    comments_count: 89,
    user_has_liked: false,
    has_badge: true,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
    profiles: mockUsers[0]
  },
  {
    id: '2',
    user_id: '2',
    caption: 'Meninas, consegui guardar R$ 500 este mês! 🎉\n\nSeguindo as dicas da Nath, comecei com R$ 50 e fui aumentando aos poucos. A sensação de segurança é indescritível!\n\nPara quem está começando: não desista! Cada real conta. 💪\n\n#PrimeiraReserva #Gratidao #ClubNath',
    category: 'Conquistas',
    image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    likes_count: 234,
    comments_count: 45,
    user_has_liked: true,
    has_badge: false,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 horas atrás
    profiles: mockUsers[1]
  },
  {
    id: '3',
    user_id: '3',
    caption: 'Dica de ouro que aprendi com a Nath: invista em conhecimento antes de investir em ações! 📚\n\nEstou lendo "O Investidor Inteligente" e cada página é um aprendizado. O conhecimento é o melhor investimento que existe.\n\nAlguém mais está estudando sobre investimentos? Vamos trocar experiências! 💡',
    category: 'Investimentos',
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
    likes_count: 567,
    comments_count: 67,
    user_has_liked: false,
    has_badge: false,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 horas atrás
    profiles: mockUsers[2]
  },
  {
    id: '4',
    user_id: '4',
    caption: 'Live incrível hoje com a Nath sobre empreendedorismo feminino! 🚀\n\nAlgumas pérolas que ela falou:\n• "Não tenha medo de cobrar o que você vale"\n• "Networking é investimento, não gasto"\n• "Foque na solução, não no problema"\n\nMulheres, vamos juntas! O futuro é nosso! 💪✨',
    category: 'Empreendedorismo',
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
    likes_count: 890,
    comments_count: 123,
    user_has_liked: true,
    has_badge: true,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 horas atrás
    profiles: mockUsers[3]
  },
  {
    id: '5',
    user_id: '1',
    caption: 'Pergunta que recebo muito: "Nath, como faço para não gastar tudo no cartão?" 💳\n\nMinha estratégia:\n1️⃣ Anote TUDO que gasta\n2️⃣ Use apenas 30% da renda no cartão\n3️⃣ Pague sempre à vista\n4️⃣ Tenha metas claras\n\nO cartão é uma ferramenta, não uma extensão do seu salário! 💰\n\n#ControleFinanceiro #CartaoDeCredito #DicasNath',
    category: 'Educação Financeira',
    image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    likes_count: 2100,
    comments_count: 156,
    user_has_liked: false,
    has_badge: true,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 horas atrás
    profiles: mockUsers[0]
  }
];

export const mockComments = [
  {
    id: '1',
    post_id: '1',
    user_id: '2',
    content: 'Nath, você é uma inspiração! Comecei com R$ 20 e já tenho R$ 200 guardados! 💕',
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    profiles: mockUsers[1]
  },
  {
    id: '2',
    post_id: '1',
    user_id: '3',
    content: 'Essa dica mudou minha vida! Agora tenho uma meta clara para minha reserva. Obrigada! 🙏',
    created_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    profiles: mockUsers[2]
  },
  {
    id: '3',
    post_id: '2',
    user_id: '1',
    content: 'Parabéns, Maria! Você está no caminho certo! Continue assim! 🎉',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    profiles: mockUsers[0]
  }
];

export const mockCategories = [
  'Autocuidado',
  'Maternidade Consciente',
  'Empreendedorismo',
  'Conquistas',
  'Dúvidas',
  'Dicas',
  'Motivação',
  'Bem-estar'
];

export const mockDailyQuotes = [
  {
    id: '1',
    quote: 'A maternidade é uma jornada de autoconhecimento. Cada desafio nos torna mais fortes e cada conquista nos aproxima da mulher que sempre fomos destinadas a ser.',
    author: 'Nathália Valente',
    category: 'Motivação',
    date: new Date().toISOString()
  },
  {
    id: '2',
    quote: 'Ser mãe não significa perder sua identidade. É descobrir uma versão ainda mais poderosa de quem você já é.',
    author: 'Nathália Valente',
    category: 'Educação',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];
