import React, { useState } from 'react';
import {
    validateCreateProduct,
    validateUpdateProduct,
    safeValidate,
    createProductSchema,
    updateProductSchema,
    type CreateProductInput,
    type UpdateProductInput,
    type Product
} from '../validation';

/**
 * EXEMPLO DE INTEGRAÇÃO COMPLETA DA VALIDAÇÃO ZOD NA UI
 * 
 * Este componente demonstra como integrar a validação Zod em um formulário React,
 * incluindo validação em tempo real, tratamento de erros e feedback visual.
 */

interface ProductFormExampleProps {
    initialData?: Partial<Product>;
    onSubmit: (product: CreateProductInput | UpdateProductInput) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export const ProductFormExample: React.FC<ProductFormExampleProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isEditing = false
}) => {
    const [formData, setFormData] = useState<Partial<CreateProductInput | UpdateProductInput>>({
        name: '',
        price: 0,
        category: 'roupas',
        currentStock: 0,
        description: '',
        status: 'ativo',
        isActive: true,
        ...initialData
    });

    const [errors, setErrors] = useState<string[]>([]);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationHistory, setValidationHistory] = useState<string[]>([]);

    // Validação em tempo real para campos específicos
    const validateField = (field: string, value: any) => {
        try {
            let schema;

            // Escolher schema baseado no campo
            switch (field) {
                case 'name':
                    schema = createProductSchema.shape.name;
                    break;
                case 'price':
                    schema = createProductSchema.shape.price;
                    break;
                case 'currentStock':
                    schema = createProductSchema.shape.currentStock;
                    break;
                case 'category':
                    schema = createProductSchema.shape.category;
                    break;
                case 'description':
                    schema = createProductSchema.shape.description;
                    break;
                default:
                    return;
            }

            // Validar campo
            schema.parse(value);

            // Remover erro do campo se validação passou
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });

            // Adicionar ao histórico de validação
            setValidationHistory(prev => [
                ...prev.slice(-4), // Manter apenas os últimos 5
                `✅ Campo '${field}' validado com sucesso`
            ]);

        } catch (error: any) {
            if (error.errors?.[0]) {
                setFieldErrors(prev => ({
                    ...prev,
                    [field]: error.errors[0].message
                }));

                // Adicionar ao histórico de validação
                setValidationHistory(prev => [
                    ...prev.slice(-4),
                    `❌ Campo '${field}': ${error.errors[0].message}`
                ]);
            }
        }
    };

    const handleInputChange = (field: keyof (CreateProductInput | UpdateProductInput), value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));

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
                setValidationHistory(prev => [...prev, '✅ Dados de atualização validados com sucesso']);
            } else {
                // Validação para criação
                validatedData = validateCreateProduct(formData);
                setValidationHistory(prev => [...prev, '✅ Dados de criação validados com sucesso']);
            }

            // Se chegou aqui, os dados são válidos
            onSubmit(validatedData);

        } catch (error: any) {
            // Tratamento de erro com safeValidate para melhor UX
            const schema = isEditing ? updateProductSchema : createProductSchema;
            const result = safeValidate(schema, formData);

            if (!result.success) {
                setErrors(result.errors);

                // Mapear erros para campos específicos
                const fieldErrorMap: Record<string, string> = {};
                result.errors.forEach(error => {
                    const [field] = error.split(':');
                    if (field) {
                        fieldErrorMap[field.trim()] = error;
                    }
                });
                setFieldErrors(fieldErrorMap);

                setValidationHistory(prev => [
                    ...prev,
                    `❌ Validação falhou: ${result.errors.length} erro(s) encontrado(s)`
                ]);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Validação de formulário completo para preview
    const validateFormPreview = () => {
        const schema = isEditing ? updateProductSchema : createProductSchema;
        const result = safeValidate(schema, formData);

        if (result.success) {
            setValidationHistory(prev => [...prev, '✅ Formulário completo válido']);
        } else {
            setValidationHistory(prev => [...prev, `❌ Formulário inválido: ${result.errors.length} erro(s)`]);
        }

        return result;
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {isEditing ? 'Editar Produto' : 'Adicionar Produto'} - Validação Zod
                </h2>
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                    ✕
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulário Principal */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Ex: Bikini Premium Nathália"
                                />
                                {fieldErrors.name && (
                                    <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
                                )}
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
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors.price ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="0.00"
                                />
                                {fieldErrors.price && (
                                    <p className="text-red-500 text-sm mt-1">{fieldErrors.price}</p>
                                )}
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
                                <label htmlFor="currentStock" className="block text-sm font-medium text-gray-700 mb-1">
                                    Estoque *
                                </label>
                                <input
                                    type="number"
                                    id="currentStock"
                                    min="0"
                                    value={formData.currentStock || ''}
                                    onChange={(e) => handleInputChange('currentStock', parseInt(e.target.value) || 0)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors.currentStock ? 'border-red-500' : 'border-gray-300'
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
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors.description ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Descrição detalhada do produto..."
                                />
                                {fieldErrors.description && (
                                    <p className="text-red-500 text-sm mt-1">{fieldErrors.description}</p>
                                )}
                            </div>
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
                                disabled={isSubmitting || Object.keys(fieldErrors).length > 0}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting ? 'Salvando...' : (isEditing ? 'Atualizar Produto' : 'Salvar Produto')}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Painel de Validação */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                        <h3 className="font-semibold text-gray-900">Validação em Tempo Real</h3>

                        {/* Botão de validação manual */}
                        <button
                            type="button"
                            onClick={validateFormPreview}
                            className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                            Validar Formulário
                        </button>

                        {/* Status dos campos */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700">Status dos Campos:</h4>
                            <div className="space-y-1 text-xs">
                                <div className={`flex items-center gap-2 ${fieldErrors.name ? 'text-red-600' : 'text-green-600'}`}>
                                    <span>{fieldErrors.name ? '❌' : '✅'}</span>
                                    <span>Nome</span>
                                </div>
                                <div className={`flex items-center gap-2 ${fieldErrors.price ? 'text-red-600' : 'text-green-600'}`}>
                                    <span>{fieldErrors.price ? '❌' : '✅'}</span>
                                    <span>Preço</span>
                                </div>
                                <div className={`flex items-center gap-2 ${fieldErrors.currentStock ? 'text-red-600' : 'text-green-600'}`}>
                                    <span>{fieldErrors.currentStock ? '❌' : '✅'}</span>
                                    <span>Estoque</span>
                                </div>
                                <div className={`flex items-center gap-2 ${fieldErrors.description ? 'text-red-600' : 'text-green-600'}`}>
                                    <span>{fieldErrors.description ? '❌' : '✅'}</span>
                                    <span>Descrição</span>
                                </div>
                            </div>
                        </div>

                        {/* Histórico de validação */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700">Histórico:</h4>
                            <div className="bg-white rounded p-2 max-h-32 overflow-y-auto text-xs space-y-1">
                                {validationHistory.length === 0 ? (
                                    <p className="text-gray-500">Nenhuma validação ainda</p>
                                ) : (
                                    validationHistory.map((entry, index) => (
                                        <div key={index} className="text-xs">
                                            {entry}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Estatísticas */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700">Estatísticas:</h4>
                            <div className="text-xs space-y-1">
                                <div>Campos com erro: {Object.keys(fieldErrors).length}</div>
                                <div>Validações realizadas: {validationHistory.length}</div>
                                <div>Status: {Object.keys(fieldErrors).length === 0 ? '✅ Válido' : '❌ Inválido'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Exemplo de uso do componente
export const ProductFormExampleUsage: React.FC = () => {
    const handleSubmit = (product: CreateProductInput | UpdateProductInput) => {
        console.log('Produto válido:', product);
        alert('Produto validado com sucesso!');
    };

    const handleCancel = () => {
        console.log('Formulário cancelado');
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <ProductFormExample
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isEditing={false}
            />
        </div>
    );
};
