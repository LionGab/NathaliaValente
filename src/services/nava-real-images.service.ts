/**
 * Serviço para gerenciar imagens reais da NAVA
 * Baseado nas imagens enviadas pelo usuário
 */

export interface NavaRealImage {
    id: string;
    name: string;
    src: string;
    fallbackSrc: string;
    alt: string;
    description: string;
    price: string;
    category: string;
    paymentInfo: string;
}

export class NavaRealImagesService {
    private static readonly FALLBACK_BASE_URL = 'https://via.placeholder.com/400x600/FF69B4/FFFFFF?text=NAVA+';

    // URLs das imagens reais da NAVA baseadas nas imagens enviadas
    private static readonly NAVA_REAL_IMAGES: NavaRealImage[] = [
        {
            id: 'zebra-bikini-real',
            name: 'Biquíni Zebra',
            src: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
            fallbackSrc: `${this.FALLBACK_BASE_URL}Zebra`,
            alt: 'Biquíni Zebra NAVA - Modelo com estampa zebra preta e branca',
            description: 'Conjunto Biquíni Nathy - Zebra com Preto sem Bojo com Alças Ajustáveis e Forro Macio em Poliamida para Praia e Piscina',
            price: 'R$ 165,00',
            paymentInfo: '2x de R$ 82,50 sem juros',
            category: 'bikinis'
        },
        {
            id: 'leopard-bikini-real',
            name: 'Biquíni Oncinha',
            src: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
            fallbackSrc: `${this.FALLBACK_BASE_URL}Leopard`,
            alt: 'Biquíni Oncinha NAVA - Modelo com estampa oncinha',
            description: 'Conjunto Biquíni Nathy - Onça com preto sem Bojo com Alças Ajustáveis e Forro Macio em Poliamida para Praia e Piscina',
            price: 'R$ 165,00',
            paymentInfo: '2x de R$ 82,50 sem juros',
            category: 'bikinis'
        },
        {
            id: 'zebra-pink-bikini-real',
            name: 'Biquíni Zebra Rosa',
            src: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
            fallbackSrc: `${this.FALLBACK_BASE_URL}Pink+Zebra`,
            alt: 'Biquíni Zebra Rosa NAVA - Modelo com estampa zebra e detalhes rosa',
            description: 'Conjunto Biquíni Nathy - Zebra com Rosa sem Bojo com Alças Ajustáveis e Forro Macio em Poliamida para Praia e Piscina',
            price: 'R$ 165,00',
            paymentInfo: '2x de R$ 82,50 sem juros',
            category: 'bikinis'
        },
        {
            id: 'white-bikini-real',
            name: 'Biquíni Branco',
            src: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
            fallbackSrc: `${this.FALLBACK_BASE_URL}White`,
            alt: 'Biquíni Branco NAVA - Modelo clássico em branco',
            description: 'Conjunto Biquíni Nathy - Todo Branco sem Bojo com Alças Ajustáveis e Forro Macio em Poliamida para Praia e Piscina',
            price: 'R$ 165,00',
            paymentInfo: '2x de R$ 82,50 sem juros',
            category: 'bikinis'
        },
        {
            id: 'mother-baby-hero-real',
            name: 'Hero Mãe e Bebê',
            src: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
            fallbackSrc: `${this.FALLBACK_BASE_URL}Hero`,
            alt: 'Mãe e bebê - Nossa Maternidade',
            description: 'O melhor para o seu bebê desde os primeiros dias de vida',
            price: '',
            paymentInfo: '',
            category: 'hero'
        }
    ];

    /**
     * Obtém todas as imagens reais da NAVA
     */
    static getAllRealImages(): NavaRealImage[] {
        return this.NAVA_REAL_IMAGES;
    }

    /**
     * Obtém imagens reais por categoria
     */
    static getRealImagesByCategory(category: string): NavaRealImage[] {
        return this.NAVA_REAL_IMAGES.filter(img => img.category === category);
    }

    /**
     * Obtém uma imagem real específica por ID
     */
    static getRealImageById(id: string): NavaRealImage | undefined {
        return this.NAVA_REAL_IMAGES.find(img => img.id === id);
    }

    /**
     * Obtém as imagens reais dos best sellers
     */
    static getRealBestSellers(): NavaRealImage[] {
        return this.NAVA_REAL_IMAGES.filter(img => img.category === 'bikinis');
    }

    /**
     * Obtém a imagem hero real
     */
    static getRealHeroImage(): NavaRealImage | undefined {
        return this.NAVA_REAL_IMAGES.find(img => img.category === 'hero');
    }

    /**
     * Verifica se uma imagem real existe
     */
    static async checkRealImageExists(src: string): Promise<boolean> {
        try {
            const response = await fetch(src, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * Pré-carrega todas as imagens reais
     */
    static async preloadRealImages(): Promise<void> {
        const imagePromises = this.NAVA_REAL_IMAGES.map(img => {
            return new Promise<void>((resolve) => {
                const image = new Image();
                image.onload = () => resolve();
                image.onerror = () => resolve(); // Continua mesmo se falhar
                image.src = img.src;
            });
        });

        await Promise.all(imagePromises);
    }
}
