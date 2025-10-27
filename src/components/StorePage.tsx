import { TestTube2, PersonStanding, ShoppingBag } from 'lucide-react';

export const StorePage = () => {

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 pb-24 space-y-12">
      {/* NAVA LOOKS Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden text-white flex items-center justify-center shadow-2xl bg-gradient-to-r from-pink-500 to-purple-600">
        <img
          src="/images/products/nava/nava-looks-final.jpg"
          alt="NAVA LOOKS"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center p-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-2 drop-shadow-2xl">
            NAVA LOOKS
          </h1>
          <p className="mt-2 text-lg md:text-xl drop-shadow-lg">
            Vista-se de você
          </p>
          <button
            onClick={() => window.open('https://loja.nathaliavalente.com', '_blank')}
            className="mt-6 bg-white text-neutral-900 px-6 py-3 rounded-xl font-semibold hover:bg-neutral-100 transition-all duration-200 shadow-lg flex items-center gap-2 mx-auto"
          >
            <PersonStanding className="w-5 h-5" />
            Acessar Provador Virtual
          </button>
        </div>
      </div>

      {/* Babytest Section */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="grid md:grid-cols-2 items-center gap-6">
          <div className="p-4 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <TestTube2 className="h-8 w-8 text-primary-500" />
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white">
                Babytest
              </h3>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed mb-6">
              O teste que revela o futuro do seu bebê está no DNA. Entenda predisposições genéticas e cuide da saúde desde os primeiros dias.
            </p>
            <button
              onClick={() => window.open('https://ollin.com.br/babytest', '_blank')}
              className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-all duration-200 shadow-medium"
            >
              Saiba mais e compre
            </button>
          </div>
          <div className="relative h-64 md:h-full min-h-[300px] rounded-xl overflow-hidden bg-pink-100">
            <img
              src="/images/products/ollin/babytest-final.jpg"
              alt="Babytest OLLIN"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Dicas de Maternidade Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-pink-500" />
              Dicas da Nath
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Conteúdo exclusivo para sua jornada materna
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-2xl p-6 shadow-lg border-2 border-pink-200 dark:border-pink-800">
            <img
              src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&h=600&fit=crop"
              alt="Dicas de Sono"
              className="w-full h-48 rounded-xl object-cover mb-4"
            />
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              Rotina de Sono para Bebês
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Aprenda técnicas comprovadas para estabelecer uma rotina de sono saudável para seu bebê. Dicas práticas da Nath.
            </p>
            <button className="text-pink-600 dark:text-pink-400 font-semibold hover:underline">
              Ler mais →
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-2xl p-6 shadow-lg border-2 border-purple-200 dark:border-purple-800">
            <img
              src="https://images.unsplash.com/photo-1493663284031-b7e3aaa7952d?w=800&h=600&fit=crop"
              alt="Amamentação"
              className="w-full h-48 rounded-xl object-cover mb-4"
            />
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              Amamentação com Amor
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Guia completo sobre amamentação: posições corretas, dicas de alimentação e como superar desafios comuns.
            </p>
            <button className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
              Ler mais →
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};


