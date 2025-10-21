import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPost, deletePost, updatePost, uploadPostImage, addNathyBadge } from '../posts.service';
import { supabase } from '../../lib/supabase';
import * as validation from '../../utils/validation';
import * as imageCompression from '../../utils/imageCompression';

// Mock dependencies
vi.mock('../../lib/supabase');
vi.mock('../../utils/validation');
vi.mock('../../utils/imageCompression');

describe('Posts Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      const mockPost = {
        id: 'post-1',
        user_id: 'user-123',
        caption: 'Test caption',
        category: 'Fé',
        created_at: new Date().toISOString(),
      };

      (validation.validatePost as any).mockReturnValue({ valid: true });
      (supabase.from as any).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockPost, error: null }),
          }),
        }),
      });

      const result = await createPost({
        userId: 'user-123',
        caption: 'Test caption',
        category: 'Fé' as any,
      });

      expect(result.success).toBe(true);
      expect(result.post).toEqual(mockPost);
    });

    it('should return error if validation fails', async () => {
      (validation.validatePost as any).mockReturnValue({
        valid: false,
        error: 'Caption is required',
      });

      const result = await createPost({
        userId: 'user-123',
        caption: '',
        category: 'Fé' as any,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Caption is required');
    });

    it('should handle database errors', async () => {
      (validation.validatePost as any).mockReturnValue({ valid: true });
      (supabase.from as any).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: new Error('DB Error') }),
          }),
        }),
      });

      const result = await createPost({
        userId: 'user-123',
        caption: 'Test',
        category: 'Fé' as any,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      (supabase.from as any).mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        }),
      });

      const result = await deletePost('post-1', 'user-123');

      expect(result.success).toBe(true);
    });

    it('should handle deletion errors', async () => {
      (supabase.from as any).mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: new Error('Delete failed') }),
          }),
        }),
      });

      const result = await deletePost('post-1', 'user-123');

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('uploadPostImage', () => {
    it('should compress and upload image successfully', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockCompressedFile = new File(['compressed'], 'test.jpg', { type: 'image/jpeg' });

      (imageCompression.smartCompressImage as any).mockResolvedValue({
        file: mockCompressedFile,
        compressed: true,
        stats: { originalSize: 1000, compressedSize: 500, savedPercentage: 50 },
      });

      (supabase.storage.from as any).mockReturnValue({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/image.jpg' },
        }),
      });

      const result = await uploadPostImage(mockFile, 'user-123');

      expect(result.success).toBe(true);
      expect(result.url).toBe('https://example.com/image.jpg');
      expect(result.compressionStats).toBeTruthy();
    });

    it('should handle upload errors', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      (imageCompression.smartCompressImage as any).mockResolvedValue({
        file: mockFile,
        compressed: false,
      });

      (supabase.storage.from as any).mockReturnValue({
        upload: vi.fn().mockResolvedValue({ error: new Error('Upload failed') }),
      });

      const result = await uploadPostImage(mockFile, 'user-123');

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('addNathyBadge', () => {
    it('should add badge successfully', async () => {
      (supabase.from as any).mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: null }),
      });

      const result = await addNathyBadge('post-1');

      expect(result.success).toBe(true);
    });

    it('should handle badge errors', async () => {
      (supabase.from as any).mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: new Error('Badge failed') }),
      });

      const result = await addNathyBadge('post-1');

      expect(result.success).toBe(false);
    });
  });
});
