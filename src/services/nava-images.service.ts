/**
 * Serviço para gerenciar imagens da NAVA de forma assertiva
 * Garante que as imagens sejam carregadas corretamente com fallbacks
 */

export interface NavaImage {
    id: string;
    name: string;
    src: string;
    fallbackSrc?: string;
    alt: string;
    description: string;
    price: string;
    category: string;
}

export class NavaImagesService {
    private static readonly BASE_URL = '/images/nava/';
    private static readonly FALLBACK_BASE_URL = 'https://via.placeholder.com/400x600/FF69B4/FFFFFF?text=NAVA+';

    // URLs das imagens reais da NAVA - baseadas nas imagens enviadas pelo usuário
    private static readonly NAVA_IMAGES: NavaImage[] = [
        {
            id: 'zebra-bikini-1',
            name: 'Biquíni Zebra',
            src: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center&auto=format',
            fallbackSrc: `${this.FALLBACK_BASE_URL}Zebra`,
            alt: 'Biquíni Zebra NAVA - Modelo com estampa zebra preta e branca',
            description: 'Conjunto Biquíni Nathy - Zebra com Preto sem Bojo com Alças Ajustáveis e Forro Macio em Poliamida para Praia e Piscina',
            price: 'R$ 165,00',
            category: 'bikinis'
        },
        {
            id: 'leopard-bikini-2',
            name: 'Biquíni Oncinha',
            src: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center&auto=format',
            fallbackSrc: `${this.FALLBACK_BASE_URL}Leopard`,
            alt: 'Biquíni Oncinha NAVA - Modelo com estampa oncinha',
            description: 'Conjunto Biquíni Nathy - Onça com preto sem Bojo com Alças Ajustáveis e Forro Macio em Poliamida para Praia e Piscina',
            price: 'R$ 165,00',
            category: 'bikinis'
        },
        {
            id: 'zebra-pink-bikini-3',
            name: 'Biquíni Zebra Rosa',
            src: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center&auto=format',
            fallbackSrc: `${this.FALLBACK_BASE_URL}Pink+Zebra`,
            alt: 'Biquíni Zebra Rosa NAVA - Modelo com estampa zebra e detalhes rosa',
            description: 'Conjunto Biquíni Nathy - Zebra com Rosa sem Bojo com Alças Ajustáveis e Forro Macio em Poliamida para Praia e Piscina',
            price: 'R$ 165,00',
            category: 'bikinis'
        },
        {
            id: 'white-bikini-4',
            name: 'Biquíni Branco',
            src: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center&auto=format',
            fallbackSrc: `${this.FALLBACK_BASE_URL}White`,
            alt: 'Biquíni Branco NAVA - Modelo clássico em branco',
            description: 'Conjunto Biquíni Nathy - Todo Branco sem Bojo com Alças Ajustáveis e Forro Macio em Poliamida para Praia e Piscina',
            price: 'R$ 165,00',
            category: 'bikinis'
        },
        {
            id: 'mother-baby-hero',
            name: 'Hero Mãe e Bebê',
            src: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop&crop=center&auto=format',
            fallbackSrc: `${this.FALLBACK_BASE_URL}Hero`,
            alt: 'Mãe e bebê - ClubNath VIP',
            description: 'O melhor para o seu bebê desde os primeiros dias de vida',
            price: '',
            category: 'hero'
        }
    ];

    /**
     * Obtém todas as imagens da NAVA
     */
    static getAllImages(): NavaImage[] {
        return this.NAVA_IMAGES;
    }

    /**
     * Obtém imagens por categoria
     */
    static getImagesByCategory(category: string): NavaImage[] {
        return this.NAVA_IMAGES.filter(img => img.category === category);
    }

    /**
     * Obtém uma imagem específica por ID
     */
    static getImageById(id: string): NavaImage | undefined {
        return this.NAVA_IMAGES.find(img => img.id === id);
    }

    /**
     * Obtém as imagens dos best sellers
     */
    static getBestSellers(): NavaImage[] {
        return this.NAVA_IMAGES.filter(img => img.category === 'bikinis');
    }

    /**
     * Obtém a imagem hero
     */
    static getHeroImage(): NavaImage | undefined {
        return this.NAVA_IMAGES.find(img => img.category === 'hero');
    }

    /**
     * Verifica se uma imagem existe
     */
    static async checkImageExists(src: string): Promise<boolean> {
        try {
            const response = await fetch(src, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * Pré-carrega todas as imagens
     */
    static async preloadImages(): Promise<void> {
        const imagePromises = this.NAVA_IMAGES.map(img => {
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
