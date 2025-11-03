import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Sparkles, Quote } from 'lucide-react';
import { trackPostInteraction } from '../../../lib/analytics';

interface NathInspiraCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    category: 'motivational' | 'prayer' | 'motherhood' | 'faith' | 'selfcare';
    author: string;
    authorAvatar: string;
    likes: number;
    comments: number;
    isLiked: boolean;
    isBookmarked: boolean;
    createdAt: string;
    imageUrl?: string;
  };
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onBookmark: (postId: string) => void;
}

const CATEGORY_CONFIG = {
  motivational: {
    emoji: '✨',
    color: 'from-pink-500 to-purple-600',
    bgColor: 'bg-pink-50 dark:bg-pink-950/20',
    borderColor: 'border-pink-200 dark:border-pink-800',
    textColor: 'text-pink-700 dark:text-pink-300',
  },
  prayer: {
    emoji: '🙏',
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-700 dark:text-purple-300',
  },
  motherhood: {
    emoji: '👶',
    color: 'from-orange-500 to-pink-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    textColor: 'text-orange-700 dark:text-orange-300',
  },
  faith: {
    emoji: '⛪',
    color: 'from-blue-500 to-purple-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-700 dark:text-blue-300',
  },
  selfcare: {
    emoji: '🌿',
    color: 'from-green-500 to-teal-600',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-800',
    textColor: 'text-green-700 dark:text-green-300',
  },
};

export const NathInspiraCard: React.FC<NathInspiraCardProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onBookmark,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const config = CATEGORY_CONFIG[post.category];

  const handleLike = () => {
    setIsAnimating(true);
    onLike(post.id);
    trackPostInteraction('like', post.id);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleComment = () => {
    onComment(post.id);
    trackPostInteraction('comment', post.id);
  };

  const handleShare = () => {
    onShare(post.id);
    trackPostInteraction('share', post.id);
  };

  const handleBookmark = () => {
    onBookmark(post.id);
    trackPostInteraction('bookmark', post.id);
  };

  return (
    <article
      className={`relative overflow-hidden rounded-3xl ${config.bgColor} ${config.borderColor} border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group`}
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-5 group-hover:opacity-10 transition-opacity`}
      />

      {/* Header */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={post.authorAvatar}
              alt={post.author}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-neutral-800"
            />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-neutral-900 dark:text-white truncate">{post.author}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${config.borderColor} border`}
              >
                {config.emoji} {post.category}
              </span>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {new Date(post.createdAt).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative px-6 pb-4">
        <div className="flex items-start gap-3 mb-4">
          <Quote className={`w-6 h-6 ${config.textColor} opacity-60 flex-shrink-0 mt-1`} />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 leading-tight">
              {post.title}
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{post.content}</p>
          </div>
        </div>

        {/* Image */}
        {post.imageUrl && (
          <div className="rounded-2xl overflow-hidden mb-4">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="relative px-6 py-4 border-t border-neutral-200/50 dark:border-neutral-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                post.isLiked
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <Heart
                className={`w-5 h-5 transition-all duration-200 ${
                  post.isLiked ? 'fill-current scale-110' : ''
                } ${isAnimating ? 'animate-bounce' : ''}`}
              />
              <span className="font-medium">{post.likes}</span>
            </button>

            <button
              onClick={handleComment}
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{post.comments}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleBookmark}
            className={`p-2 rounded-xl transition-all duration-200 ${
              post.isBookmarked
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <Bookmark
              className={`w-5 h-5 transition-all duration-200 ${
                post.isBookmarked ? 'fill-current' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
        <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl" />
      </div>
      <div className="absolute bottom-4 left-4 opacity-20 group-hover:opacity-40 transition-opacity">
        <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-lg" />
      </div>
    </article>
  );
};
