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

  const ReplyBox = ({ parentId }: { parentId: number }) => {
    const [replyText, setReplyText] = useState('');
    const [replyImage, setReplyImage] = useState<string | null>(null);
    const replyFileInputRef = useRef<HTMLInputElement>(null);

    const handleReplyImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setReplyImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSubmitReply = () => {
      if (replyText.trim() || replyImage) {
        const newPost: ForumPost = {
          id: Math.max(...forumPosts.map(p => p.id), 0) + 1,
          eventId,
          username: 'You',
          timestamp: 'Just now',
          comment: replyText,
          upvotes: 0,
          image: replyImage || undefined,
          replyTo: parentId,
        };
        setForumPosts([...forumPosts, newPost]);
        setReplyText('');
        setReplyImage(null);
        setReplyingTo(null);
      }
    };

    return (
      <div className="mt-3 p-4 bg-blue-50 rounded-2xl border border-blue-200">
        <Textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write your reply..."
          className="rounded-2xl min-h-[80px] mb-3 bg-white"
        />
        
        {replyImage && (
          <div className="relative mb-3 rounded-xl overflow-hidden">
            <img src={replyImage} alt="Reply preview" className="w-full max-h-48 object-cover rounded-xl" />
            <button
              onClick={() => setReplyImage(null)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <input
            ref={replyFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleReplyImageSelect}
            className="hidden"
          />
          <Button
            onClick={() => replyFileInputRef.current?.click()}
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            <ImageIcon className="w-3 h-3 mr-1" />
            Image
          </Button>
          <Button
            onClick={handleSubmitReply}
            disabled={!replyText.trim() && !replyImage}
            size="sm"
            className="rounded-full bg-blue-500 hover:bg-blue-600"
          >
            <Send className="w-3 h-3 mr-1" />
            Reply
          </Button>
          <Button
            onClick={() => setReplyingTo(null)}
            variant="ghost"
            size="sm"
            className="rounded-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  const RenderPost = ({ post, depth = 0 }: { post: ForumPost; depth?: number }) => {
    const replies = getReplies(post.id);
    const isReplyingToThis = replyingTo === post.id;

    return (
      <div className={depth > 0 ? 'ml-8 mt-3' : ''}>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`bg-white rounded-3xl p-6 shadow-md ${depth > 0 ? 'bg-purple-50' : ''}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`${depth > 0 ? 'w-8 h-8 text-sm' : 'w-10 h-10'} rounded-full bg-gradient-to-br from-purple-400 to-pink-300 flex items-center justify-center text-white`}>
                {post.username.charAt(0)}
              </div>
              <div>
                <p className={`font-medium ${depth > 0 ? 'text-sm' : ''}`}>{post.username}</p>
                <p className="text-xs text-gray-500">{post.timestamp}</p>
              </div>
            </div>
          </div>

          <p className={`text-gray-700 mb-4 leading-relaxed ${depth > 0 ? 'text-sm' : ''}`}>{post.comment}</p>

          {post.image && (
            <div className="mb-4 rounded-2xl overflow-hidden">
              <img src={post.image} alt="Post attachment" className={`w-full object-cover ${depth > 0 ? 'max-h-48' : 'max-h-96'}`} />
            </div>
          )}

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleUpvote(post.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${depth > 0 ? 'text-sm' : ''} ${
                upvotedPosts.includes(post.id)
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-purple-50'
              }`}
            >
              <ThumbsUp
                className={depth > 0 ? 'w-3 h-3' : 'w-4 h-4'}
                fill={upvotedPosts.includes(post.id) ? 'currentColor' : 'none'}
              />
              <span>{post.upvotes} upvotes</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setReplyingTo(post.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all ${depth > 0 ? 'text-sm' : ''}`}
            >
              <Reply className={depth > 0 ? 'w-3 h-3' : 'w-4 h-4'} />
              <span>Reply</span>
            </motion.button>
          </div>

          {/* Reply box for this specific comment */}
          {isReplyingToThis && <ReplyBox parentId={post.id} />}
        </motion.div>

        {/* Render nested replies */}
        {replies.length > 0 && (
          <div className={depth > 0 ? 'border-l-2 border-purple-200 pl-4 mt-3' : 'mt-4 space-y-3'}>
            {replies.map((reply) => (
              <RenderPost key={reply.id} post={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-md mb-8"
        >
          <h3 className="text-xl mb-4">Add Your Comment</h3>

          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts, ask questions, or connect with other attendees..."
            className="rounded-2xl min-h-[100px] mb-4"
          />
          
          {selectedImage && (
            <div className="relative mb-4 rounded-2xl overflow-hidden">
              <img src={selectedImage} alt="Upload preview" className="w-full max-h-64 object-cover rounded-2xl" />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="rounded-full"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Add Image
            </Button>
            <Button
              onClick={handleAddPost}
              disabled={!newComment.trim() && !selectedImage}
              className="rounded-full bg-gradient-to-r from-purple-400 to-pink-300 hover:shadow-lg"
            >
              <Send className="w-4 h-4 mr-2" />
              Post Comment
            </Button>
          </div>
        </motion.div>

        {/* Forum Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-2xl mb-4">Discussion ({sortedPosts.length})</h2>

          {topLevelPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <RenderPost post={post} />
            </motion.div>
          ))}

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
