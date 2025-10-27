import { TestTube2, PersonStanding, ShoppingBag, Heart } from 'lucide-react';
import { NathTipsSection } from './NathTipsSection';

export const StorePage = () => {
  // Produtos para Desapega das Mamães
  const desapegaProducts = [
    {
      id: 1,
      name: 'Carrinho Galzerano Preto',
      price: 'R$ 450,00',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
      author: 'Ana S.',
      avatar: 'AS',
      backgroundColor: 'bg-gradient-to-br from-gray-100 to-gray-200'
    },
    {
      id: 2,
      name: 'Berço de madeira maciça',
      price: 'R$ 700,00',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=400&fit=crop&crop=center',
      author: 'Mariana L.',
      avatar: 'ML',
      backgroundColor: 'bg-gradient-to-br from-amber-50 to-orange-100'
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
      avatar: 'CD',
      backgroundColor: 'bg-gradient-to-br from-teal-50 to-mint-100'
    },
    {
      id: 5,
      name: 'Bebê conforto Maxi-Cosi',
      price: 'R$ 350,00',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
      author: 'Patricia M.',
      avatar: 'PM',
      backgroundColor: 'bg-gradient-to-br from-neutral-50 to-stone-100'
    },
    {
      id: 6,
      name: 'Mochila de bebê Ergobaby',
      price: 'R$ 280,00',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&crop=center',
      author: 'Fernanda R.',
      avatar: 'FR',
      backgroundColor: 'bg-gradient-to-br from-gray-50 to-gray-100'
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
        <div className="text-center space-y-6">
          {/* Texto acima */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <TestTube2 className="h-8 w-8 text-primary-500" />
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white">
                Babytest by OLLIN
              </h3>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed max-w-4xl mx-auto">
              O melhor para o seu bebê desde os primeiros dias de vida. O Babytest by OLLIN investiga mais de 600 doenças genéticas tratáveis.
            </p>
          </div>

          {/* Imagem abaixo */}
          <div className="relative h-64 md:h-80 max-w-2xl mx-auto rounded-xl overflow-hidden bg-pink-100">
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

          {/* Botão centralizado */}
          <div className="flex justify-center">
            <button
              onClick={() => window.open('https://www.babytest.com.br/', '_blank')}
              className="bg-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-all duration-200 shadow-medium flex items-center justify-center gap-2"
            >
              <TestTube2 className="w-5 h-5" />
              ACESSAR O SITE APENAS
            </button>
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
              <div className={`relative h-48 overflow-hidden ${product.backgroundColor || 'bg-gradient-to-br from-pink-100 to-purple-100'}`}>
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

      {/* Dicas da Nath Section */}
      <NathTipsSection maxItems={4} />

    </div>
  );
};


