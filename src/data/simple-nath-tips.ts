export interface SimpleTip {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
}

export const simpleTips: SimpleTip[] = [
  {
    id: '1',
    title: 'Primeiros Cuidados com o Recém-Nascido',
    summary: 'Tudo que você precisa saber para cuidar do seu bebê nos primeiros dias em casa.',
    category: 'Primeiros Cuidados',
    author: 'Nathália Valente',
  },
  {
    id: '2',
    title: 'Amamentação: Guia Completo para Mães',
    summary: 'Dicas práticas e apoio emocional para uma amamentação bem-sucedida e prazerosa.',
    category: 'Amamentação',
    author: 'Nathália Valente',
  },
];
