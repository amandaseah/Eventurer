import { motion } from 'motion/react';
import { Header } from '../Header';
import { events } from '../../lib/mockData';
import { MessageSquare, ArrowLeft, Wifi, WifiOff, Loader2 } from 'lucide-react';
import NewPostForm from "../features/forum/NewPostForm";
import PostList from "../features/forum/PostList";
import { useEventForum } from "../../hooks/useEventForum";

interface EventForumPageProps {
  eventId: number;
  onGoBack: () => void;
  onNavigate: (page: string, data?: any) => void;
  username: string;
}

export function EventForumPage({ eventId, onGoBack, onNavigate, username }: EventForumPageProps) {
  const event = events.find(e => e.id.toString() === eventId.toString());

  const { posts, isConnected, isLoading, addPost, upvotePost, addReply } = useEventForum(eventId);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Event not found</h2>
          <button
            onClick={() => onNavigate('explore')}
            className="text-purple-600 hover:underline"
          >
            Return to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Header onNavigate={onNavigate} />

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button
            onClick={onGoBack}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Event</span>
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
              <div className="flex items-center gap-3 text-gray-600">
                <MessageSquare className="w-5 h-5" />
                <span>Forum Discussion</span>
                <span className="text-gray-400">•</span>
                <span>{posts.length} comment{posts.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isConnected ? (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm">
                  <Wifi className="w-4 h-4" />
                  <span>Live</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full text-sm">
                  <WifiOff className="w-4 h-4" />
                  <span>Offline</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Posting as <span className="font-semibold text-purple-600">{username}</span>
          </div>
        </motion.div>

        {isLoading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl">
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
            <p className="text-gray-500">Loading forum...</p>
          </motion.div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <NewPostForm onAddPost={addPost} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
              <PostList
                eventId={eventId}
                posts={posts}
                username={username}
                onAddReply={(postId, text, image, parentReplyId) => addReply(postId, text, image, parentReplyId)}
                onUpvote={(postId) => upvotePost(postId, username)}
              />

            </motion.div>

            {posts.length === 0 && !isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center py-16 bg-white rounded-3xl shadow-md">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-xl text-gray-500 mb-2">No comments yet</p>
                <p className="text-gray-400">Be the first to start the discussion!</p>
              </motion.div>
            )}
          </>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 p-4 bg-purple-50 rounded-2xl border border-purple-200">
          <p className="text-sm text-purple-700 text-center">
            💬 This forum updates in real-time. New comments and upvotes appear instantly!
          </p>
        </motion.div>
      </div>
    </div>
  );
}