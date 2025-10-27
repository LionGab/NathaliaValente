import { useState } from 'react';
import { MessageSquare, Send, Image, Smile } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const ForumPage = () => {
  const { profile } = useAuth();
  const [postContent, setPostContent] = useState('');
  const [posts] = useState([
    {
      id: 1,
      author: 'Maria Silva',
      avatar: 'MS',
      content: 'Alguém tem dicas para bebês que não dormem bem a noite?',
      time: 'há 2h',
      likes: 12,
      comments: 5
    },
    {
      id: 2,
      author: 'Ana Costa',
      avatar: 'AC',
      content: 'Primeira vez aqui! Como faço para participar dos grupos?',
      time: 'há 5h',
      likes: 8,
      comments: 3
    }
  ]);

  const handlePublish = () => {
    if (postContent.trim()) {
      console.log('Publicando:', postContent);
      setPostContent('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Fórum da Comunidade
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Compartilhe suas dúvidas e experiências com outras mães
        </p>
      </div>

      {/* Create Post Area */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 mb-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
          </div>

          {/* Input Area */}
          <div className="flex-1">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Compartilhe suas dúvidas e experiências..."
              className="w-full min-h-[120px] px-4 py-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
            
            {/* Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors">
                  <Image className="w-5 h-5 text-neutral-500" />
                </button>
                <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors">
                  <Smile className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              <button
                onClick={handlePublish}
                disabled={!postContent.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-medium"
              >
                <Send className="w-4 h-4" />
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {post.avatar}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {post.author}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {post.time}
                  </span>
                </div>

                <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                  {post.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-primary-500 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-red-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-sm">{post.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
