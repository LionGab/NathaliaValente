import { useState } from 'react';
import { MessageSquare, Send, Image, Smile, Heart, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const ForumPage = () => {
  const { profile } = useAuth();
  const [postContent, setPostContent] = useState('');
  const [posts] = useState([
    {
      id: 1,
      author: 'Maria Silva',
      avatar: 'MS',
      content: 'Alguém tem dicas para bebês que não dormem bem a noite? Meu pequeno acorda várias vezes durante a madrugada e estou exausta 😴',
      time: 'há 2h',
      likes: 24,
      comments: 8,
      trending: true
    },
    {
      id: 2,
      author: 'Ana Costa',
      avatar: 'AC',
      content: 'Primeira vez aqui! Como faço para participar dos grupos? Estou no terceiro mês de gravidez e adoraria trocar experiências! 💕',
      time: 'há 5h',
      likes: 15,
      comments: 12,
      trending: false
    },
    {
      id: 3,
      author: 'Juliana Santos',
      avatar: 'JS',
      content: 'Acabei de descobrir que estou grávida! Alguma dica de vitaminas essenciais para o primeiro trimestre? 🙏',
      time: 'há 8h',
      likes: 31,
      comments: 19,
      trending: true
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
          Fórum da Comunidade
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
          Compartilhe suas dúvidas e experiências com outras mães
        </p>
      </div>

      {/* Create Post Area */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 mb-8 shadow-lg border border-neutral-200 dark:border-neutral-700">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
            {profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
          </div>

          {/* Input Area */}
          <div className="flex-1">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Compartilhe suas dúvidas e experiências com a comunidade..."
              className="w-full min-h-[140px] px-4 py-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-base"
            />
            
            {/* Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <button className="p-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl transition-colors group">
                  <Image className="w-5 h-5 text-neutral-500 group-hover:text-primary-500 transition-colors" />
                </button>
                <button className="p-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl transition-colors group">
                  <Smile className="w-5 h-5 text-neutral-500 group-hover:text-yellow-500 transition-colors" />
                </button>
              </div>

              <button
                onClick={handlePublish}
                disabled={!postContent.trim()}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
              >
                <Send className="w-5 h-5" />
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-5">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-md">
                {post.avatar}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-neutral-900 dark:text-white text-base">
                    {post.author}
                  </span>
                  {post.trending && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                      <TrendingUp className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                      <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">Em alta</span>
                    </div>
                  )}
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {post.time}
                  </span>
                </div>

                <p className="text-neutral-700 dark:text-neutral-200 mb-4 leading-relaxed text-[15px]">
                  {post.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-6 pt-3 border-t border-neutral-100 dark:border-neutral-700">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-primary-500 transition-all group">
                    <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all group">
                    <Heart className="w-4 h-4 group-hover:scale-110 transition-transform fill-transparent group-hover:fill-red-500" />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button className="ml-auto px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                    Compartilhar
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
