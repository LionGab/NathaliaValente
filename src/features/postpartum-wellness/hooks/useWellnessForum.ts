/**
 * React Query hooks for Wellness Forum
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WellnessForumRepository } from '../repositories';
import type {
  CreateTopicRequest,
  CreateReplyRequest,
  ForumFilters,
  PaginationParams,
} from '../../../types/postpartum-wellness';

// Query keys
export const forumKeys = {
  all: ['wellness-forum'] as const,
  topics: () => [...forumKeys.all, 'topics'] as const,
  topicsList: (filters: ForumFilters, pagination: PaginationParams) =>
    [...forumKeys.topics(), filters, pagination] as const,
  topic: (id: string) => [...forumKeys.topics(), id] as const,
  replies: (topicId: string) => [...forumKeys.all, 'replies', topicId] as const,
};

/**
 * Fetch forum topics
 */
export function useForumTopics(filters: ForumFilters = {}, pagination: PaginationParams = {}) {
  return useQuery({
    queryKey: forumKeys.topicsList(filters, pagination),
    queryFn: () => WellnessForumRepository.getTopics(filters, pagination),
  });
}

/**
 * Fetch single topic with details
 */
export function useForumTopic(id: string) {
  return useQuery({
    queryKey: forumKeys.topic(id),
    queryFn: () => WellnessForumRepository.getTopicById(id),
    enabled: !!id,
  });
}

/**
 * Fetch topic replies
 */
export function useTopicReplies(topicId: string) {
  return useQuery({
    queryKey: forumKeys.replies(topicId),
    queryFn: () => WellnessForumRepository.getTopicReplies(topicId),
    enabled: !!topicId,
  });
}

/**
 * Create new topic
 */
export function useCreateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, topicData }: { userId: string; topicData: CreateTopicRequest }) =>
      WellnessForumRepository.createTopic(userId, topicData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.topics() });
    },
  });
}

/**
 * Create reply
 */
export function useCreateReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, replyData }: { userId: string; replyData: CreateReplyRequest }) =>
      WellnessForumRepository.createReply(userId, replyData),
    onSuccess: (_, { replyData }) => {
      queryClient.invalidateQueries({ queryKey: forumKeys.topic(replyData.topic_id) });
      queryClient.invalidateQueries({ queryKey: forumKeys.replies(replyData.topic_id) });
    },
  });
}

/**
 * Update topic
 */
export function useUpdateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      topicId,
      userId,
      updates,
    }: {
      topicId: string;
      userId: string;
      updates: Partial<CreateTopicRequest>;
    }) => WellnessForumRepository.updateTopic(topicId, userId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: forumKeys.topic(data.id) });
      queryClient.invalidateQueries({ queryKey: forumKeys.topics() });
    },
  });
}

/**
 * Delete topic
 */
export function useDeleteTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ topicId, userId }: { topicId: string; userId: string }) =>
      WellnessForumRepository.deleteTopic(topicId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.topics() });
    },
  });
}

/**
 * Delete reply
 */
export function useDeleteReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ replyId, userId }: { replyId: string; userId: string; topicId: string }) =>
      WellnessForumRepository.deleteReply(replyId, userId),
    onSuccess: (_, { topicId }) => {
      queryClient.invalidateQueries({ queryKey: forumKeys.replies(topicId) });
      queryClient.invalidateQueries({ queryKey: forumKeys.topic(topicId) });
    },
  });
}
