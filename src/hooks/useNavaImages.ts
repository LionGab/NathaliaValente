import { useState, useEffect } from 'react';
import {
  NavaSpecificImagesService,
  NavaSpecificImage,
} from '../services/nava-specific-images.service';

export interface UseNavaImagesReturn {
  bestSellers: NavaSpecificImage[];
  heroImage: NavaSpecificImage | undefined;
  imagesLoaded: boolean;
  loading: boolean;
  error: string | null;
}

export const useNavaImages = (): UseNavaImagesReturn => {
  const [bestSellers, setBestSellers] = useState<NavaSpecificImage[]>([]);
  const [heroImage, setHeroImage] = useState<NavaSpecificImage | undefined>();
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNavaImages = async () => {
      try {
        setLoading(true);
        setError(null);

        // Carregar dados das imagens específicas
        const bestSellersData = NavaSpecificImagesService.getSpecificBestSellers();
        const heroImageData = NavaSpecificImagesService.getSpecificHeroImage();

        setBestSellers(bestSellersData);
        setHeroImage(heroImageData);

        // Pré-carregar imagens específicas para melhor performance
        await NavaSpecificImagesService.preloadSpecificImages();

        setImagesLoaded(true);
      } catch (err) {
        console.error('Erro ao carregar imagens específicas da NAVA:', err);
        setError('Erro ao carregar imagens');
        setImagesLoaded(true); // Continua mesmo com erro
      } finally {
        setLoading(false);
      }
    };

    loadNavaImages();
  }, []);

  return {
    bestSellers,
    heroImage,
    imagesLoaded,
    loading,
    error,
  };
};
