import { TestTube2, PersonStanding, Heart, ShoppingBag } from 'lucide-react';

export const StorePage = () => {
  // Mock products for "Desapega das mamães"
  const desapegaProducts = [
    {
      id: 1,
      name: 'Carrinho de bebê',
      price: 'R$ 450,00',
      image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&h=400&fit=crop',
      author: 'Ana S.',
      avatar: 'AS'
    },
    {
      id: 2,
      name: 'Berço de madeira',
      price: 'R$ 700,00',
      image: 'https://images.unsplash.com/photo-1582771498000-8ad44e6c84da?w=400&h=400&fit=crop',
      author: 'Mariana L.',
      avatar: 'ML'
    },
    {
      id: 3,
      name: 'Kit mamadeiras',
      price: 'R$ 80,00',
      image: 'https://images.unsplash.com/photo-1495121520760-9a50c47fd022?w=400&h=400&fit=crop',
      author: 'Julia C.',
      avatar: 'JC'
    },
    {
      id: 4,
      name: 'Cadeirão Chicco',
      price: 'R$ 300,00',
      image: 'https://images.unsplash.com/photo-1556506634-179f17277443?w=400&h=400&fit=crop',
      author: 'Carla D.',
      avatar: 'CD'
    }
  ];

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
              className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-shadow group cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x400?text=' + encodeURIComponent(product.name);
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
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
                  <button className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
