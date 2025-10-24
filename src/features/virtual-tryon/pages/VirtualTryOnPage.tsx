import React, { useState, useEffect } from 'react';
import { Camera, Shirt, Palette, Ruler, Star, ShoppingBag, Heart, Share2, RotateCcw, Maximize2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { arTryOnService, Product, UserMeasurements, VirtualTryOnResult } from '../services/ar-tryon.service';
import { useAuth } from '../../../contexts/AuthContext';

export const VirtualTryOnPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [userMeasurements, setUserMeasurements] = useState<UserMeasurements | null>(null);
  const [tryOnResult, setTryOnResult] = useState<VirtualTryOnResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [arPreview, setArPreview] = useState<'front' | 'side' | 'back'>('front');

  useEffect(() => {
    loadProducts();
    loadUserMeasurements();
  }, []);

  const loadProducts = async () => {
    try {
      // Mock products - in real implementation, would fetch from database
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Biquíni Premium NAVA',
          brand: 'NAVA',
          category: 'swimwear',
          price: 299.90,
          images: ['/images/bikini1.jpg', '/images/bikini2.jpg'],
          sizes: ['P', 'M', 'G', 'GG'],
          colors: ['Preto', 'Branco', 'Azul'],
          materials: ['Poliamida', 'Elastano'],
          description: 'Biquíni premium com tecnologia UV protection',
          features: ['UV Protection', 'Secagem Rápida', 'Resistente ao Cloro'],
          care_instructions: ['Lavar à mão', 'Não usar alvejante'],
          availability: true,
          rating: 4.8,
          reviews_count: 156
        },
        {
          id: '2',
          name: 'Legging Yoga NAVA',
          brand: 'NAVA',
          category: 'activewear',
          price: 199.90,
          images: ['/images/legging1.jpg'],
          sizes: ['P', 'M', 'G', 'GG'],
          colors: ['Preto', 'Rosa', 'Azul'],
          materials: ['Poliamida', 'Elastano'],
          description: 'Legging para yoga com tecnologia de compressão',
          features: ['Compressão', 'Transpirabilidade', 'Elasticidade'],
          care_instructions: ['Lavar na máquina', 'Não secar na máquina'],
          availability: true,
          rating: 4.6,
          reviews_count: 89
        }
      ];
      
      setProducts(mockProducts);
      if (mockProducts.length > 0) {
        setSelectedProduct(mockProducts[0]);
        setSelectedSize(mockProducts[0].sizes[0]);
        setSelectedColor(mockProducts[0].colors[0]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadUserMeasurements = async () => {
    if (!user) return;
    
    // Mock user measurements - in real implementation, would be stored in user profile
    const mockMeasurements: UserMeasurements = {
      height: 165,
      weight: 60,
      bust: 88,
      waist: 70,
      hips: 95,
      body_type: 'hourglass',
      skin_tone: 'medium',
      preferences: {
        fit_preference: 'fitted',
        style_preference: 'moderate',
        color_preference: ['Preto', 'Branco', 'Azul']
      }
    };
    
    setUserMeasurements(mockMeasurements);
  };

  const handleTryOn = async () => {
    if (!selectedProduct || !userMeasurements || !user) return;
    
    setIsLoading(true);
    try {
      const sessionId = crypto.randomUUID();
      
      // Initialize try-on session
      await arTryOnService.initializeTryOnSession(
        user.id,
        userMeasurements,
        { preferred_style: 'casual' }
      );
      
      // Try on the product
      const result = await arTryOnService.tryOnProduct(
        sessionId,
        selectedProduct.id,
        userMeasurements,
        selectedSize,
        selectedColor
      );
      
      if (result) {
        setTryOnResult(result);
      }
    } catch (error) {
      console.error('Error trying on product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderProductSelector = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Escolha o Produto
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              selectedProduct?.id === product.id
                ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
              <Shirt className="w-12 h-12 text-gray-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white">{product.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{product.brand}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-bold text-pink-600">R$ {product.price.toFixed(2)}</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{product.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProductOptions = () => {
    if (!selectedProduct) return null;
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Opções do Produto
        </h3>
        
        {/* Size Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tamanho
          </label>
          <div className="flex gap-2">
            {selectedProduct.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  selectedSize === size
                    ? 'border-pink-500 bg-pink-500 text-white'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        
        {/* Color Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cor
          </label>
          <div className="flex gap-2">
            {selectedProduct.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  selectedColor === color
                    ? 'border-pink-500 bg-pink-500 text-white'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
        
        {/* Try On Button */}
        <Button
          onClick={handleTryOn}
          disabled={isLoading || !userMeasurements}
          className="w-full bg-pink-500 hover:bg-pink-600"
        >
          <Camera className="w-4 h-4 mr-2" />
          {isLoading ? 'Processando...' : 'Experimentar Virtualmente'}
        </Button>
      </div>
    );
  };

  const renderMeasurements = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Suas Medidas
        </h3>
        <Button
          onClick={() => setShowMeasurements(!showMeasurements)}
          variant="outline"
          size="sm"
        >
          <Ruler className="w-4 h-4 mr-2" />
          {showMeasurements ? 'Ocultar' : 'Mostrar'}
        </Button>
      </div>
      
      {showMeasurements && userMeasurements && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Altura:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {userMeasurements.height} cm
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Peso:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {userMeasurements.weight} kg
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Busto:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {userMeasurements.bust} cm
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Cintura:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {userMeasurements.waist} cm
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Quadril:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {userMeasurements.hips} cm
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Tipo Corporal:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">
              {userMeasurements.body_type.replace('_', ' ')}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  const renderTryOnResult = () => {
    if (!tryOnResult) return null;
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Resultado da Experimentação
        </h3>
        
        {/* AR Preview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900 dark:text-white">Preview AR</h4>
            <div className="flex gap-2">
              <Button
                onClick={() => setArPreview('front')}
                variant={arPreview === 'front' ? 'default' : 'outline'}
                size="sm"
              >
                Frente
              </Button>
              <Button
                onClick={() => setArPreview('side')}
                variant={arPreview === 'side' ? 'default' : 'outline'}
                size="sm"
              >
                Lado
              </Button>
              <Button
                onClick={() => setArPreview('back')}
                variant={arPreview === 'back' ? 'default' : 'outline'}
                size="sm"
              >
                Costas
              </Button>
            </div>
          </div>
          
          <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <img
              src={tryOnResult.ar_preview[`${arPreview}_view`]}
              alt={`Preview ${arPreview}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
        
        {/* Fit Analysis */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Análise de Ajuste</h4>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                tryOnResult.fit_analysis.overall_fit === 'perfect' ? 'text-green-600' :
                tryOnResult.fit_analysis.overall_fit === 'good' ? 'text-blue-600' :
                tryOnResult.fit_analysis.overall_fit === 'fair' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {tryOnResult.fit_analysis.fit_score}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Ajuste</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">
                {tryOnResult.fit_analysis.comfort_prediction}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Conforto</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {tryOnResult.style_analysis.color_harmony}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Cor</div>
            </div>
          </div>
        </div>
        
        {/* Recommendations */}
        {tryOnResult.recommendations.styling_tips.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Dicas de Estilo</h4>
            <ul className="space-y-1">
              {tryOnResult.recommendations.styling_tips.map((tip, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                  <span className="text-pink-500 mt-1">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1 bg-pink-500 hover:bg-pink-600">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Comprar
          </Button>
          <Button variant="outline">
            <Heart className="w-4 h-4" />
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Provador Virtual AR
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Experimente produtos NAVA com tecnologia AR
              </p>
            </div>
            <Button variant="outline">
              <Maximize2 className="w-4 h-4 mr-2" />
              Tela Cheia
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-4xl mx-auto">
        {renderProductSelector()}
        {renderProductOptions()}
        {renderMeasurements()}
        {renderTryOnResult()}
      </div>
    </div>
  );
};
