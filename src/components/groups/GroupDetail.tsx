// =====================================================
// CLUBNATH GRUPOS TEMÁTICOS - DETALHES DO GRUPO
// Santuário Digital de Empatia e Pertencimento
// =====================================================

import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Users,
  MessageCircle,
  Heart,
  Share2,
  MoreVertical,
  Pin,
  Edit3,
  Trash2,
  UserPlus,
  Settings,
  Send,
  Image,
  Smile,
  Paperclip,
  ChevronDown,
  ChevronUp,
  Crown,
  Shield,
  User,
  Bell,
  BellOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { groupsService } from '../../services/groups.service';
import { Group, GroupPost, ReactionType, GroupMember } from '../../types/groups';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Button } from '../ui/Button';
import {
  getCategoryColor,
  getCategoryIcon,
  formatGroupMemberCount,
  formatGroupAge,
  REACTION_EMOJIS,
  REACTION_LABELS,
  canManageGroup,
  canModerateGroup
} from '../../types/groups';
import { useAuth } from '../../contexts/AuthContext';
import { useHapticFeedback } from '../../hooks/useGestures';

interface GroupDetailProps {
  groupId: string;
  onBack?: () => void;
  onEdit?: (groupId: string) => void;
  onInvite?: (groupId: string) => void;
}

