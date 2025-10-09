import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Header } from '../Header';
import { generalDiscussions as initialDiscussions } from '../../lib/mockData';
import { ThumbsUp, Send, Reply, Image as ImageIcon, X, ArrowLeft } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

interface Discussion {
  id: number;
  username: string;
  timestamp: string;
  comment: string;
  upvotes: number;
  image?: string;
  replyTo?: number;
}

interface DiscussionPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function DiscussionPage({ onNavigate }: DiscussionPageProps) {
  const [discussions, setDiscussions] = useState<Discussion[]>(initialDiscussions);
  const [newComment, setNewComment] = useState('');
  const [upvotedComments, setUpvotedComments] = useState<number[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpvote = (commentId: number) => {
    if (upvotedComments.includes(commentId)) {
      setUpvotedComments(upvotedComments.filter(id => id !== commentId));
      setDiscussions(discussions.map(comment =>
        comment.id === commentId ? { ...comment, upvotes: comment.upvotes - 1 } : comment
      ));
    } else {
      setUpvotedComments([...upvotedComments, commentId]);
      setDiscussions(discussions.map(comment =>
        comment.id === commentId ? { ...comment, upvotes: comment.upvotes + 1 } : comment
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

  const handleAddComment = () => {
    if (newComment.trim() || selectedImage) {
      const newDiscussion: Discussion = {
        id: Math.max(...discussions.map(d => d.id), 0) + 1,
        username: 'You',
        timestamp: 'Just now',
        comment: newComment,
        upvotes: 0,
        image: selectedImage || undefined,
        replyTo: replyingTo || undefined,
      };
      setDiscussions([...discussions, newDiscussion]);
      setNewComment('');
      setSelectedImage(null);
      setReplyingTo(null);
    }
  };

  const sortedDiscussions = [...discussions].sort((a, b) => b.upvotes - a.upvotes);

  // Organize into threads
  const topLevelDiscussions = sortedDiscussions.filter(d => !d.replyTo);
  
  const getReplies = (discussionId: number): Discussion[] => {
    return sortedDiscussions.filter(d => d.replyTo === discussionId);
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
        const newDiscussion: Discussion = {
          id: Math.max(...discussions.map(d => d.id), 0) + 1,
          username: 'You',
          timestamp: 'Just now',
          comment: replyText,
          upvotes: 0,
          image: replyImage || undefined,
          replyTo: parentId,
        };
        setDiscussions([...discussions, newDiscussion]);
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

  const RenderDiscussion = ({ discussion, depth = 0 }: { discussion: Discussion; depth?: number }) => {
    const replies = getReplies(discussion.id);
    const isReplyingToThis = replyingTo === discussion.id;

    return (
      <div className={depth > 0 ? 'ml-8 mt-3' : ''}>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`bg-white rounded-3xl p-6 shadow-md ${depth > 0 ? 'bg-purple-50 border-l-4 border-purple-300' : ''}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`${depth > 0 ? 'w-8 h-8 text-sm' : 'w-12 h-12'} rounded-full bg-gradient-to-br from-purple-400 to-pink-300 flex items-center justify-center text-white`}>
                {discussion.username.charAt(0)}
              </div>
              <div>
                <p className={`font-medium ${depth > 0 ? 'text-sm' : ''}`}>{discussion.username}</p>
                <p className="text-xs text-gray-500">{discussion.timestamp}</p>
              </div>
            </div>
          </div>

          <p className={`text-gray-700 mb-4 leading-relaxed ${depth > 0 ? 'text-sm' : 'text-lg'}`}>{discussion.comment}</p>

          {discussion.image && (
            <div className="mb-4 rounded-2xl overflow-hidden">
              <img src={discussion.image} alt="Discussion attachment" className={`w-full object-cover ${depth > 0 ? 'max-h-48' : 'max-h-96'}`} />
            </div>
          )}

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleUpvote(discussion.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${depth > 0 ? 'text-sm' : ''} ${
                upvotedComments.includes(discussion.id)
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-purple-50'
              }`}
            >
              <ThumbsUp
                className={depth > 0 ? 'w-3 h-3' : 'w-4 h-4'}
                fill={upvotedComments.includes(discussion.id) ? 'currentColor' : 'none'}
              />
              <span>{discussion.upvotes} upvotes</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setReplyingTo(discussion.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all ${depth > 0 ? 'text-sm' : ''}`}
            >
              <Reply className={depth > 0 ? 'w-3 h-3' : 'w-4 h-4'} />
              <span>Reply</span>
            </motion.button>
          </div>

          {/* Reply box for this specific discussion */}
          {isReplyingToThis && <ReplyBox parentId={discussion.id} />}

          {/* Render nested replies within the same container */}
          {replies.length > 0 && (
            <div className="mt-6 space-y-4 border-t border-gray-200 pt-4">
              {replies.map((reply) => (
                <div key={reply.id} className="pl-4 border-l-2 border-purple-200">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-300 to-pink-200 flex items-center justify-center text-white text-sm">
                      {reply.username.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{reply.username}</p>
                        <p className="text-xs text-gray-500">{reply.timestamp}</p>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed mb-2">{reply.comment}</p>
                      
                      {reply.image && (
                        <div className="mb-3 rounded-xl overflow-hidden">
                          <img src={reply.image} alt="Reply attachment" className="w-full max-h-32 object-cover" />
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUpvote(reply.id)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-all ${
                            upvotedComments.includes(reply.id)
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-purple-50'
                          }`}
                        >
                          <ThumbsUp
                            className="w-3 h-3"
                            fill={upvotedComments.includes(reply.id) ? 'currentColor' : 'none'}
                          />
                          <span>{reply.upvotes}</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setReplyingTo(reply.id)}
                          className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all text-xs"
                        >
                          <Reply className="w-3 h-3" />
                          <span>Reply</span>
                        </motion.button>
                      </div>
                      
                      {/* Nested reply box for this reply */}
                      {replyingTo === reply.id && <ReplyBox parentId={reply.id} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
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
            onClick={() => onNavigate('explore')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explore</span>
          </button>
          <h1 className="text-4xl mb-2">General Discussion</h1>
          <p className="text-gray-600">Connect with the Eventurer community</p>
        </motion.div>

        {/* Add New Comment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-md mb-8"
        >
          <h3 className="text-xl mb-4">Start a Discussion</h3>

          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ask questions, share tips, or discuss events with the community..."
            className="rounded-2xl min-h-[120px] mb-4"
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
              onClick={handleAddComment}
              disabled={!newComment.trim() && !selectedImage}
              className="rounded-full bg-gradient-to-r from-purple-400 to-pink-300 hover:shadow-lg"
            >
              <Send className="w-4 h-4 mr-2" />
              Post Comment
            </Button>
          </div>
        </motion.div>

        {/* Discussion Threads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-2xl mb-4">Community Discussions ({sortedDiscussions.length})</h2>

          {topLevelDiscussions.map((discussion, idx) => (
            <motion.div
              key={discussion.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <RenderDiscussion discussion={discussion} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
