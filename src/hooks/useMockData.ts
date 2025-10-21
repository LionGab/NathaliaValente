import { useState, useEffect } from 'react';
import { mockPosts, mockUsers, mockComments, mockCategories, mockDailyQuotes } from '../data/mockData';

// Main hook that combines all mock data functionality
export const useMockData = () => {
  const { posts, loading, likePost, addComment } = useMockPosts();
  const { users } = useMockUsers();
  const { categories } = useMockCategories();
  const { quote, getNewQuote } = useMockDailyQuote();

  return {
    posts,
    users,
    categories,
    quote,
    loading,
    likePost,
    addComment,
    getNewQuote
  };
};

export const useMockPosts = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [loading, setLoading] = useState(false);

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes_count: post.user_has_liked ? post.likes_count - 1 : post.likes_count + 1,
          user_has_liked: !post.user_has_liked
        };
      }
      return post;
    }));
  };

  const addComment = (postId: string, content: string, userId: string) => {
    const newComment = {
      id: Date.now().toString(),
      post_id: postId,
      user_id: userId,
      content,
      created_at: new Date().toISOString(),
      profiles: mockUsers.find(u => u.id === userId) || mockUsers[0]
    };

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments_count: post.comments_count + 1
        };
      }
      return post;
    }));

    return newComment;
  };

  return {
    posts,
    loading,
    likePost,
    addComment,
    refetch: () => setPosts(mockPosts)
  };
};

export const useMockUsers = () => {
  return {
    users: mockUsers,
    loading: false
  };
};

export const useMockComments = (postId: string) => {
  const [comments, setComments] = useState(
    mockComments.filter(comment => comment.post_id === postId)
  );

  const addComment = (content: string, userId: string) => {
    const newComment = {
      id: Date.now().toString(),
      post_id: postId,
      user_id: userId,
      content,
      created_at: new Date().toISOString(),
      profiles: mockUsers.find(u => u.id === userId) || mockUsers[0]
    };

    setComments(prev => [...prev, newComment]);
    return newComment;
  };

  return {
    comments,
    addComment,
    loading: false
  };
};

export const useMockCategories = () => {
  return {
    categories: mockCategories,
    loading: false
  };
};

export const useMockDailyQuote = () => {
  const [quote, setQuote] = useState(mockDailyQuotes[0]);
  const [loading, setLoading] = useState(false);

  const getNewQuote = () => {
    setLoading(true);
    setTimeout(() => {
      const randomQuote = mockDailyQuotes[Math.floor(Math.random() * mockDailyQuotes.length)];
      setQuote(randomQuote);
      setLoading(false);
    }, 1000);
  };

  return {
    quote,
    loading,
    getNewQuote
  };
};
