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
  const [dbReady, setDbReady] = useState(false); 

  useEffect(() => {
    // ensure DB is initialized before any operations
    let mounted = true;
    async function initAndLoad() {
      try {
        const ok = await db.init();
        if (!ok) {
          console.warn("IndexedDB init failed");
          setIsConnected(false);
          setDbReady(false);
        }else{
          setDbReady(true);
        }
      } catch (err) {
        console.error("DB init error:", err);
        setIsConnected(false);
        setDbReady(false);
      }
      if (mounted) await loadPosts();
    }
    initAndLoad();
    return () => {
      mounted = false;
    };
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

  // returns true on success, false on failure
  const addPost = async (
    text: string,
    image: Blob | undefined,
    username: string
  ): Promise<boolean> => {
    if (!dbReady) {
      console.error("Database not ready");
      return false;
    }
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
        return true;
      }
      console.error("db.addPost returned false");
      return false;
    } catch (error) {
      console.error("Error adding post:", error);
      return false;
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
    dbReady,
    addPost,
    upvotePost,
    addReply,
  };
}
