import { TestTube2, ShoppingBag, Heart, Plus } from 'lucide-react';
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
      name: 'Kit Baby o Boticário',
      price: 'R$ 120,00',
      originalPrice: 'R$ 200,00',
      image: 'https://i.imgur.com/tf0GHwz.jpg',
      author: 'Fernanda R.',
      avatar: 'FR',
      backgroundColor: 'bg-gradient-to-br from-rose-50 to-pink-100',
      condition: 'Usado 3 meses, conservado'
    },
  ];

  return (
    <div className="w-full mx-auto px-3 py-3 pb-24 space-y-6 sm:px-4 sm:py-4 sm:space-y-8 lg:space-y-12">
      {/* NAVA Hero Section */}
      <NAVAHeroSection />

      {/* Babytest Section */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="text-center space-y-4 sm:space-y-6">
          {/* Texto acima */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <TestTube2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary-500" />
              <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                Babytest by OLLIN
              </h3>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto px-2">
              O melhor para o seu bebê desde os primeiros dias de vida. O Babytest by OLLIN investiga mais de 600 doenças genéticas tratáveis.
            </p>
          </div>

          {/* Imagem abaixo */}
          <div className="relative h-48 sm:h-64 md:h-80 max-w-2xl mx-auto rounded-xl overflow-hidden bg-pink-100">
            <img
              src="https://i.imgur.com/JPBuHrw.jpg"
              alt="Babytest by OLLIN"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 text-white">
              <p className="text-xs sm:text-sm font-medium">Teste de Triagem Neonatal</p>
              <p className="text-xs opacity-90">Prepare-se para a Maternidade com Confiança!</p>
            </div>
          </div>

          {/* Botão centralizado */}
          <div className="flex justify-center">
            <button
              onClick={() => window.open('https://www.babytest.com.br/', '_blank')}
              className="bg-pink-500 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl font-semibold hover:bg-pink-600 transition-all duration-200 shadow-medium flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <TestTube2 className="w-4 h-4 sm:w-5 sm:h-5" />
              ACESSAR O SITE APENAS
            </button>
          </div>
        </div>
      </div>

      {/* Primeiros Cuidados com o Recém-Nascido Section */}
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-3 sm:mb-4">
            Primeiros Cuidados com o Recém-Nascido
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto px-2">
            Tudo que você precisa saber para cuidar do seu bebê nos primeiros dias em casa
          </p>
        </div>

        {/* Cards de Cuidados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Alimentação */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl p-4 sm:p-6 shadow-lg border border-pink-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-pink-500 rounded-xl">
                <TestTube2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-pink-800">Alimentação</h3>
            </div>
            <ul className="space-y-1.5 sm:space-y-2 text-pink-700 text-sm sm:text-base">
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Amamentação em livre demanda</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Posição correta para amamentar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Como identificar fome e saciedade</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Armazenamento do leite materno</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Higiene */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-800">Higiene</h3>
            </div>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Banho do recém-nascido</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Cuidados com o coto umbilical</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Troca de fraldas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Limpeza dos olhos e nariz</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Sono */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-purple-800">Sono</h3>
            </div>
            <ul className="space-y-2 text-purple-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Posição segura para dormir</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Rotina de sono</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Ambiente ideal para o sono</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Como acalmar o bebê</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Desenvolvimento */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-800">Desenvolvimento</h3>
            </div>
            <ul className="space-y-2 text-green-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Marcos do desenvolvimento</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Estimulação precoce</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Reflexos do recém-nascido</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Brincadeiras adequadas</span>
              </li>
            </ul>
          </div>

          {/* Card 5: Saúde */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-6 shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-orange-800">Saúde</h3>
            </div>
            <ul className="space-y-2 text-orange-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Vacinação</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Quando procurar o pediatra</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Sinais de alerta</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Medicamentos seguros</span>
              </li>
            </ul>
          </div>

          {/* Card 6: Cuidados com a Mãe */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl p-6 shadow-lg border border-rose-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-rose-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-rose-800">Cuidados com a Mãe</h3>
            </div>
            <ul className="space-y-2 text-rose-700">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>Recuperação pós-parto</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>Cuidados com os seios</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>Alimentação da mãe</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>Bem-estar emocional</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Quer Aprender Mais?</h3>
          <p className="text-lg mb-6 opacity-90">
            Acesse nosso guia completo de primeiros cuidados com o recém-nascido
          </p>
          <button
            onClick={() => {
              // Navegar para página de guia completo
              window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
            }}
            className="bg-white text-pink-600 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Acessar Guia Completo
          </button>
        </div>
      </div>

      {/* Amamentação: Guia Completo para Mães Section */}
      <div className="space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">🤱</span>
            <h2 className="text-4xl font-bold text-neutral-900 dark:text-white">
              Amamentação: Guia Completo para Mães
            </h2>
          </div>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Dicas práticas e apoio emocional para uma amamentação bem-sucedida e prazerosa
          </p>
        </div>

        {/* Cards de Amamentação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Técnicas de Amamentação */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl p-6 shadow-lg border border-pink-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-pink-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-pink-800">Técnicas de Amamentação</h3>
            </div>
            <ul className="space-y-2 text-pink-700">
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Posições corretas para amamentar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Como fazer a pega adequada</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Sinais de fome e saciedade</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Frequência e duração das mamadas</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Desafios Comuns */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-800">Desafios Comuns</h3>
            </div>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Dores e fissuras nos mamilos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Ingurgitamento mamário</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Bebê que não quer mamar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Produção de leite insuficiente</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Alimentação da Mãe */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-800">Alimentação da Mãe</h3>
            </div>
            <ul className="space-y-2 text-green-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Alimentos que aumentam a produção</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Hidratação adequada</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Suplementação necessária</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Alimentos a evitar</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Armazenamento do Leite */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-purple-800">Armazenamento do Leite</h3>
            </div>
            <ul className="space-y-2 text-purple-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Como ordenhar corretamente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Conservação na geladeira</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Congelamento e descongelamento</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Equipamentos necessários</span>
              </li>
            </ul>
          </div>

          {/* Card 5: Apoio Emocional */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-6 shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-orange-800">Apoio Emocional</h3>
            </div>
            <ul className="space-y-2 text-orange-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Lidando com a pressão social</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Ansiedade e insegurança</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Busca por ajuda profissional</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Grupos de apoio</span>
              </li>
            </ul>
          </div>

          {/* Card 6: Amamentação e Trabalho */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl p-6 shadow-lg border border-rose-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-rose-500 rounded-xl">
                <TestTube2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-rose-800">Amamentação e Trabalho</h3>
            </div>
            <ul className="space-y-2 text-rose-700">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>Direitos da mãe trabalhadora</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>Como manter a produção</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>Ordenha no local de trabalho</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>Transição para mamadeira</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">🤱 Quer Aprender Mais sobre Amamentação?</h3>
          <p className="text-lg mb-6 opacity-90">
            Acesse nosso guia completo de amamentação com dicas práticas e apoio emocional
          </p>
          <button
            onClick={() => {
              // Navegar para página de amamentação
              window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'tools' } }));
            }}
            className="bg-white text-pink-600 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Acessar Guia de Amamentação
          </button>
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
                  <button
                    onClick={() => {
                      // Adicionar produto ao carrinho ou mostrar modal de compra
                      alert(`Produto "${product.name}" adicionado ao carrinho!`);
                    }}
                    className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
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

      {/* FAB - Floating Action Button */}
      <button
        onClick={() => {
          // Navegar para página de criação de post ou adicionar item
          window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feed' } }));
        }}
        className="fixed bottom-20 right-4 w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-40 group hover:scale-110"
        aria-label="Adicionar item"
      >
        <Plus className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
      </button>
    </div>
  );
};


