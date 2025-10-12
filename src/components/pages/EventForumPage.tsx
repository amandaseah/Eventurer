import NewPostForm from "../features/forum/NewPostForm";
import PostList from "../features/forum/PostList";
import { ForumPost } from "../features/forum/types";


import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from '../Header';
import { events, forumPosts as initialForumPosts } from '../../lib/mockData';
import { ThumbsUp, Send, MessageSquare, Image as ImageIcon, X, Reply, ArrowLeft } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

interface ForumPost {
  id: number;
  eventId: number;
  username: string;
  timestamp: string;
  comment: string;
  upvotes: number;
  image?: string;
  replyTo?: number;
}

interface EventForumPageProps {
  eventId: number;
  onNavigate: (page: string, data?: any) => void;
}

export function EventForumPage({ eventId, onNavigate }: EventForumPageProps) {
  const event = events.find(e => e.id === eventId);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(initialForumPosts.filter(p => p.eventId === eventId));
  const [newComment, setNewComment] = useState('');
  const [upvotedPosts, setUpvotedPosts] = useState<number[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!event) {
    return <div>Event not found</div>;
  }

  const handleUpvote = (postId: number) => {
    if (upvotedPosts.includes(postId)) {
      setUpvotedPosts(upvotedPosts.filter(id => id !== postId));
      setForumPosts(forumPosts.map(post =>
        post.id === postId ? { ...post, upvotes: post.upvotes - 1 } : post
      ));
    } else {
      setUpvotedPosts([...upvotedPosts, postId]);
      setForumPosts(forumPosts.map(post =>
        post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
      ));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPost = () => {
    if (newComment.trim() || selectedImage) {
      const newPost: ForumPost = {
        id: Math.max(...forumPosts.map(p => p.id), 0) + 1,
        eventId,
        username: 'You',
        timestamp: 'Just now',
        comment: newComment,
        upvotes: 0,
        image: selectedImage || undefined,
        replyTo: replyingTo || undefined,
      };
      setForumPosts([newPost, ...forumPosts]);
      setNewComment('');
      setSelectedImage(null);
      setReplyingTo(null);
    }
  };

  const sortedPosts = [...forumPosts].sort((a, b) => b.upvotes - a.upvotes);

  // Organize posts into threads
  const topLevelPosts = sortedPosts.filter(post => !post.replyTo);
  
  const getReplies = (postId: number): ForumPost[] => {
    return sortedPosts.filter(post => post.replyTo === postId);
  };

  const getReplyToPost = (postId: number) => {
    return forumPosts.find(post => post.id === postId);
  };

  const handleAddTopLevelPost = (payload: { comment: string; image?: string | null }) => {
    const newPost: ForumPost = {
      id: Math.max(...forumPosts.map(p => p.id), 0) + 1,
      eventId,
      username: 'You',
      timestamp: 'Just now',
      comment: payload.comment,
      upvotes: 0,
      image: payload.image || undefined,
    };
    setForumPosts([newPost, ...forumPosts]);
  };
  
  const handleAddReply = (payload: { parentId: number; comment: string; image?: string | null }) => {
    const newPost: ForumPost = {
      id: Math.max(...forumPosts.map(p => p.id), 0) + 1,
      eventId,
      username: 'You',
      timestamp: 'Just now',
      comment: payload.comment,
      upvotes: 0,
      image: payload.image || undefined,
      replyTo: payload.parentId,
    };
    setForumPosts([...forumPosts, newPost]);
  };

  return (
    <div className="min-h-screen">
      <Header onNavigate={onNavigate} />

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => onNavigate('event-info', { eventId })}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Event</span>
          </button>
          <h1 className="text-4xl mb-2">{event.title}</h1>
          <div className="flex items-center gap-3 text-gray-600">
            <MessageSquare className="w-5 h-5" />
            <span>Forum Discussion</span>
          </div>
        </motion.div>

        {/* Add New Post */}
        <NewPostForm onAddPost={handleAddTopLevelPost} />

        {/* Forum Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <PostList
              posts={forumPosts}
              upvotedPosts={upvotedPosts}
              onUpvote={handleUpvote}
              onSubmitReply={handleAddReply}
            />
          </motion.div>

          {sortedPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-3xl"
            >
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl text-gray-500 mb-2">No comments yet</p>
              <p className="text-gray-400">Be the first to start the discussion!</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
