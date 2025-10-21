/**
 * Saved Items Service
 * Business logic for saving and managing favorite content
 */

import { supabase } from '../lib/supabase';

export type SavedItemType = 'post' | 'quote' | 'verse';

/**
 * Save a post
 */
export async function savePost(
  userId: string,
  postId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('saved_items').insert({
      user_id: userId,
      post_id: postId,
      type: 'post',
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error saving post:', error);
    return { success: false, error: 'Erro ao salvar publicação' };
  }
}

/**
 * Unsave a post
 */
export async function unsavePost(
  userId: string,
  postId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('saved_items')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId)
      .eq('type', 'post');

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error unsaving post:', error);
    return { success: false, error: 'Erro ao remover publicação salva' };
  }
}

/**
 * Check if a post is saved
 */
export async function isPostSaved(
  userId: string,
  postId: string
): Promise<{ saved: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('saved_items')
      .select('id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .eq('type', 'post')
      .maybeSingle();

    if (error) throw error;

    return { saved: !!data };
  } catch (error) {
    console.error('Error checking saved status:', error);
    return { saved: false, error: 'Erro ao verificar status' };
  }
}

/**
 * Toggle save status for a post
 */
export async function toggleSavePost(
  userId: string,
  postId: string
): Promise<{ success: boolean; saved: boolean; error?: string }> {
  const { saved, error: checkError } = await isPostSaved(userId, postId);

  if (checkError) {
    return { success: false, saved: false, error: checkError };
  }

  if (saved) {
    const { success, error } = await unsavePost(userId, postId);
    return { success, saved: false, error };
  } else {
    const { success, error } = await savePost(userId, postId);
    return { success, saved: true, error };
  }
}

/**
 * Save a quote or verse
 */
export async function saveContent(
  userId: string,
  content: string,
  type: 'quote' | 'verse'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('saved_items').insert({
      user_id: userId,
      content,
      type,
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error saving content:', error);
    return { success: false, error: 'Erro ao salvar conteúdo' };
  }
}

/**
 * Delete a saved item
 */
export async function deleteSavedItem(
  userId: string,
  savedItemId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('saved_items')
      .delete()
      .eq('id', savedItemId)
      .eq('user_id', userId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting saved item:', error);
    return { success: false, error: 'Erro ao deletar item salvo' };
  }
}
