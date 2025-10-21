import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useWebShare } from '../useWebShare';

describe('useWebShare', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('deve detectar se Web Share API é suportada', () => {
    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: vi.fn(),
    });

    const { result } = renderHook(() => useWebShare());
    expect(result.current.isSupported).toBe(true);
  });

  it('deve detectar quando Web Share API não é suportada', () => {
    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useWebShare());
    expect(result.current.isSupported).toBe(false);
  });

  it('deve compartilhar com sucesso quando API é suportada', async () => {
    const mockShare = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: mockShare,
    });

    const { result } = renderHook(() => useWebShare());

    const shareData = {
      title: 'Título do Post',
      text: 'Descrição do post',
      url: 'https://clubnath.app/post/123',
    };

    await act(async () => {
      await result.current.share(shareData);
    });

    expect(mockShare).toHaveBeenCalledWith(shareData);
    expect(result.current.error).toBeNull();
    expect(result.current.isSharing).toBe(false);
  });

  it('deve lançar erro quando API não é suportada', async () => {
    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useWebShare());

    await expect(async () => {
      await result.current.share({ title: 'Test' });
    }).rejects.toThrow('Web Share API não é suportada neste navegador');
  });

  it('deve lidar com cancelamento do usuário (AbortError)', async () => {
    const abortError = new Error('User cancelled');
    abortError.name = 'AbortError';

    const mockShare = vi.fn().mockRejectedValue(abortError);
    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: mockShare,
    });

    const { result } = renderHook(() => useWebShare());

    await act(async () => {
      try {
        await result.current.share({ title: 'Test' });
      } catch {
        // Esperado - usuário cancelou
      }
    });

    expect(result.current.error).toBeNull();
    expect(result.current.isSharing).toBe(false);
  });

  it('deve lidar com outros erros', async () => {
    const genericError = new Error('Network error');
    const mockShare = vi.fn().mockRejectedValue(genericError);
    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: mockShare,
    });

    const { result } = renderHook(() => useWebShare());

    await expect(async () => {
      await result.current.share({ title: 'Test' });
    }).rejects.toThrow('Network error');

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });

  it('deve atualizar isSharing durante o compartilhamento', async () => {
    let resolveShare: () => void;
    const sharePromise = new Promise<void>((resolve) => {
      resolveShare = resolve;
    });

    const mockShare = vi.fn().mockReturnValue(sharePromise);
    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: mockShare,
    });

    const { result } = renderHook(() => useWebShare());

    let sharePromiseResult: Promise<void>;
    act(() => {
      sharePromiseResult = result.current.share({ title: 'Test' });
    });

    expect(result.current.isSharing).toBe(true);

    await act(async () => {
      resolveShare!();
      await sharePromiseResult;
    });

    expect(result.current.isSharing).toBe(false);
  });
});
