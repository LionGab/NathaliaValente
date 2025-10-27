import { Product } from '../types/products';

export const products: Product[] = [
    // NAVA Products
    {
        id: 'nava-bikini-premium',
        name: 'Bikini Premium Nathália',
        brand: 'NAVA',
        category: 'bikinis',
        price: 165.00,
        originalPrice: 165.00,
        discount: 0,
        images: [
            'https://i.imgur.com/TjCevtA.jpg',
            'https://i.imgur.com/lU9GlUm.jpg',
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
            'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
        ],
        description: 'Bikini premium com design exclusivo da Nathália Valente. Tecido de alta qualidade, resistente ao cloro e com proteção UV. Perfeito para mães que querem se sentir confiantes e lindas.',
        sizes: ['P', 'M', 'G', 'GG'],
        colors: ['Preto', 'Branco', 'Rosa'],
        inStock: true,
        isNew: true,
        isFeatured: true,
        rating: 4.8,
        reviews: 127,
        tags: ['premium', 'nathalia', 'bikini', 'verão'],
        createdAt: '2024-01-15'
    },
    {
        id: 'nava-legging-yoga',
        name: 'Legging Yoga Comfort',
        brand: 'NAVA',
        category: 'leggings',
        price: 79.90,
        originalPrice: 99.90,
        discount: 20,
        images: [
            'https://i.imgur.com/lU9GlUm.jpg',
            '/images/products/heroes/mother-baby-hero-2.jpg'
        ],
        description: 'Legging perfeita para yoga, pilates e atividades físicas. Tecido elástico e respirável, ideal para mães ativas. Design pensado para o conforto e praticidade.',
        sizes: ['P', 'M', 'G', 'GG'],
        colors: ['Preto', 'Cinza', 'Rosa'],
        inStock: true,
        isFeatured: false,
        rating: 4.7,
        reviews: 89,
        tags: ['yoga', 'fitness', 'conforto', 'mães ativas'],
        createdAt: '2024-01-10'
    },
    {
        id: 'nava-conjunto-bikini-nathy',
        name: 'Conjunto Bikini Nathy',
        brand: 'NAVA',
        category: 'bikinis',
        price: 165.00,
        originalPrice: 165.00,
        discount: 0,
        images: [
            'https://i.imgur.com/lU9GlUm.jpg',
            'https://i.imgur.com/TjCevtA.jpg',
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
            'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
        ],
        description: 'Conjunto de bikini exclusivo da Nathália Valente. Design sofisticado e elegante, perfeito para mães que querem se sentir especiais na praia. Tecido de alta qualidade e modelagem que valoriza o corpo.',
        sizes: ['P', 'M', 'G', 'GG'],
        colors: ['Preto', 'Branco', 'Rosa'],
        inStock: true,
        isFeatured: true,
        rating: 4.9,
        reviews: 203,
        tags: ['conjunto', 'nathy', 'elegante', 'praia', 'exclusivo'],
        createdAt: '2024-01-05'
    },
    {
        id: 'nava-leopard-bikini',
        name: 'Bikini Leopard Elegance',
        brand: 'NAVA',
        category: 'bikinis',
        price: 99.90,
        images: [
            '/images/products/nava/nava-leopard-bikini.jpg',
            '/images/products/heroes/mother-baby-hero-1.jpg'
        ],
        description: 'Bikini com estampa leopard sofisticada. Para mães que não abrem mão do estilo e elegância. Modelagem que realça as curvas e tecido de primeira qualidade.',
        sizes: ['P', 'M', 'G', 'GG'],
        colors: ['Leopard Dourado', 'Leopard Preto'],
        inStock: true,
        rating: 4.9,
        reviews: 203,
        tags: ['leopard', 'elegante', 'sofisticado', 'luxo'],
        createdAt: '2024-01-01'
    },
    {
        id: 'nava-colecao-completa',
        name: 'Coleção Completa NAVA',
        brand: 'NAVA',
        category: 'colecoes',
        price: 299.90,
        originalPrice: 399.90,
        discount: 25,
        images: [
            '/images/products/nava/nava-colecao-completa.jpg',
            '/images/products/heroes/mother-baby-hero-2.jpg'
        ],
        description: 'Kit completo com os melhores produtos da NAVA. Inclui 2 bikinis, 1 legging e 1 acessório. Perfeito para mães que querem renovar o guarda-roupa com estilo.',
        sizes: ['P', 'M', 'G', 'GG'],
        colors: ['Kit Completo'],
        inStock: true,
        isFeatured: true,
        rating: 4.8,
        reviews: 67,
        tags: ['kit', 'coleção', 'completo', 'desconto'],
        createdAt: '2024-01-20'
    },

    // OLLIN Products (produto de beleza/cuidados)
    {
        id: 'ollin-serum-anti-idade',
        name: 'Sérum Anti-idade OLLIN',
        brand: 'OLLIN',
        category: 'acessorios',
        price: 149.90,
        originalPrice: 199.90,
        discount: 25,
        images: [
            '/images/products/ollin/ollin-product-1.jpg',
            '/images/products/ollin/ollin-product-2.jpg',
            '/images/nava/mother-baby-hero.jpg'
        ],
        description: 'Sérum anti-idade desenvolvido especialmente para mães. Fórmula natural e segura, perfeita para a rotina de cuidados pós-gravidez. Resultados visíveis em 30 dias.',
        sizes: ['30ml', '50ml'],
        colors: ['Transparente'],
        inStock: true,
        isNew: true,
        isFeatured: true,
        rating: 4.9,
        reviews: 234,
        tags: ['anti-idade', 'natural', 'mães', 'cuidados'],
        createdAt: '2024-01-18'
    },
    {
        id: 'ollin-hidratante-facial',
        name: 'Hidratante Facial OLLIN',
        brand: 'OLLIN',
        category: 'acessorios',
        price: 89.90,
        images: [
            '/images/products/ollin/ollin-product-2.jpg',
            '/images/products/ollin/ollin-product-3.jpg',
            '/images/nava/mother-baby-hero.jpg'
        ],
        description: 'Hidratante facial com ingredientes naturais, ideal para peles sensíveis de mães. Fórmula leve e não comedogênica, perfeita para o dia a dia.',
        sizes: ['50ml', '100ml'],
        colors: ['Transparente'],
        inStock: true,
        rating: 4.7,
        reviews: 178,
        tags: ['hidratante', 'facial', 'natural', 'sensível'],
        createdAt: '2024-01-12'
    },
    {
        id: 'ollin-kit-cuidados',
        name: 'Kit Cuidados OLLIN',
        brand: 'OLLIN',
        category: 'colecoes',
        price: 199.90,
        originalPrice: 279.90,
        discount: 28,
        images: [
            '/images/products/ollin/ollin-product-3.jpg',
            '/images/products/ollin/ollin-product-1.jpg',
            '/images/nava/mother-baby-hero.jpg'
        ],
        description: 'Kit completo de cuidados para mães. Inclui sérum anti-idade, hidratante facial e protetor solar. Rotina completa de beleza em um só kit.',
        sizes: ['Kit Completo'],
        colors: ['Kit Completo'],
        inStock: true,
        isFeatured: true,
        rating: 4.8,
        reviews: 92,
        tags: ['kit', 'cuidados', 'beleza', 'mães'],
        createdAt: '2024-01-25'
    },

    // Produtos Externos - Links para Lojas
    {
        id: 'nava-store-link',
        name: 'Coleção NAVA Bikinis',
        brand: 'NAVA',
        category: 'colecoes',
        price: 165.00,
        images: ['https://i.imgur.com/TjCevtA.jpg', 'https://i.imgur.com/lU9GlUm.jpg'],
        description: 'Bikinis exclusivos da Nathália Valente. Bikini Premium e Conjunto Bikini Nathy. R$ 165,00 no PIX ou em até 2x de R$ 82,50 sem juros. Acesse a loja completa!',
        link: 'https://www.navabeachwear.com.br/',
        isExternal: true,
        isFeatured: true,
        inStock: true,
        rating: 4.9,
        reviews: 342,
        tags: ['nava', 'bikinis', 'coleção', 'exclusivo', 'loja'],
        createdAt: '2024-01-25'
    },
    {
        id: 'ollin-babytest',
        name: 'BabyTest OLLIN',
        brand: 'OLLIN',
        category: 'maternidade',
        price: 49.90,
        images: [
            '/images/products/ollin/ollin-product-1.jpg',
            '/images/products/ollin/ollin-product-2.jpg',
            '/images/products/ollin/ollin-product-3.jpg'
        ],
        description: 'Teste de gravidez OLLIN. O melhor para o seu bebê desde os primeiros dias de vida.',
        link: 'https://ollin.com.br/babytest',
        isExternal: true,
        isFeatured: true,
        inStock: true,
        rating: 4.8,
        reviews: 156,
        tags: ['ollin', 'babytest', 'maternidade', 'gravidez', 'saúde'],
        createdAt: '2024-01-25'
    }
];

export const getProductsByBrand = (brand: 'NAVA' | 'OLLIN'): Product[] => {
    return products.filter(product => product.brand === brand);
};

export const getFeaturedProducts = (): Product[] => {
    return products.filter(product => product.isFeatured);
};

export const getNewProducts = (): Product[] => {
    return products.filter(product => product.isNew);
};

export const getProductById = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
    return products.filter(product => product.category === category);
};
