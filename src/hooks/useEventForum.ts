import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { 
  subscribeToEventPosts, 
  addForumPost, 
  addReplyToPost, 
  upvoteForumPost,
  Post,
  Reply
} from "../lib/forumService";

export function useEventForum(eventId: number) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("Guest");

  // Get current user info
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName || "User");
      } else {
        setUsername("Guest");
      }
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to real-time posts for this event
  useEffect(() => {
    setIsLoading(true);
    
    // Wait for auth state to be determined
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated, subscribe to posts
        const unsubscribePosts = subscribeToEventPosts(eventId, (newPosts) => {
          setPosts(newPosts);
          setIsLoading(false);
          setIsConnected(true);
        });

        // Store the unsubscribe function to clean up later
        return () => unsubscribePosts();
      } else {
        // User not authenticated, clear posts
        setPosts([]);
        setIsLoading(false);
        setIsConnected(false);
      }
    });

    // Cleanup auth listener on unmount
    return () => unsubscribeAuth();
  }, [eventId]);

  // Add a new post
  const addPost = async (text: string, image?: string, customUsername?: string) => {
    try {
      const displayName = customUsername || username;
      await addForumPost(eventId, text, displayName, image);
      // Posts will be updated automatically via the real-time listener
    } catch (error) {
      console.error("Failed to add post:", error);
      setIsConnected(false);
    }
  };

  // Add a reply to a post
  const addReply = async (postId: string, text: string, image?: string, parentReplyId?: string) => {
    try {
      console.log('Adding reply:', { postId, text, image, parentReplyId, username });
      await addReplyToPost(postId, text, username, image, parentReplyId);
      // Posts will be updated automatically via the real-time listener
    } catch (error) {
      console.error("Failed to add reply:", error);
      setIsConnected(false);
    }
  };

  // Upvote a post or reply
  const upvotePost = async (postId: string, replyId?: string, customUsername?: string) => {
    try {
      const displayName = customUsername || username;
      await upvoteForumPost(postId, displayName, replyId);
      // Posts will be updated automatically via the real-time listener
    } catch (error) {
      console.error("Failed to upvote:", error);
      setIsConnected(false);
    }
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