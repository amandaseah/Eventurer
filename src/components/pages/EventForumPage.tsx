import { motion } from 'motion/react';
import { Header } from '../Header';
import { MessageSquare, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { BackButton } from '../shared/BackButton';
import NewPostForm from "../features/forum/NewPostForm";
import PostList from "../features/forum/PostList";
import { useEventForum } from "../../hooks/useEventForum";
import Footer from "../shared/Footer";
import { useEffect, useState } from 'react';
import { fetchEventbriteEventsForMe } from '../../lib/eventbriteService';

interface EventForumPageProps {
  eventId: number;
  events: any[];
  onGoBack: () => void;
  onNavigate: (page: string, data?: any) => void;
  username: string;
}

export function EventForumPage({ eventId, events, onGoBack, onNavigate, username }: EventForumPageProps) {
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const { posts, isConnected, isLoading, addPost, upvotePost, addReply } = useEventForum(eventId);

  // Fetch event details if not in events array
  useEffect(() => {
    let isMounted = true;

    async function loadEvent() {
      try {
        setLoading(true);
        let eventData = null;

        // If parent already passed in events, use them
        if (events && events.length > 0) {
          eventData = events.find(e => e.id.toString() === eventId.toString());

          // If not found in provided events, fetch from Eventbrite
          if (!eventData) {
            console.log('[EventForumPage] Event not in props, fetching from Eventbrite...');
            const allEvents = await fetchEventbriteEventsForMe();
            eventData = allEvents.find((e: any) => String(e.id) === String(eventId));
          }
        } else {
          // No events provided, fetch from Eventbrite directly
          console.log('[EventForumPage] No events in props, fetching from Eventbrite...');
          const allEvents = await fetchEventbriteEventsForMe();
          eventData = allEvents.find((e: any) => String(e.id) === String(eventId));
        }

        if (isMounted) {
          setEvent(eventData || null);
        }
      } catch (err) {
        console.error('Failed to fetch event:', err);
        if (isMounted) {
          setEvent(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadEvent();

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  // Show loading state while fetching
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-pink-50/30 to-white flex flex-col">
        <Header onNavigate={onNavigate} />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-pink-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-pink-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-xl text-gray-700 font-medium">Loading event forum...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-pink-50/30 to-white flex flex-col">
        <Header onNavigate={onNavigate} />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md my-auto"
          >
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <MessageSquare className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Event Forum Not Found</h2>
            <p className="text-gray-600 mb-12">
              The event forum you're looking for doesn't exist or has been removed.
            </p>
            <div className="flex gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('explore')}
                className="bg-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-pink-600 transition-all"
              >
                Explore Events
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onGoBack}
                className="bg-white text-gray-700 py-3 px-6 rounded-xl font-semibold border-2 border-gray-300 hover:bg-gray-50 transition-all"
              >
                Go Back
              </motion.button>
            </div>
          </motion.div>
        </div>
        <Footer onNavigate={onNavigate} />
      </div>
    );
  }

  //console.log("EventForumPage loaded with username:", username);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={onNavigate} />

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        {/* Back Button - Sticky */}
        <BackButton onClick={onGoBack} label="Back to Event" />

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{event.title}</h1>
              <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
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
            Posting as <span className="font-semibold text-pink-500">{username}</span>
          </div>
        </motion.div>

        {isLoading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl">
            <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
            <p className="text-gray-500">Loading forum...</p>
          </motion.div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <NewPostForm onAddPost={(text, image) => addPost(text, image, username)}/>
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

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 p-4 bg-pink-50 rounded-2xl border border-pink-200">
          <p className="text-sm text-pink-600 text-center">
            💬 This forum updates in real-time. New comments and upvotes appear instantly!
          </p>
        </motion.div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
