import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from './firebase';

export interface Reply {
  id: string;
  text: string;
  createdAt: Timestamp;
  username: string;
  userId?: string;
  upvotes: number;
  upvotedBy: string[];
  replies: Reply[]; // nested replies
}

export interface Post {
  id: string;
  eventId: number;
  text: string;
  image?: string;
  createdAt: Timestamp;
  username: string;
  userId?: string;
  upvotes: number;
  upvotedBy: string[]; // track usernames who upvoted
  replies: Reply[];
}

// Collection references
const POSTS_COLLECTION = 'forumPosts';

/**
 * Add a new forum post
 */
export async function addForumPost(
  eventId: number, 
  text: string, 
  username: string, 
  image?: string
): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be authenticated to post');

  const postData = {
    eventId,
    text,
    ...(image && { image }), // Only include image if it exists
    createdAt: serverTimestamp(),
    username,
    userId: user.uid,
    upvotes: 0,
    upvotedBy: [],
    replies: []
  };

  const docRef = await addDoc(collection(db, POSTS_COLLECTION), postData);
  return docRef.id;
}

/**
 * Add a reply to a post
 */
export async function addReplyToPost(
  postId: string,
  text: string,
  username: string,
  image?: string,
  parentReplyId?: string
): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be authenticated to reply');

  const postRef = doc(db, POSTS_COLLECTION, postId);
  const postDoc = await getDoc(postRef);
  
  if (!postDoc.exists()) {
    throw new Error('Post not found');
  }

  const newReply: Omit<Reply, 'id'> = {
    text,
    createdAt: Timestamp.now(),
    username,
    userId: user.uid,
    upvotes: 0,
    upvotedBy: [],
    replies: []
  };

  const postData = postDoc.data() as Post;
  const updatedReplies = [...postData.replies];

  if (parentReplyId) {
    // Add nested reply
    const addNestedReply = (replies: Reply[]): Reply[] => {
      return replies.map(reply => {
        if (reply.id === parentReplyId) {
          return {
            ...reply,
            replies: [...reply.replies, { ...newReply, id: Date.now().toString() }]
          };
        }
        if (reply.replies.length > 0) {
          return { ...reply, replies: addNestedReply(reply.replies) };
        }
        return reply;
      });
    };
    updatedReplies.splice(0, updatedReplies.length, ...addNestedReply(updatedReplies));
  } else {
    // Add top-level reply
    updatedReplies.push({ ...newReply, id: Date.now().toString() });
  }

  await updateDoc(postRef, { replies: updatedReplies });
}

/**
 * Upvote a post or reply
 */
export async function upvoteForumPost(postId: string, username: string, replyId?: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be authenticated to upvote');

  const postRef = doc(db, POSTS_COLLECTION, postId);
  const postDoc = await getDoc(postRef);
  
  if (!postDoc.exists()) {
    throw new Error('Post not found');
  }

  const postData = postDoc.data() as Post;

  if (replyId) {
    // Upvote a reply
    const updateReplyUpvote = (replies: Reply[]): Reply[] => {
      return replies.map(reply => {
        if (reply.id === replyId) {
          const hasUpvoted = reply.upvotedBy.includes(username);
          return {
            ...reply,
            upvotes: hasUpvoted ? reply.upvotes - 1 : reply.upvotes + 1,
            upvotedBy: hasUpvoted
              ? reply.upvotedBy.filter(u => u !== username)
              : [...reply.upvotedBy, username]
          };
        }
        if (reply.replies.length > 0) {
          return { ...reply, replies: updateReplyUpvote(reply.replies) };
        }
        return reply;
      });
    };

    const updatedReplies = updateReplyUpvote(postData.replies);
    await updateDoc(postRef, { replies: updatedReplies });
  } else {
    // Upvote the main post
    const hasUpvoted = postData.upvotedBy.includes(username);
    
    await updateDoc(postRef, {
      upvotes: hasUpvoted ? increment(-1) : increment(1),
      upvotedBy: hasUpvoted 
        ? arrayRemove(username) 
        : arrayUnion(username)
    });
  }
}

/**
 * Get all posts for an event with real-time updates
 */
export function subscribeToEventPosts(
  eventId: number, 
  callback: (posts: Post[]) => void
): () => void {
  // Check if user is authenticated
  const user = auth.currentUser;
  if (!user) {
    console.warn('User not authenticated, cannot fetch forum posts');
    callback([]);
    return () => {}; // Return empty unsubscribe function
  }

  const q = query(
    collection(db, POSTS_COLLECTION),
    where('eventId', '==', eventId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Post));
    
    callback(posts);
  }, (error) => {
    console.error('Error fetching forum posts:', error);
    if (error.code === 'failed-precondition') {
      console.error('Missing index! Check Firebase Console for index creation link.');
    }
    if (error.code === 'permission-denied') {
      console.error('Permission denied. User might not be authenticated or rules are incorrect.');
    }
    callback([]);
  });
}

/**
 * Get posts for an event (one-time fetch)
 */
export async function getEventPosts(eventId: number): Promise<Post[]> {
  const q = query(
    collection(db, POSTS_COLLECTION),
    where('eventId', '==', eventId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Post));
}

/**
 * Delete a forum post (only by the author)
 */
export async function deleteForumPost(postId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be authenticated to delete posts');

  const postRef = doc(db, POSTS_COLLECTION, postId);
  const postDoc = await getDoc(postRef);
  
  if (!postDoc.exists()) {
    throw new Error('Post not found');
  }

  const postData = postDoc.data() as Post;
  
  // Only allow the author to delete their own post
  if (postData.userId !== user.uid) {
    throw new Error('You can only delete your own posts');
  }

  await deleteDoc(postRef);
}

/**
 * Update a forum post (only by the author)
 */
export async function updateForumPost(
  postId: string, 
  text: string, 
  image?: string
): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be authenticated to update posts');

  const postRef = doc(db, POSTS_COLLECTION, postId);
  const postDoc = await getDoc(postRef);
  
  if (!postDoc.exists()) {
    throw new Error('Post not found');
  }

  const postData = postDoc.data() as Post;
  
  // Only allow the author to update their own post
  if (postData.userId !== user.uid) {
    throw new Error('You can only update your own posts');
  }

  await updateDoc(postRef, {
    text,
    image: image || null,
    updatedAt: serverTimestamp()
  });
}