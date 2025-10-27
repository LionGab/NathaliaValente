import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { X, Image as ImageIcon, Upload, ShoppingBag } from 'lucide-react';
import { 
  validateProduct,
  safeValidate,
  type Product 
} from '../features/products/validation';

type CreatePostModalProps = {
  onClose: () => void;
  onPostCreated: () => void;
};

const CATEGORIES = ['Look do dia', 'Desabafo', 'Fé', 'Dica de mãe', 'Produto'] as const;

export const CreatePostModal = ({ onClose, onPostCreated }: CreatePostModalProps) => {
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // Estados para produtos
  const [productData, setProductData] = useState<Partial<Product>>({});
  const [productErrors, setProductErrors] = useState<string[]>([]);
  
  const { user } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validação de produto
  const validateProductData = (data: Partial<Product>) => {
    const result = safeValidate(validateProduct, data);
    if (!result.success) {
      setProductErrors(result.errors);
      return false;
    }
    setProductErrors([]);
    return true;
  };

  const handleProductDataChange = (field: keyof Product, value: unknown) => {
    const newData = { ...productData, [field]: value };
    setProductData(newData);
    
    // Validação em tempo real
    if (Object.keys(newData).length > 0) {
      validateProductData(newData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let imageUrl = null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage
          .from('posts')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from('posts').getPublicUrl(data.path);

        imageUrl = publicUrl;
      }

      const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        caption,
        category,
        image_url: imageUrl,
      });

      if (error) throw error;

      onPostCreated();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error creating post:', error);
      }
      alert('Erro ao criar publicação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 glass backdrop-blur-xl border-b border-claude-gray-200/50 dark:border-claude-gray-800/50 px-6 py-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-claude-gray-900 dark:text-white">
            Nova publicação
          </h2>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-claude-gray-100 dark:hover:bg-claude-gray-800 rounded-2xl transition-all duration-200"
          >
            <X className="w-5 h-5 text-claude-gray-600 dark:text-claude-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-claude-gray-700 dark:text-claude-gray-300 mb-3">
              Categoria
            </label>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-3.5 px-5 rounded-2xl font-semibold transition-all duration-200 ${
                    category === cat
                      ? 'bg-gradient-to-r from-claude-orange-500 to-claude-orange-600 text-white shadow-claude'
                      : 'bg-claude-gray-100 dark:bg-claude-gray-800 text-claude-gray-700 dark:text-claude-gray-300 hover:bg-claude-gray-200 dark:hover:bg-claude-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Formulário de produto quando categoria for "Produto" */}
          {category === 'Produto' && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Informações do Produto</h3>
              </div>

              {/* Erros de validação do produto */}
              {productErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <h4 className="text-red-800 font-semibold text-sm mb-2">Erros de validação:</h4>
                  <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                    {productErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome do produto */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    value={productData.name || ''}
                    onChange={(e) => handleProductDataChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Ex: Bikini Premium Nathália"
                  />
                </div>

                {/* Preço */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={productData.price || ''}
                    onChange={(e) => handleProductDataChange('price', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0.00"
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoria *
                  </label>
                  <select
                    value={productData.category || 'roupas'}
                    onChange={(e) => handleProductDataChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="roupas">Roupas</option>
                    <option value="cuidados">Cuidados</option>
                    <option value="acessorios">Acessórios</option>
                    <option value="brinquedos">Brinquedos</option>
                    <option value="maternidade">Maternidade</option>
                    <option value="nutricao">Nutrição</option>
                    <option value="seguranca">Segurança</option>
                  </select>
                </div>

                {/* Estoque */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estoque *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productData.currentStock || ''}
                    onChange={(e) => handleProductDataChange('currentStock', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={productData.sku || ''}
                    onChange={(e) => handleProductDataChange('sku', e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Ex: BIKINI-001"
                  />
                </div>
              </div>

              {/* Descrição do produto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição do Produto
                </label>
                <textarea
                  value={productData.description || ''}
                  onChange={(e) => handleProductDataChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Descrição detalhada do produto..."
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-claude-gray-700 dark:text-claude-gray-300 mb-3">
              O que você quer compartilhar?
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
              rows={5}
              className="input resize-none"
              placeholder="Compartilhe seu momento..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-claude-gray-700 dark:text-claude-gray-300 mb-3">
              Foto (opcional)
            </label>
            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full object-cover max-h-80" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="absolute top-3 right-3 p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-claude transition-all hover:scale-110"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-claude-gray-300 dark:border-claude-gray-700 rounded-2xl cursor-pointer hover:bg-claude-gray-50 dark:hover:bg-claude-gray-800/50 transition-all duration-200 group">
                <div className="flex flex-col items-center justify-center py-6">
                  <ImageIcon
                    className="w-10 h-10 text-claude-gray-400 mb-3 group-hover:text-claude-orange-500 transition-colors"
                    strokeWidth={2}
                  />
                  <p className="text-sm text-claude-gray-600 dark:text-claude-gray-400 font-medium">
                    Clique para adicionar uma foto
                  </p>
                  <p className="text-xs text-claude-gray-500 dark:text-claude-gray-500 mt-1">
                    PNG, JPG até 10MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !caption}
            className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2.5"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Publicando...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" strokeWidth={2.5} />
                Publicar
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
