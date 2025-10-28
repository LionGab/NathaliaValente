import { supabase } from '../lib/supabase';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  is_user: boolean;
  created_at: string;
  updated_at?: string;
  metadata?: {
    type?: 'text' | 'image' | 'file' | 'system';
    file_url?: string;
    file_name?: string;
    file_size?: number;
    reply_to?: string;
    reactions?: Record<string, string[]>;
  };
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  type: 'direct' | 'group' | 'community';
  participants: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  last_message?: ChatMessage;
  unread_count?: number;
  is_archived?: boolean;
  settings?: {
    allow_media: boolean;
    allow_files: boolean;
    allow_reactions: boolean;
    mute_until?: string;
  };
}

export interface TypingIndicator {
  user_id: string;
  user_name: string;
  is_typing: boolean;
  timestamp: string;
}

class SupabaseRealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();
  private typingTimeouts: Map<string, NodeJS.Timeout> = new Map();

  // Chat Messages
  async sendMessage(roomId: string, message: string, metadata?: any): Promise<ChatMessage | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          user_id: user.id,
          message,
          is_user: true,
          metadata
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  async getMessages(roomId: string, limit: number = 50, offset: number = 0): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async updateMessage(messageId: string, updates: Partial<ChatMessage>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update(updates)
        .eq('id', messageId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating message:', error);
      return false;
    }
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  }

  // Chat Rooms
  async createRoom(name: string, type: 'direct' | 'group' | 'community', participants: string[]): Promise<ChatRoom | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('chat_rooms')
        .insert({
          name,
          type,
          participants: [...participants, user.id],
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating room:', error);
      return null;
    }
  }

  async getRooms(): Promise<ChatRoom[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          last_message:chat_messages!last_message_id (
            id,
            message,
            created_at,
            user_id
          )
        `)
        .contains('participants', [user.id])
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching rooms:', error);
      return [];
    }
  }

  async joinRoom(roomId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('chat_room_participants')
        .insert({
          room_id: roomId,
          user_id: user.id,
          joined_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error joining room:', error);
      return false;
    }
  }

  async leaveRoom(roomId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('chat_room_participants')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error leaving room:', error);
      return false;
    }
  }

  // Real-time subscriptions
  subscribeToRoom(roomId: string, onMessage: (message: ChatMessage) => void, onTyping?: (typing: TypingIndicator) => void): RealtimeChannel {
    const channelName = `room:${roomId}`;
    
    // Unsubscribe from existing channel if it exists
    if (this.channels.has(channelName)) {
      this.unsubscribeFromRoom(roomId);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload: RealtimePostgresChangesPayload<ChatMessage>) => {
          onMessage(payload.new as ChatMessage);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload: RealtimePostgresChangesPayload<ChatMessage>) => {
          onMessage(payload.new as ChatMessage);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload: RealtimePostgresChangesPayload<ChatMessage>) => {
          // Handle message deletion
          console.log('Message deleted:', payload.old);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);

    // Subscribe to typing indicators if callback provided
    if (onTyping) {
      this.subscribeToTyping(roomId, onTyping);
    }

    return channel;
  }

  subscribeToTyping(roomId: string, onTyping: (typing: TypingIndicator) => void): RealtimeChannel {
    const channelName = `typing:${roomId}`;
    
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'typing' }, (payload) => {
        onTyping(payload.payload as TypingIndicator);
      })
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  async sendTypingIndicator(roomId: string, isTyping: boolean): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const channelName = `typing:${roomId}`;
      const channel = this.channels.get(channelName);
      
      if (channel) {
        await channel.send({
          type: 'broadcast',
          event: 'typing',
          payload: {
            user_id: user.id,
            user_name: user.user_metadata?.full_name || 'Usuário',
            is_typing: isTyping,
            timestamp: new Date().toISOString()
          }
        });

        // Auto-stop typing after 3 seconds
        if (isTyping) {
          const timeoutId = setTimeout(() => {
            this.sendTypingIndicator(roomId, false);
          }, 3000);
          
          // Clear existing timeout
          const existingTimeout = this.typingTimeouts.get(roomId);
          if (existingTimeout) {
            clearTimeout(existingTimeout);
          }
          
          this.typingTimeouts.set(roomId, timeoutId);
        } else {
          const existingTimeout = this.typingTimeouts.get(roomId);
          if (existingTimeout) {
            clearTimeout(existingTimeout);
            this.typingTimeouts.delete(roomId);
          }
        }
      }
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  }

  unsubscribeFromRoom(roomId: string): void {
    const channelName = `room:${roomId}`;
    const channel = this.channels.get(channelName);
    
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }

    // Also unsubscribe from typing
    const typingChannelName = `typing:${roomId}`;
    const typingChannel = this.channels.get(typingChannelName);
    
    if (typingChannel) {
      supabase.removeChannel(typingChannel);
      this.channels.delete(typingChannelName);
    }
  }

  // Message reactions
  async addReaction(messageId: string, emoji: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('message_reactions')
        .insert({
          message_id: messageId,
          user_id: user.id,
          emoji
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding reaction:', error);
      return false;
    }
  }

  async removeReaction(messageId: string, emoji: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('emoji', emoji);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing reaction:', error);
      return false;
    }
  }

  // File uploads
  async uploadFile(file: File, roomId: string): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `chat-files/${roomId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat-files')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }

  // Cleanup
  cleanup(): void {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
    
    this.typingTimeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });
    this.typingTimeouts.clear();
  }
}

// Create singleton instance
export const supabaseRealtimeService = new SupabaseRealtimeService();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  supabaseRealtimeService.cleanup();
});

export default supabaseRealtimeService;
