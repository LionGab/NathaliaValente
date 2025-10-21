/**
 * Posts Service
 * Centralized business logic for posts
 */

import { supabase } from '../lib/supabase';
import type { Post } from '../hooks';
import type { Category } from '../constants';
import { validatePost } from '../utils/validation';

/**
 * Create a new post
 */
export async function createPost(data: {
  userId: string;
  caption: string;
  category: Category;
  imageUrl?: string;
}): Promise<{ success: boolean; post?: Post; error?: string }> {
  // Validate post data
  const validation = validatePost({
    caption: data.caption,
    category: data.category,
  });

  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        user_id: data.userId,
        caption: data.caption,
        category: data.category,
        image_url: data.imageUrl,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, post: post as unknown as Post };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, error: 'Erro ao criar publicação' };
  }
}

/**
 * Delete a post
 */
export async function deletePost(
  postId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', userId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error: 'Erro ao deletar publicação' };
  }
}

/**
 * Update a post
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
 * Upload image to Supabase Storage
 */
export async function uploadPostImage(
  file: File,
  userId: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `posts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from('post-images').getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: 'Erro ao fazer upload da imagem' };
  }
}

/**
 * Add Nathy Badge to a post
 */
export async function addNathyBadge(
  postId: string
): Promise<{ success: boolean; error?: string }> {
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
 * Remove Nathy Badge from a post
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
