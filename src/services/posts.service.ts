/**
 * Posts Service
 * Centralized business logic for posts management
 * Handles CRUD operations, image uploads, and badge management
 */

import { supabase } from '../lib/supabase';
import type { Post } from '../hooks';
import type { Category } from '../constants';
import { validatePostData } from '../utils/validation';
import { smartCompressImage } from '../utils/imageCompression';
import { supabaseWithRetry } from '../lib/apiClient';
import { handleError } from '../lib/errorHandler';

/**
 * Creates a new post in the database
 * @param {Object} data - Post creation data
 * @param {string} data.userId - ID of the user creating the post
 * @param {string} data.caption - Post caption/content
 * @param {Category} data.category - Post category
 * @param {string} [data.imageUrl] - Optional image URL
 * @returns {Promise<{success: boolean, post?: Post, error?: string}>} Result with created post or error
 */
export async function createPost(data: {
  userId: string;
  caption: string;
  category: Category;
  imageUrl?: string;
}): Promise<{ success: boolean; post?: Post; error?: string }> {
  // Validate post data
  const validation = validatePostData({
    caption: data.caption,
    category: data.category,
    image_url: data.imageUrl,
  });

  if (!validation.isValid) {
    return { success: false, error: validation.errors.join(', ') };
  }

  try {
    const result = await supabaseWithRetry(
      () =>
        supabase
          .from('posts')
          .insert({
            user_id: data.userId,
            caption: data.caption,
            category: data.category,
            image_url: data.imageUrl,
          })
          .select()
          .single(),
      { feature: 'posts', retries: 2 }
    );

    if (!result.success) {
      const errorDetails = handleError(
        result.error || new Error('Failed to create post'),
        { userId: data.userId, action: 'create_post' },
        'posts'
      );
      return { success: false, error: errorDetails.userFriendlyMessage };
    }

    return { success: true, post: result.data as unknown as Post };
  } catch (err) {
    const errorDetails = handleError(
      err as Error,
      { userId: data.userId, action: 'create_post' },
      'posts'
    );
    return { success: false, error: errorDetails.userFriendlyMessage };
  }
}

/**
 * Deletes a post from the database
 * Only allows deletion if the post belongs to the specified user
 * @param {string} postId - ID of the post to delete
 * @param {string} userId - ID of the user requesting deletion
 * @returns {Promise<{success: boolean, error?: string}>} Result indicating success or failure
 */
export async function deletePost(
  postId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('posts').delete().eq('id', postId).eq('user_id', userId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error: 'Erro ao deletar publicação' };
  }
}

/**
 * Updates an existing post
 * Only allows updates if the post belongs to the specified user
 * @param {string} postId - ID of the post to update
 * @param {string} userId - ID of the user requesting the update
 * @param {Object} data - Updated post data
 * @param {string} [data.caption] - Updated caption
 * @param {Category} [data.category] - Updated category
 * @returns {Promise<{success: boolean, error?: string}>} Result indicating success or failure
 */
export async function updatePost(
  postId: string,
  userId: string,
  data: { caption?: string; category?: Category }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('posts')
      .update({
        caption: data.caption,
        category: data.category,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .eq('user_id', userId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error updating post:', error);
    return { success: false, error: 'Erro ao atualizar publicação' };
  }
}

/**
 * Uploads an image to Supabase Storage
 * Automatically compresses images before upload to save bandwidth and storage
 * Optimizes images to 1920x1080 max resolution with 85% quality
 * @param {File} file - Image file to upload
 * @param {string} userId - ID of the user uploading the image
 * @returns {Promise<{success: boolean, url?: string, error?: string, compressionStats?: object}>} Result with public URL or error
 */
export async function uploadPostImage(
  file: File,
  userId: string
): Promise<{
  success: boolean;
  url?: string;
  error?: string;
  compressionStats?: { originalSize: number; compressedSize: number; savedPercentage: number };
}> {
  try {
    // Smart compress image before upload (only if needed)
    const {
      file: compressedFile,
      compressed,
      stats,
    } = await smartCompressImage(file, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: 'image/jpeg',
    });

    const fileExt = 'jpg'; // Always use .jpg for compressed images
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `posts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(filePath, compressedFile, {
        cacheControl: '31536000', // 1 year cache (images are immutable with hash in filename)
        upsert: false,
        contentType: 'image/jpeg',
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from('post-images').getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
      compressionStats: compressed ? stats : undefined,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: 'Erro ao fazer upload da imagem' };
  }
}

/**
 * Adds Nathy Badge to a post
 * The Nathy Badge is a special endorsement from Nathália
 * @param {string} postId - ID of the post to badge
 * @returns {Promise<{success: boolean, error?: string}>} Result indicating success or failure
 */
export async function addNathyBadge(postId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('nathy_badges').insert({
      post_id: postId,
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error adding badge:', error);
    return { success: false, error: 'Erro ao adicionar badge' };
  }
}

/**
 * Removes Nathy Badge from a post
 * @param {string} postId - ID of the post to remove badge from
 * @returns {Promise<{success: boolean, error?: string}>} Result indicating success or failure
 */
export async function removeNathyBadge(
  postId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('nathy_badges').delete().eq('post_id', postId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error removing badge:', error);
    return { success: false, error: 'Erro ao remover badge' };
  }
}
