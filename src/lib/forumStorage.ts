import { useEffect, useState } from "react";

export interface Reply {
  id: string;
  text: string;
  createdAt: number;
  username: string;
  upvotes: number;
  upvotedBy: string[];
  replies: Reply[];
}

export interface Post {
  id: string;
  text: string;
  image?: string;
  createdAt: number;
  username: string;
  upvotes: number;
  upvotedBy: string[];
  replies: Reply[];
}

export function useEventForum(eventId: number) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("Guest");

  const STORAGE_KEY = `forum_posts_${eventId}`;

  // 1️ Load posts from localStorage on mount
  useEffect(() => {
    setIsLoading(true);
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) setPosts(JSON.parse(data));
    setIsLoading(false);
  }, [STORAGE_KEY]);

  // 2️ Listen for updates to localStorage (live sync)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setPosts(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [STORAGE_KEY]);

  // 3️ Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts, STORAGE_KEY]);

  // 4️ Add a new post
  const addPost = (text: string, image?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      text,
      image,
      createdAt: Date.now(),
      username,
      upvotes: 0,
      upvotedBy: [],
      replies: [],
    };
    setPosts(prev => [newPost, ...prev]);
  };

  // 5️ Add a reply (supports nested replies)
  const addReply = (postId: string, text: string, parentReplyId?: string) => {
    const newReply: Reply = {
      id: Date.now().toString(),
      text,
      createdAt: Date.now(),
      username,
      upvotes: 0,
      upvotedBy: [],
      replies: [],
    };

    const addNestedReply = (replies: Reply[]): Reply[] =>
      replies.map(reply => {
        if (reply.id === parentReplyId) {
          return { ...reply, replies: [...reply.replies, newReply] };
        } else if (reply.replies.length > 0) {
          return { ...reply, replies: addNestedReply(reply.replies) };
        }
        return reply;
      });

    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          if (parentReplyId) {
            return { ...post, replies: addNestedReply(post.replies) };
          } else {
            return { ...post, replies: [...post.replies, newReply] };
          }
        }
        return post;
      })
    );
  };

  // 6️ Upvote a post or reply
  const upvotePost = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        const upvoteRecursive = (p: any): any => {
          if (p.id === postId) {
            const hasUpvoted = p.upvotedBy.includes(username);
            return {
              ...p,
              upvotes: hasUpvoted ? p.upvotes - 1 : p.upvotes + 1,
              upvotedBy: hasUpvoted
                ? p.upvotedBy.filter((u: string) => u !== username)
                : [...p.upvotedBy, username],
            };
          }
          if (p.replies.length > 0) {
            return { ...p, replies: p.replies.map(upvoteRecursive) };
          }
          return p;
        };
        return upvoteRecursive(post);
      })
    );
  };

  return {
    posts,
    isConnected,
    isLoading,
    username,
    addPost,
    addReply,
    upvotePost,
  };
}