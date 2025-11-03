import React, { useState } from 'react';
import {
  validateCreateProduct,
  validateUpdateProduct,
  safeValidate,
  createProductSchema,
  updateProductSchema,
  type CreateProductInput,
  type UpdateProductInput,
  PRODUCT_CATEGORIES,
  PRODUCT_STATUS,
  AGE_RANGES,
} from '../validation';

interface ProductFormProps {
  initialData?: Partial<UpdateProductInput>;
  onSubmit: (product: CreateProductInput | UpdateProductInput) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<Partial<CreateProductInput | UpdateProductInput>>({
    name: '',
    price: 0,
    category: 'roupas',
    currentStock: 0,
    description: '',
    status: 'ativo',
    isActive: true,
    ...initialData,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Validação em tempo real para campos específicos
  const validateField = (field: string, value: unknown) => {
    try {
      if (field === 'name') {
        createProductSchema.shape.name.parse(value);
      } else if (field === 'price') {
        createProductSchema.shape.price.parse(value);
      } else if (field === 'currentStock') {
        createProductSchema.shape.currentStock.parse(value);
      }
      // Remove erro do campo se validação passou
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } catch (error: any) {
      if (error.errors?.[0]) {
        setFieldErrors((prev) => ({
          ...prev,
          [field]: error.errors[0].message,
        }));
      }
    }
  };

  const handleInputChange = (
    field: keyof (CreateProductInput | UpdateProductInput),
    value: unknown
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validação em tempo real
    validateField(field, value);

    // Limpar erros gerais quando usuário começar a digitar
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);
    setFieldErrors({});

    try {
      let validatedData;

      if (isEditing) {
        // Validação para edição
        validatedData = validateUpdateProduct(formData);
      } else {
        // Validação para criação
        validatedData = validateCreateProduct(formData);
      }

      // Se chegou aqui, os dados são válidos
      onSubmit(validatedData);
    } catch (error: unknown) {
      // Tratamento de erro com safeValidate para melhor UX
      const schema = isEditing ? updateProductSchema : createProductSchema;
      const result = safeValidate(schema, formData);

      if (!result.success) {
        setErrors(result.errors);

        // Mapear erros para campos específicos
        const fieldErrorMap: Record<string, string> = {};
        result.errors.forEach((error) => {
          const [field] = error.split(':');
          if (field) {
            fieldErrorMap[field.trim()] = error;
          }
        });
        setFieldErrors(fieldErrorMap);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Editar Produto' : 'Adicionar Produto'}
        </h2>
        <button type="button" onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {/* Exibir erros gerais de validação */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">Erros de validação:</h3>
          <ul className="list-disc list-inside text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome do Produto */}
        <div className="md:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Produto *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              fieldErrors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: Bikini Premium Nathália"
          />
          {fieldErrors.name && <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>}
        </div>

        {/* Preço */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Preço (R$) *
          </label>
          <input
            type="number"
            id="price"
            step="0.01"
            min="0"
            value={formData.price || ''}
            onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              fieldErrors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {fieldErrors.price && <p className="text-red-500 text-sm mt-1">{fieldErrors.price}</p>}
        </div>

        {/* Preço Original */}
        <div>
          <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Preço Original (R$)
          </label>
          <input
            type="number"
            id="originalPrice"
            step="0.01"
            min="0"
            value={formData.originalPrice || ''}
            onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        {/* Categoria */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Categoria *
          </label>
          <select
            id="category"
            value={formData.category || 'roupas'}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(PRODUCT_CATEGORIES).map(([key, value]) => (
              <option key={key} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={formData.status || 'ativo'}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(PRODUCT_STATUS).map(([key, value]) => (
              <option key={key} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Estoque */}
        <div>
          <label htmlFor="currentStock" className="block text-sm font-medium text-gray-700 mb-1">
            Estoque *
          </label>
          <input
            type="number"
            id="currentStock"
            min="0"
            value={formData.currentStock || ''}
            onChange={(e) => handleInputChange('currentStock', parseInt(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              fieldErrors.currentStock ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
          />
          {fieldErrors.currentStock && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.currentStock}</p>
          )}
        </div>

        {/* SKU */}
        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
            SKU
          </label>
          <input
            type="text"
            id="sku"
            value={formData.sku || ''}
            onChange={(e) => handleInputChange('sku', e.target.value.toUpperCase())}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: BIKINI-001"
          />
        </div>

        {/* Faixa Etária (para produtos infantis) */}
        <div>
          <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700 mb-1">
            Faixa Etária
          </label>
          <select
            id="ageRange"
            value={formData.ageRange || 'todas'}
            onChange={(e) => handleInputChange('ageRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(AGE_RANGES).map(([key, value]) => (
              <option key={key} value={value}>
                {value === 'todas' ? 'Todas as idades' : value}
              </option>
            ))}
          </select>
        </div>

        {/* Descrição */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Descrição detalhada do produto..."
          />
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags (separadas por vírgula)
          </label>
          <input
            type="text"
            id="tags"
            value={formData.tags?.join(', ') || ''}
            onChange={(e) => {
              const tags = e.target.value
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag);
              handleInputChange('tags', tags);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: bikini, verão, praia, conforto"
          />
        </div>
      </div>

      {/* Checkboxes para flags especiais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isActive || false}
            onChange={(e) => handleInputChange('isActive', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Ativo</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isFeatured || false}
            onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Destaque</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isNew || false}
            onChange={(e) => handleInputChange('isNew', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Novo</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isOnSale || false}
            onChange={(e) => handleInputChange('isOnSale', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Promoção</span>
        </label>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || Object.keys(fieldErrors).length > 0}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar Produto' : 'Salvar Produto'}
        </button>
      </div>
    </form>
  );
};
