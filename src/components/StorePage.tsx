import { TestTube2, PersonStanding } from 'lucide-react';
import { OptimizedImage } from './ui/OptimizedImage';

export const StorePage = () => {

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 pb-24 space-y-12">
      {/* NAVA LOOKS Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden text-white flex items-center justify-center shadow-2xl">
        <OptimizedImage
          src="/images/products/nava/nava-bikini-showcase.jpg"
          alt="NAVA LOOKS"
          className="w-full h-full object-cover"
          sizes="100vw"
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
          <div className="relative h-64 md:h-full min-h-[300px] rounded-xl overflow-hidden">
            <OptimizedImage
              src="/images/products/ollin/ollin-product-1.jpg"
              alt="Babytest OLLIN"
              className="w-full h-full object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
