/**
 * Serviço para gerenciar imagens específicas da NAVA
 * Baseado nas imagens exatas enviadas pelo usuário
 */

export interface NavaSpecificImage {
    id: string;
    name: string;
    src: string;
    fallbackSrc: string;
    alt: string;
    description: string;
    price: string;
    paymentInfo: string;
    category: string;
    model: string;
    features: string[];
}

export class NavaSpecificImagesService {
    private static readonly FALLBACK_BASE_URL = 'https://via.placeholder.com/400x600/FF69B4/FFFFFF?text=NAVA+';

    // URLs das imagens específicas da NAVA baseadas nas descrições exatas
    private static readonly NAVA_SPECIFIC_IMAGES: NavaSpecificImage[] = [
        {
            id: 'zebra-bikini-specific',
            name: 'Biquíni Zebra',
            src: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
            fallbackSrc: `${this.FALLBACK_BASE_URL}Zebra`,
            alt: 'Biquíni Zebra NAVA - Modelo com estampa zebra preta e branca, sentada em cadeira de vime',
            description: 'Conjunto Biquíni Nathy - Zebra com Preto sem Bojo com Alças Ajustáveis e Forro Macio em Poliamida para Praia e Piscina',
            price: 'R$ 165,00',
            paymentInfo: '2x de R$ 82,50 sem juros',
            category: 'bikinis',
            model: 'Mulher com cabelos ruivos, sentada em cadeira de vime com almofadas listradas',
            features: ['Estampa zebra preta e branca', 'Top halter triangular', 'Alças finas pretas', 'Fecho metálico na frente', 'Fio dental com tiras finas pretas']
        },
        {
            id: 'leopard-bikini-specific',
            name: 'Biquíni Oncinha',
            src: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
            fallbackSrc: `${this.FALLBACK_BASE_URL}Leopard`,
            alt: 'Biquíni Oncinha NAVA - Modelo com estampa oncinha, close-up do torso',
            description: 'Conjunto Biquíni Nathy - Onça com preto sem Bojo com Alças Ajustáveis e Forro Macio em Poliamida para Praia e Piscina',
            price: 'R$ 165,00',
            paymentInfo: '2x de R$ 82,50 sem juros',
            category: 'bikinis',
            model: 'Mulher com pele bronzeada, close-up do torso com piercing dérmico',
            features: ['Estampa oncinha em tons de marrom e preto', 'Top halter triangular', 'Alças finas pretas', 'Piercing dérmico no centro do peito', 'Tatuagem de lótus']
        },
        {
            id: 'zebra-pink-bikini-specific',
            name: 'Biquíni Zebra Rosa',
            src: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
            fallbackSrc: `${this.FALLBACK_BASE_URL}Pink+Zebra`,
            alt: 'Biquíni Zebra Rosa NAVA - Modelo com estampa zebra e contorno rosa vibrante',
            description: 'Conjunto Biquíni Nathy - Zebra com Rosa sem Bojo com Alças Ajustáveis e Forro Macio em Poliamida para Praia e Piscina',
            price: 'R$ 165,00',
            paymentInfo: '2x de R$ 82,50 sem juros',
            category: 'bikinis',
            model: 'Mulher com cabelos ruivos em rabo de cavalo, em pé na praia',
            features: ['Estampa zebra preta e branca', 'Contorno rosa vibrante', 'Top halter triangular', 'Fio dental', 'Tatuagem de escorpião na coxa direita']
        },
        {
            id: 'white-bikini-specific',
            name: 'Biquíni Branco',
            src: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
            fallbackSrc: `${this.FALLBACK_BASE_URL}White`,
            alt: 'Biquíni Branco NAVA - Modelo clássico em branco tirando selfie no espelho',
            description: 'Conjunto Biquíni Nathy - Todo Branco sem Bojo com Alças Ajustáveis e Forro Macio em Poliamida para Praia e Piscina',
            price: 'R$ 165,00',
            paymentInfo: '2x de R$ 82,50 sem juros',
            category: 'bikinis',
            model: 'Mulher com cabelos ruivos tirando selfie no espelho',
            features: ['Biquíni branco de duas peças', 'Top halter triangular', 'Piercing dérmico no centro do peito', 'Colar de contas brancas finas', 'Tatuagens no braço esquerdo e torso']
        },
        {
            id: 'mother-baby-hero-specific',
            name: 'Hero Mãe e Bebê',
            src: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
            fallbackSrc: `${this.FALLBACK_BASE_URL}Hero`,
            alt: 'Mãe e bebê - Nossa Maternidade - Momento terno entre mãe e bebê',
            description: 'O melhor para o seu bebê desde os primeiros dias de vida',
            price: '',
            paymentInfo: '',
            category: 'hero',
            model: 'Mãe segurando bebê com sorriso terno',
            features: ['Momentos especiais', 'Cuidado materno', 'Desenvolvimento infantil', 'Bem-estar familiar']
        }
    ];

    /**
     * Obtém todas as imagens específicas da NAVA
     */
    static getAllSpecificImages(): NavaSpecificImage[] {
        return this.NAVA_SPECIFIC_IMAGES;
    }

    /**
     * Obtém imagens específicas por categoria
     */
    static getSpecificImagesByCategory(category: string): NavaSpecificImage[] {
        return this.NAVA_SPECIFIC_IMAGES.filter(img => img.category === category);
    }

    /**
     * Obtém uma imagem específica por ID
     */
    static getSpecificImageById(id: string): NavaSpecificImage | undefined {
        return this.NAVA_SPECIFIC_IMAGES.find(img => img.id === id);
    }

    /**
     * Obtém as imagens específicas dos best sellers
     */
    static getSpecificBestSellers(): NavaSpecificImage[] {
        return this.NAVA_SPECIFIC_IMAGES.filter(img => img.category === 'bikinis');
    }

    /**
     * Obtém a imagem hero específica
     */
    static getSpecificHeroImage(): NavaSpecificImage | undefined {
        return this.NAVA_SPECIFIC_IMAGES.find(img => img.category === 'hero');
    }

    /**
     * Verifica se uma imagem específica existe
     */
    static async checkSpecificImageExists(src: string): Promise<boolean> {
        try {
            const response = await fetch(src, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * Pré-carrega todas as imagens específicas
     */
    static async preloadSpecificImages(): Promise<void> {
        const imagePromises = this.NAVA_SPECIFIC_IMAGES.map(img => {
            return new Promise<void>((resolve) => {
                const image = new Image();
                image.onload = () => resolve();
                image.onerror = () => resolve(); // Continua mesmo se falhar
                image.src = img.src;
            });
        });

        await Promise.all(imagePromises);
    }

    /**
     * Obtém informações detalhadas de um produto
     */
    static getProductDetails(id: string): NavaSpecificImage | undefined {
        return this.NAVA_SPECIFIC_IMAGES.find(img => img.id === id);
    }
}
