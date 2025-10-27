import { TestTube2, PersonStanding, ShoppingBag, Heart } from 'lucide-react';

export const StorePage = () => {
  // Produtos para Desapega das Mamães
  const desapegaProducts = [
    {
      id: 1,
      name: 'Carrinho Galzerano Preto',
      price: 'R$ 450,00',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
      author: 'Ana S.',
      avatar: 'AS'
    },
    {
      id: 2,
      name: 'Berço de madeira maciça',
      price: 'R$ 700,00',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=400&fit=crop&crop=center',
      author: 'Mariana L.',
      avatar: 'ML'
    },
    {
      id: 3,
      name: 'Kit mamadeiras Philips Avent',
      price: 'R$ 80,00',
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop&crop=center',
      author: 'Julia C.',
      avatar: 'JC'
    },
    {
      id: 4,
      name: 'Cadeirão Chicco',
      price: 'R$ 300,00',
      image: 'https://images.unsplash.com/photo-1542356590-54bc308435c2?w=400&h=400&fit=crop&crop=center',
      author: 'Carla D.',
      avatar: 'CD'
    },
    {
      id: 5,
      name: 'Bebê conforto Maxi-Cosi',
      price: 'R$ 350,00',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
      author: 'Patricia M.',
      avatar: 'PM'
    },
    {
      id: 6,
      name: 'Mochila de bebê Ergobaby',
      price: 'R$ 280,00',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&crop=center',
      author: 'Fernanda R.',
      avatar: 'FR'
    },
    {
      id: 7,
      name: 'Kit chupetas NUK',
      price: 'R$ 45,00',
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&crop=center',
      author: 'Luciana T.',
      avatar: 'LT'
    },
    {
      id: 8,
      name: 'Banheira para bebê',
      price: 'R$ 120,00',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center',
      author: 'Camila A.',
      avatar: 'CA'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 pb-24 space-y-12">
      {/* NAVA LOOKS Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden text-white flex items-center justify-center shadow-2xl bg-gradient-to-r from-pink-500 to-purple-600">
        <img
          src="https://i.imgur.com/TjCevtA.jpg"
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
          <div className="mt-4 text-sm md:text-base drop-shadow-lg">
            <p>Bikini Premium Nathália - R$ 165,00</p>
            <p>Conjunto Bikini Nathy - R$ 165,00</p>
          </div>
          <button
            onClick={() => window.open('https://www.navabeachwear.com.br/', '_blank')}
            className="mt-6 bg-white text-neutral-900 px-6 py-3 rounded-xl font-semibold hover:bg-neutral-100 transition-all duration-200 shadow-lg flex items-center gap-2 mx-auto"
          >
            <PersonStanding className="w-5 h-5" />
            Acessar Loja NAVA
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
                Babytest by OLLIN
              </h3>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed mb-4">
              O melhor para o seu bebê desde os primeiros dias de vida. O Babytest by OLLIN investiga mais de 600 doenças genéticas tratáveis.
            </p>
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Quando fazer o teste?</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 dark:text-green-400 font-medium">1º ao 20º dia de vida - MELHOR MOMENTO</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-yellow-700 dark:text-yellow-400">Primeiro ano - BOM</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-700 dark:text-red-400">Maior que 1 ano - NÃO RECOMENDADO</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.open('https://www.babytest.com.br/', '_blank')}
                className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-all duration-200 shadow-medium flex items-center justify-center gap-2"
              >
                <TestTube2 className="w-5 h-5" />
                Acessar Site Oficial
              </button>
              <button
                onClick={() => window.open('https://www.babytest.com.br/', '_blank')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-medium"
              >
                Falar com Especialista
              </button>
            </div>
          </div>
          <div className="relative h-64 md:h-full min-h-[300px] rounded-xl overflow-hidden bg-pink-100">
            <img
              src="https://i.imgur.com/JPBuHrw.jpg"
              alt="Babytest by OLLIN"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-sm font-medium">Teste de Triagem Neonatal</p>
              <p className="text-xs opacity-90">Prepare-se para a Maternidade com Confiança!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desapega das Mamães Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-pink-500" />
              Desapega das Mamães
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Compre e venda itens de bebê com outras mães da comunidade
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {desapegaProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
            >
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=${encodeURIComponent(product.name)}`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {product.avatar}
                  </div>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {product.author}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-700">
                  <span className="text-xl font-bold text-pink-500">
                    {product.price}
                  </span>
                  <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg">
                    <Heart className="w-4 h-4" />
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          ))}
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


