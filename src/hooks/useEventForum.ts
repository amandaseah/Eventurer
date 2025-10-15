import { useEffect, useState } from "react";

interface Post {
  id: string;
  text: string;
  image?: string;
  createdAt: number;
  username: string;
  upvotes: number;
}

export function useEventForum(eventId: number) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("Guest");

  // 1️ Load posts from localStorage on mount
  useEffect(() => {
    setIsLoading(true);
    const data = localStorage.getItem(`forum_posts_${eventId}`);
    if (data) {
      setPosts(JSON.parse(data));
    }
    setIsLoading(false);
  }, [eventId]);

  // 2️ Simulate connection (always online for now)
  useEffect(() => {
    setIsConnected(true);
  }, []);

  // 3️ Save posts to localStorage when they change
  useEffect(() => {
    localStorage.setItem(`forum_posts_${eventId}`, JSON.stringify(posts));
  }, [posts, eventId]);

  // 4️ Add a new post
  const addPost = (text: string, image?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      text,
      image,
      createdAt: Date.now(),
      username,
      upvotes: 0,
    };
    setPosts(prev => [newPost, ...prev]);
  };

  // 5️ Upvote a post
  const upvotePost = (id: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === id ? { ...post, upvotes: post.upvotes + 1 } : post
      )
    );
  };

  return {
    posts,
    isConnected,
    isLoading,
    username,
    addPost,
    upvotePost,
  };
}