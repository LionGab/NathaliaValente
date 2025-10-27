import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    validateProduct,
    validateCreateProduct,
    validateUpdateProduct,
    validateProductFilters,
    safeValidate,
    type Product,
    type CreateProductInput,
    type UpdateProductInput,
    type ProductFilters
} from '../validation';

// Mock data para demonstração
const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Bikini Premium Nathália',
        price: 89.90,
        category: 'roupas',
        currentStock: 15,
        description: 'Bikini confortável e elegante para o verão',
        shortDescription: 'Bikini premium com design exclusivo',
        status: 'ativo',
        isActive: true,
        isFeatured: true,
        isNew: true,
        isOnSale: false,
        tags: ['bikini', 'verão', 'praia', 'conforto'],
        averageRating: 4.8,
        totalReviews: 124,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '2',
        name: 'Conjunto Bikini Nathy',
        price: 129.90,
        originalPrice: 159.90,
        category: 'roupas',
        currentStock: 8,
        description: 'Conjunto completo de bikini com top e calcinha',
        shortDescription: 'Conjunto completo premium',
        status: 'ativo',
        isActive: true,
        isFeatured: false,
        isNew: false,
        isOnSale: true,
        tags: ['conjunto', 'bikini', 'verão', 'promoção'],
        averageRating: 4.6,
        totalReviews: 89,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Simulação de API calls
const productService = {
    async getProducts(filters?: ProductFilters): Promise<Product[]> {
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 500));

        let products = [...mockProducts];

        if (filters) {
            // Aplicar filtros
            if (filters.search) {
                products = products.filter(p =>
                    p.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
                    p.description?.toLowerCase().includes(filters.search!.toLowerCase())
                );
            }

            if (filters.category) {
                products = products.filter(p => p.category === filters.category);
            }

            if (filters.minPrice) {
                products = products.filter(p => p.price >= filters.minPrice!);
            }

            if (filters.maxPrice) {
                products = products.filter(p => p.price <= filters.maxPrice!);
            }

            if (filters.inStock) {
                products = products.filter(p => p.currentStock! > 0);
            }

            if (filters.minRating) {
                products = products.filter(p => (p.averageRating || 0) >= filters.minRating!);
            }

            // Ordenação
            products.sort((a, b) => {
                const field = filters.sortBy || 'createdAt';
                const order = filters.sortOrder || 'desc';

                let aValue = a[field as keyof Product];
                let bValue = b[field as keyof Product];

                if (typeof aValue === 'string') aValue = aValue.toLowerCase();
                if (typeof bValue === 'string') bValue = bValue.toLowerCase();

                if (order === 'asc') {
                    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
                } else {
                    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
                }
            });
        }

        // Validar todos os produtos antes de retornar
        const validatedProducts: Product[] = [];
        for (const product of products) {
            const result = safeValidate(validateProduct, product);
            if (result.success) {
                validatedProducts.push(result.data);
            } else {
                console.warn('Produto inválido ignorado:', product.id, result.errors);
            }
        }

        return validatedProducts;
    },

    async getProductById(id: string): Promise<Product | null> {
        await new Promise(resolve => setTimeout(resolve, 300));

        const product = mockProducts.find(p => p.id === id);
        if (!product) return null;

        // Validar produto antes de retornar
        const result = safeValidate(validateProduct, product);
        if (!result.success) {
            console.error('Produto inválido:', result.errors);
            return null;
        }

        return result.data;
    },

    async createProduct(data: CreateProductInput): Promise<Product> {
        await new Promise(resolve => setTimeout(resolve, 800));

        // Validar dados de entrada
        const validatedData = validateCreateProduct(data);

        const newProduct: Product = {
            ...validatedData,
            id: Math.random().toString(36).substr(2, 9),
            status: 'ativo',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Validar produto criado
        const result = safeValidate(validateProduct, newProduct);
        if (!result.success) {
            throw new Error(`Produto criado é inválido: ${result.errors.join(', ')}`);
        }

        mockProducts.push(result.data);
        return result.data;
    },

    async updateProduct(data: UpdateProductInput): Promise<Product> {
        await new Promise(resolve => setTimeout(resolve, 600));

        // Validar dados de entrada
        const validatedData = validateUpdateProduct(data);

        const index = mockProducts.findIndex(p => p.id === data.id);
        if (index === -1) {
            throw new Error('Produto não encontrado');
        }

        const updatedProduct: Product = {
            ...mockProducts[index],
            ...validatedData,
            updatedAt: new Date().toISOString()
        };

        // Validar produto atualizado
        const result = safeValidate(validateProduct, updatedProduct);
        if (!result.success) {
            throw new Error(`Produto atualizado é inválido: ${result.errors.join(', ')}`);
        }

        mockProducts[index] = result.data;
        return result.data;
    },

    async deleteProduct(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 400));

        const index = mockProducts.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Produto não encontrado');
        }

        mockProducts.splice(index, 1);
    }
};

// Hook para buscar produtos
export function useProducts(filters?: ProductFilters) {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: () => productService.getProducts(filters),
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
}

// Hook para buscar produto por ID
export function useProduct(id: string) {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.getProductById(id),
        enabled: !!id,
    });
}

// Hook para criar produto
export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productService.createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error) => {
            console.error('Erro ao criar produto:', error);
        },
    });
}

// Hook para atualizar produto
export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productService.updateProduct,
        onSuccess: (updatedProduct) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', updatedProduct.id] });
        },
        onError: (error) => {
            console.error('Erro ao atualizar produto:', error);
        },
    });
}

// Hook para deletar produto
export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productService.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error) => {
            console.error('Erro ao deletar produto:', error);
        },
    });
}

// Hook para validar filtros de produtos
export function useValidateProductFilters(filters: unknown) {
    try {
        const validatedFilters = validateProductFilters(filters);
        return { success: true, data: validatedFilters };
    } catch (error: any) {
        return {
            success: false,
            errors: error.errors?.map((err: any) => err.message) || ['Filtros inválidos']
        };
    }
}
