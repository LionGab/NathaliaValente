import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../ProductCard';
import { mockProducts } from '../../../../test/mocks/supabase';

// Mock do contexto do carrinho
const mockAddToCart = vi.fn();
const mockRemoveFromCart = vi.fn();
const mockIsInCart = vi.fn();

vi.mock('../../../../contexts/CartContext', () => ({
  useCart: () => ({
    addToCart: mockAddToCart,
    removeFromCart: mockRemoveFromCart,
    isInCart: mockIsInCart
  })
}));

// Mock do componente Button
vi.mock('../../../../components/ui/Button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  )
}));

// Mock do componente Card
vi.mock('../../../../components/ui/Card', () => ({
  Card: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  )
}));

// Mock do componente OptimizedImage
vi.mock('../../../../components/ui/OptimizedImage', () => ({
  OptimizedImage: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  )
}));

describe('ProductCard', () => {
  const mockProduct = mockProducts[0];

  beforeEach(() => {
    vi.clearAllMocks();
    mockIsInCart.mockReturnValue(false);
  });

  it('deve renderizar informações do produto corretamente', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(/R\$/)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${mockProduct.rating}`))).toBeInTheDocument();
  });

  it('deve mostrar badge "Esgotado" quando stock=0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} />);

    expect(screen.getByText(/esgotado/i)).toBeInTheDocument();
  });

  it('deve mostrar badge "Poucos itens" quando stock <= 5', () => {
    const lowStockProduct = { ...mockProduct, stock: 3 };
    render(<ProductCard product={lowStockProduct} />);

    expect(screen.getByText(/poucos itens/i)).toBeInTheDocument();
  });

  it('deve chamar addToCart quando botão "Adicionar" é clicado', () => {
    render(<ProductCard product={mockProduct} />);

    const addButton = screen.getByText(/adicionar/i);
    fireEvent.click(addButton);

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('deve chamar removeFromCart quando produto já está no carrinho', () => {
    mockIsInCart.mockReturnValue(true);
    render(<ProductCard product={mockProduct} />);

    const removeButton = screen.getByText(/remover/i);
    fireEvent.click(removeButton);

    expect(mockRemoveFromCart).toHaveBeenCalledWith(mockProduct.id);
  });

  it('deve desabilitar botão quando produto está esgotado', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} />);

    const addButton = screen.getByText(/esgotado/i);
    expect(addButton).toBeDisabled();
  });
});
