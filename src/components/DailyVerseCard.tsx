import { useState, useEffect } from 'react';
import { BookOpen, Heart, Share2 } from 'lucide-react';

interface DailyVerse {
  verse: string;
  reference: string;
  theme: string;
}

// Mock daily verses (in production, this would come from an API)
const dailyVerses: DailyVerse[] = [
  {
    verse:
      'Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.',
    reference: 'Jeremias 29:11',
    theme: 'Esperança',
  },
  {
    verse: 'Tudo posso naquele que me fortalece.',
    reference: 'Filipenses 4:13',
    theme: 'Força',
  },
  {
    verse: 'Entrega o teu caminho ao Senhor; confia nele, e ele o fará.',
    reference: 'Salmos 37:5',
    theme: 'Confiança',
  },
  {
    verse:
      'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
    reference: 'João 3:16',
    theme: 'Amor',
  },
  {
    verse:
      'E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.',
    reference: 'Romanos 8:28',
    theme: 'Propósito',
  },
];

export const DailyVerseCard = () => {
  const [currentVerse, setCurrentVerse] = useState<DailyVerse | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isShared, setIsShared] = useState(false);

  // Get today's verse based on date
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    const verseIndex = dayOfYear % dailyVerses.length;
    setCurrentVerse(dailyVerses[verseIndex]);
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = async () => {
    if (navigator.share && currentVerse) {
      try {
        await navigator.share({
          title: 'Versículo do Dia - ClubNath',
          text: `"${currentVerse.verse}" - ${currentVerse.reference}`,
          url: window.location.href,
        });
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    }
  };

  if (!currentVerse) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950/30 dark:to-secondary-950/30 rounded-2xl p-6 mb-6 border border-primary-200/50 dark:border-primary-800/30 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-medium">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Versículo do Dia
            </h3>
            <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
              {currentVerse.theme}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`p-2 rounded-xl transition-all duration-200 ${
              isLiked
                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-neutral-100 text-neutral-500 hover:bg-red-50 hover:text-red-500 dark:bg-neutral-800 dark:hover:bg-red-900/20'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className={`p-2 rounded-xl transition-all duration-200 ${
              isShared
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-neutral-100 text-neutral-500 hover:bg-green-50 hover:text-green-500 dark:bg-neutral-800 dark:hover:bg-green-900/20'
            }`}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Verse */}
      <div className="mb-4">
        <blockquote className="text-lg leading-relaxed text-neutral-800 dark:text-neutral-200 italic">
          "{currentVerse.verse}"
        </blockquote>
        <cite className="text-sm text-primary-600 dark:text-primary-400 font-medium mt-2 block">
          — {currentVerse.reference}
        </cite>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <span>Compartilhado com amor pela Nathália</span>
        <span>
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
};
