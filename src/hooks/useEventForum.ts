import { useState, useEffect } from "react";
import { db } from "../lib/indexedDB";

interface Post {
  id: string;
  eventId: number;
  text: string;
  imageId?: string;
  image?: Blob | null;
  username: string;
  timestamp: number;
  upvotes: string[];
  replies?: Post[];
}

export function useEventForum(eventId: number) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [eventId]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const eventPosts = await db.getPostsByEvent(eventId);
      setPosts(eventPosts);
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addPost = async (
    text: string,
    image: Blob | undefined,
    username: string
  ) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      eventId,
      text,
      username,
      timestamp: Date.now(),
      upvotes: [],
    };

    try {
      const success = await db.addPost(newPost, image);
      if (success) {
        await loadPosts(); // Reload posts to get fresh data
      } else {
        throw new Error("Failed to add post");
      }
    } catch (error) {
      console.error("Error adding post:", error);
      throw error;
    }
  };

  const upvotePost = async (postId: string, username: string) => {
    try {
      // toggle locally first for snappy UI
      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.id === postId) {
            const hasUpvoted = post.upvotes.includes(username);
            return {
              ...post,
              upvotes: hasUpvoted
                ? post.upvotes.filter((u) => u !== username)
                : [...post.upvotes, username],
            };
          }
          return post;
        })
      );

      // persist change to DB
      const post = await db.getPostById(postId);
      if (!post) return;
      const hasUpvoted = post.upvotes?.includes(username);
      const newUpvotes = hasUpvoted
        ? (post.upvotes || []).filter((u) => u !== username)
        : [...(post.upvotes || []), username];
      await db.updatePost(postId, { upvotes: newUpvotes });
      // reload to ensure consistent state
      await loadPosts();
    } catch (error) {
      console.error("Failed to upvote post:", error);
    }
  };

  const addReply = async (
    postId: string,
    text: string,
    image: Blob | undefined,
    parentReplyId?: string,
    username?: string
  ) => {
    const reply: Post = {
      id: `reply_${Date.now()}`,
      eventId,
      text,
      username: username || "Guest",
      timestamp: Date.now(),
      upvotes: [],
    };

    try {
      const ok = await db.addReply(postId, reply, image);
      if (ok) {
        await loadPosts();
      } else {
        throw new Error("Failed to persist reply");
      }
    } catch (error) {
      console.error("Failed to add reply:", error);
      // fallback: update locally
      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              replies: [...(post.replies || []), reply],
            };
          }
          return post;
        })
      );
    }
  };

  return {
    posts,
    isLoading,
    isConnected,
    addPost,
    upvotePost,
    addReply,
  };
}