export const GroupDetail: React.FC<GroupDetailProps> = ({
  groupId,
  onBack,
  onEdit,
  onInvite
}) => {
  const { user } = useAuth();
  const { triggerHaptic } = useHapticFeedback();
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Queries
  const { data: group, isLoading: groupLoading } = useQuery({
    queryKey: ['group', groupId],
    queryFn: () => groupsService.getGroup(groupId)
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['group-posts', groupId],
    queryFn: () => groupsService.getGroupPosts(groupId, { groupId, limit: 50 })
  });

  const { data: members = [] } = useQuery({
    queryKey: ['group-members', groupId],
    queryFn: () => groupsService.getGroupMembers(groupId, { groupId, limit: 100 })
  });

  // Mutations
  const createPostMutation = useMutation({
    mutationFn: (content: string) => groupsService.createGroupPost(groupId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-posts', groupId] });
      setNewPost('');
      triggerHaptic('light');
    }
  });

  const reactToPostMutation = useMutation({
    mutationFn: ({ postId, reaction }: { postId: string; reaction: ReactionType }) =>
      groupsService.reactToPost(postId, reaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-posts', groupId] });
      triggerHaptic('light');
    }
  });

  const joinGroupMutation = useMutation({
    mutationFn: () => groupsService.joinGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['group-members', groupId] });
      triggerHaptic('medium');
    }
  });

  const leaveGroupMutation = useMutation({
    mutationFn: () => groupsService.leaveGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['group-members', groupId] });
      triggerHaptic('medium');
      onBack?.();
    }
  });

  // Auto-scroll para novas mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [posts]);

  const handleSendPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || createPostMutation.isPending) return;

    await createPostMutation.mutateAsync(newPost.trim());
  };

  const handleReactToPost = async (postId: string, reaction: ReactionType) => {
    await reactToPostMutation.mutateAsync({ postId, reaction });
    setShowReactions(null);
  };

  const handleJoinGroup = async () => {
    await joinGroupMutation.mutateAsync();
  };

  const handleLeaveGroup = async () => {
    if (window.confirm('Tem certeza que deseja sair deste grupo?')) {
      await leaveGroupMutation.mutateAsync();
    }
  };

  const handleShareGroup = async () => {
    if (navigator.share && group) {
      try {
        await navigator.share({
          title: group.name,
          text: group.description,
          url: window.location.href
        });
        triggerHaptic('light');
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    }
  };

  if (groupLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Carregando grupo..." />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Grupo não encontrado
          </h2>
          <Button onClick={onBack} variant="outline">
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const isMember = !!group.user_role;
  const canManage = canManageGroup(group.user_role);
  const canModerate = canModerateGroup(group.user_role);

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{getCategoryIcon(group.category)}</span>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                {group.name}
              </h1>
              {group.is_private && (
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
              )}
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {formatGroupMemberCount(group.current_members)}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {posts.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isMember && (
              <Button
                onClick={() => setIsMuted(!isMuted)}
                variant="ghost"
                size="icon"
                className="p-2"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-gray-400" />
                ) : (
                  <Volume2 className="w-5 h-5 text-gray-600" />
                )}
              </Button>
            )}

            <Button
              onClick={handleShareGroup}
              variant="ghost"
              size="icon"
              className="p-2"
            >
              <Share2 className="w-5 h-5" />
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="p-2"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Principal */}
        <div className="flex-1 flex flex-col">
          {/* Info do Grupo */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                  {group.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryColor(group.category)}`}>
                    {group.category}
                  </span>
                  <span>Criado {formatGroupAge(group.created_at)}</span>
                  {group.creator && (
                    <span>por {group.creator.full_name}</span>
                  )}
                </div>
              </div>

              {!isMember && (
                <Button
                  onClick={handleJoinGroup}
                  disabled={joinGroupMutation.isPending || group.current_members >= group.max_members}
                  className="ml-4"
                >
                  {group.current_members >= group.max_members ? 'Grupo Cheio' : 'Entrar no Grupo'}
                </Button>
              )}

              {isMember && (
                <div className="flex items-center gap-2 ml-4">
                  {canManage && (
                    <Button
                      onClick={() => onEdit?.(groupId)}
                      variant="outline"
                      size="sm"
                      leftIcon={<Edit3 className="w-4 h-4" />}
                    >
                      Editar
                    </Button>
                  )}

                  <Button
                    onClick={handleLeaveGroup}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                  >
                    Sair
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Lista de Posts */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {postsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner text="Carregando mensagens..." />
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <GroupPostItem
                  key={post.id}
                  post={post}
                  onReact={handleReactToPost}
                  showReactions={showReactions === post.id}
                  onShowReactions={() => setShowReactions(showReactions === post.id ? null : post.id)}
                  canModerate={canModerate}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhuma mensagem ainda
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Seja a primeira a compartilhar algo neste grupo!
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de Nova Mensagem */}
          {isMember && (
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <form onSubmit={handleSendPost} className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Compartilhe algo com o grupo..."
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendPost(e);
                      }
                    }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="p-2"
                  >
                    <Image className="w-5 h-5" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="p-2"
                  >
                    <Smile className="w-5 h-5" />
                  </Button>

                  <Button
                    type="submit"
                    disabled={!newPost.trim() || createPostMutation.isPending}
                    size="icon"
                    className="p-2"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar de Membros */}
        {showMembers && (
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Membros ({members.length})
                </h3>
                <Button
                  onClick={() => setShowMembers(false)}
                  variant="ghost"
                  size="icon"
                  className="p-1"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    {member.user?.avatar_url ? (
                      <img
                        src={member.user.avatar_url}
                        alt={member.user.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {member.user?.full_name?.charAt(0) || 'U'}
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {member.user?.full_name}
                        </span>
                        {member.role === 'admin' && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                        {member.role === 'moderator' && (
                          <Shield className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {member.role === 'admin' ? 'Administradora' :
                          member.role === 'moderator' ? 'Moderadora' : 'Membro'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botão para mostrar membros */}
      {!showMembers && (
        <Button
          onClick={() => setShowMembers(true)}
          variant="ghost"
          size="sm"
          className="absolute bottom-20 right-4 shadow-lg"
          leftIcon={<Users className="w-4 h-4" />}
        >
          {members.length}
        </Button>
      )}
    </div>
  );
};

// =====================================================
// COMPONENTE DE POST DO GRUPO
// =====================================================

interface GroupPostItemProps {
  post: GroupPost;
  onReact: (postId: string, reaction: ReactionType) => void;
  showReactions: boolean;
  onShowReactions: () => void;
  canModerate: boolean;
}

const GroupPostItem: React.FC<GroupPostItemProps> = ({
  post,
  onReact,
  showReactions,
  onShowReactions,
  canModerate
}) => {
  const { user } = useAuth();
  const { triggerHaptic } = useHapticFeedback();

  const handleReact = (reaction: ReactionType) => {
    onReact(post.id, reaction);
  };

  const isOwnPost = post.user_id === user?.id;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
      {/* Header do Post */}
      <div className="flex items-start gap-3 mb-3">
        {post.user?.avatar_url ? (
          <img
            src={post.user.avatar_url}
            alt={post.user.full_name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {post.user?.full_name?.charAt(0) || 'U'}
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 dark:text-white text-sm">
              {post.user?.full_name}
            </span>
            {post.is_pinned && (
              <Pin className="w-4 h-4 text-yellow-500" />
            )}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(post.created_at).toLocaleString('pt-BR')}
          </span>
        </div>

        {canModerate && (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="p-1">
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="p-1 text-red-500">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Conteúdo do Post */}
      <div className="mb-4">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {post.content}
        </p>

        {post.media_url && (
          <div className="mt-3 rounded-xl overflow-hidden">
            <img
              src={post.media_url}
              alt="Mídia do post"
              className="w-full max-h-64 object-cover"
            />
          </div>
        )}
      </div>

      {/* Reações */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Object.entries(post.reactions_count || {}).map(([reaction, count]) => (
            count > 0 && (
              <button
                key={reaction}
                onClick={() => handleReact(reaction as ReactionType)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all ${post.user_reaction === reaction
                  ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                <span>{REACTION_EMOJIS[reaction as ReactionType]}</span>
                <span>{count}</span>
              </button>
            )
          ))}

          <Button
            onClick={onShowReactions}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-pink-500"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        <Button variant="ghost" size="sm" className="text-gray-500">
          <MessageCircle className="w-4 h-4" />
        </Button>
      </div>

      {/* Seletor de Reações */}
      {showReactions && (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div className="flex items-center gap-2">
            {Object.entries(REACTION_EMOJIS).map(([reaction, emoji]) => (
              <button
                key={reaction}
                onClick={() => handleReact(reaction as ReactionType)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={REACTION_LABELS[reaction as ReactionType]}
              >
                <span className="text-lg">{emoji}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
