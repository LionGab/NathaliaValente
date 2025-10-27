import { TestTube2, ShoppingBag, Heart } from 'lucide-react';
import { SimpleNathTips } from '../../../components/SimpleNathTips';
import { NAVAHeroSection } from '../../../components/NAVAHeroSection';

export const StorePage = () => {
  // Produtos para Desapega das Mamães
  const desapegaProducts = [
    {
      id: 1,
      name: 'Berço de Madeira Maciça',
      price: 'R$ 450,00',
      originalPrice: 'R$ 800,00',
      image: 'https://i.imgur.com/pElL8zD.jpg',
      author: 'Ana S.',
      avatar: 'AS',
      backgroundColor: 'bg-gradient-to-br from-amber-50 to-orange-100',
      condition: 'Usado 6 meses, conservado'
    },
    {
      id: 2,
      name: 'Bebê Conforto Premium',
      price: 'R$ 320,00',
      originalPrice: 'R$ 600,00',
      image: 'https://i.imgur.com/gxOThQR.jpg',
      author: 'Mariana L.',
      avatar: 'ML',
      backgroundColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      condition: 'Até 13kg, conservado'
    },
    {
      id: 3,
      name: 'Carrinho Galzerano Preto',
      price: 'R$ 450,00',
      originalPrice: 'R$ 800,00',
      image: 'https://i.imgur.com/DLPkytI.jpg',
      author: 'Julia C.',
      avatar: 'JC',
      backgroundColor: 'bg-gradient-to-br from-gray-100 to-gray-200',
      condition: 'Usado 8 meses, excelente estado'
    },
    {
      id: 4,
      name: 'Ergo Baby Carrier',
      price: 'R$ 180,00',
      originalPrice: 'R$ 300,00',
      image: 'https://i.imgur.com/6AOi9vY.jpg',
      author: 'Carla D.',
      avatar: 'CD',
      backgroundColor: 'bg-gradient-to-br from-purple-50 to-pink-100',
      condition: 'Pouco usado, limpo'
    },
    {
      id: 5,
      name: 'Enxoval de Berço Completo',
      price: 'R$ 280,00',
      originalPrice: 'R$ 450,00',
      image: 'https://i.imgur.com/76haTca.jpg',
      author: 'Patricia M.',
      avatar: 'PM',
      backgroundColor: 'bg-gradient-to-br from-green-50 to-emerald-100',
      condition: 'Novo, lacrado'
    },
    {
      id: 6,
      name: 'Produto Bebê Premium',
      price: 'R$ 120,00',
      originalPrice: 'R$ 200,00',
      image: 'https://i.imgur.com/tf0GHwz.jpg',
      author: 'Fernanda R.',
      avatar: 'FR',
      backgroundColor: 'bg-gradient-to-br from-rose-50 to-pink-100',
      condition: 'Usado 3 meses, conservado'
    },
    {
      id: 7,
      name: 'Produto Bebê Conforto',
      price: 'R$ 150,00',
      originalPrice: 'R$ 250,00',
      image: 'https://i.imgur.com/JoxFimc.jpg',
      author: 'Luciana T.',
      avatar: 'LT',
      backgroundColor: 'bg-gradient-to-br from-teal-50 to-cyan-100',
      condition: 'Excelente estado'
    },
    {
      id: 8,
      name: 'Produto Bebê Segurança',
      price: 'R$ 100,00',
      originalPrice: 'R$ 180,00',
      image: 'https://i.imgur.com/XvueTEk.jpg',
      author: 'Camila A.',
      avatar: 'CA',
      backgroundColor: 'bg-gradient-to-br from-indigo-50 to-blue-100',
      condition: 'Usado 4 meses, limpo'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 pb-24 space-y-12">
      {/* NAVA Hero Section */}
      <NAVAHeroSection />

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

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-700">
                  {/* Preço e Condição */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl font-bold text-green-600">
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-neutral-500 line-through">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                    {product.condition && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {product.condition}
                      </p>
                    )}
                  </div>

                  {/* Botão de Compra */}
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
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
      <SimpleNathTips />

    </div>
  );
};


