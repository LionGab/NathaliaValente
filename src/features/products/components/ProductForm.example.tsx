import React, { useState } from 'react';
import {
    validateCreateProduct,
    safeValidate,
    createProductSchema,
    type CreateProductInput
} from '../validation';

interface ProductFormProps {
    onSubmit: (product: CreateProductInput) => void;
    onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Partial<CreateProductInput>>({
        name: '',
        price: 0,
        category: 'roupas',
        stock: 0,
        description: ''
    });

    const [errors, setErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: keyof CreateProductInput, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Limpar erros quando usuário começar a digitar
        if (errors.length > 0) {
            setErrors([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors([]);

        try {
            // Validação com Zod
            const validatedData = validateCreateProduct(formData);

            // Se chegou aqui, os dados são válidos
            onSubmit(validatedData);

        } catch (error) {
            // Tratamento de erro com safeValidate para melhor UX
            const result = safeValidate(createProductSchema, formData);

            if (!result.success) {
                setErrors(result.errors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Adicionar Produto</h2>

            {/* Exibir erros de validação */}
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

            {/* Campo Nome */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Produto *
                </label>
                <input
                    type="text"
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Bikini Premium Nathália"
                />
            </div>

            {/* Campo Preço */}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                />
            </div>

            {/* Campo Categoria */}
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
                    <option value="roupas">Roupas</option>
                    <option value="cuidados">Cuidados</option>
                    <option value="acessorios">Acessórios</option>
                    <option value="brinquedos">Brinquedos</option>
                </select>
            </div>

            {/* Campo Estoque */}
            <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                    Estoque *
                </label>
                <input
                    type="number"
                    id="stock"
                    min="0"
                    value={formData.stock || ''}
                    onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                />
            </div>

            {/* Campo Descrição */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                </label>
                <textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descrição do produto..."
                />
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
                </button>
            </div>
        </form>
    );
};

// Exemplo de uso do componente
export const ProductFormExample: React.FC = () => {
    const handleSubmit = (product: CreateProductInput) => {
        console.log('Produto válido:', product);
        // Aqui você faria a chamada para a API
    };

    const handleCancel = () => {
        console.log('Formulário cancelado');
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
    );
};
