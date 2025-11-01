import { useEffect, useState } from "react";
import { saveToIndexedDB, getFromIndexedDB } from "../lib/indexeddb";

interface Reply {
  id: string;
  text: string;
  image?: string;
  createdAt: number;
  username: string;
  upvotes: number;
  upvotedBy: string[];
  replies: Reply[]; // nested replies
}

interface Post {
  id: string;
  text: string;
  image?: string;
  createdAt: number;
  username: string;
  upvotes: number;
  upvotedBy: string[]; // track usernames who upvoted
  replies: Reply[];
}

export function useEventForum(eventId: number) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("Guest");

  // 1️ Load posts from IndexedDB on mount
  useEffect(() => {
    setIsLoading(true);
    getFromIndexedDB(`forum_posts_${eventId}`)
      .then((data) => {
        if (data) {
          setPosts(data as Post[]);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [eventId]);

  // 2️ Simulate connection (always online for now)
  useEffect(() => {
    setIsConnected(true);
  }, []);

  // 3️ Save posts to IndexedDB when they change
  useEffect(() => {
    saveToIndexedDB(`forum_posts_${eventId}`, posts).catch(console.error);
  }, [posts, eventId]);

  // 4️ Add a new post
  const addPost = (text: string, image?: string, username?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      text,
      image,
      createdAt: Date.now(),
      username: username || "Guest",
      upvotes: 0,
      upvotedBy: [],
      replies: [],
    };


    setPosts(prev => [newPost, ...prev]);
  };

  const addReply = (postId: string, text: string, image?: string, parentReplyId?: string) => {
    const newReply: Reply = {
      id: Date.now().toString(),
      text,
      image,
      createdAt: Date.now(),
      username,
      replies: [],
      upvotes: 0,
      upvotedBy: [],
    };

    const addNestedReply = (replies: Reply[]): Reply[] => {
      return replies.map(reply => {
        if (reply.id === parentReplyId) {
          return {
            ...reply,
            replies: [newReply, ...reply.replies], // clone new replies array
          };
        }
        if (reply.replies.length > 0) {
          return {
            ...reply,
            replies: addNestedReply(reply.replies), // clone deeper
          };
        }
        return { ...reply }; // clone leaf
      });
    };

    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          if (parentReplyId) {
            return {
              ...post,
              replies: addNestedReply(post.replies), // cloned tree
            };
          } else {
            return {
              ...post,
              replies: [...post.replies, newReply], // clone new replies array
            };
          }
        }
        return { ...post }; // clone other posts
      })
    );
  };

  // 5️ Upvote a post or reply (recursive)
  const upvotePost = (postId: string, username: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        const upvoteRecursive = (p: Post | Reply): Post | Reply => {
          const hasUpvoted = p.upvotedBy.includes(username);
          if (p.id === postId) {
            return {
              ...p,
              upvotes: hasUpvoted ? p.upvotes - 1 : p.upvotes + 1,
              upvotedBy: hasUpvoted
                ? p.upvotedBy.filter(u => u !== username)
                : [...p.upvotedBy, username],
            };
          }
          if (p.replies.length > 0) {
            return { ...p, replies: p.replies.map(upvoteRecursive) };
          }
          return p;
        };
        return upvoteRecursive(post) as Post;
      })
    );
  };

  return {
    posts,
    isConnected,
    isLoading,
    username,
    addPost,
    upvotePost,
    addReply,
  };
}
