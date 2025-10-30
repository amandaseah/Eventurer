import { ThumbsUp, MessageCircle } from "lucide-react";
import { Button } from "../../ui/button";
import { formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";

interface Reply {
  id: string;
  text: string;
  createdAt: number;
  username: string;
  upvotes: number;
  upvotedBy: string[];
  replies: Reply[];
}

interface Post {
  id: string;
  text: string;
  createdAt: number;
  username: string;
  upvotes: number;
  upvotedBy?: string[];
  replies?: Reply[];
  imageUrl?: string;
}

interface TopForumPreviewProps {
  posts: Post[];
  onViewAll: () => void;
  onPostClick?: (postId: string) => void;
  upvotePost?: (postId: string) => void;
  username?: string;
}

// Helper function to count all nested replies
const countAllReplies = (replies: Reply[]): number => {
  return replies.reduce((total, reply) => {
    return total + 1 + countAllReplies(reply.replies || []);
  }, 0);
};

export default function TopForumPreview({
  posts,
  onViewAll,
  onPostClick,
  upvotePost,
  username,
}: TopForumPreviewProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="mt-12 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Top Forum Posts</h2>
          <Button variant="outline" onClick={onViewAll}>
            View All
          </Button>
        </div>
        <p className="text-gray-500 italic">
          No posts yet — be the first to share something!
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mt-12 mb-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Top Forum Posts
        </h2>
        <Button
          variant="outline"
          className="text-pink-500 border-pink-300 hover:bg-pink-50"
          onClick={onViewAll}
        >
          View All
        </Button>
      </div>

      {/* Posts */}
      <div className="space-y-5">
        {posts.map((post, index) => {
          const hasUpvoted = post.upvotedBy?.includes(username || "") || false;
          const replyCount = countAllReplies(post.replies || []);

          return (
            <motion.div
              key={post.id}
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(243, 232, 255, 0.6)",
                boxShadow: "0px 8px 20px rgba(168, 85, 247, 0.15)",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 20,
              }}
              onClick={() => onPostClick?.(post.id)}
              className={`group relative cursor-pointer p-5 rounded-2xl transition-all ${
                index !== 0 ? "border-t border-gray-100 pt-6" : ""
              }`}
            >
              {/* Top row: Username + Timestamp */}
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-pink-600">
                  @{post.username}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>

              {/* Post content */}
              <p className="text-gray-800 leading-relaxed mb-3 line-clamp-3">
                {post.text}
              </p>

              {post.imageUrl && (
                <div className="mb-3">
                  <img
                    src={post.imageUrl}
                    alt="Post image"
                    className="rounded-xl max-h-60 w-auto object-cover border border-gray-200 shadow-sm"
                  />
                </div>
              )}

              {/* Upvotes and Reply Count */}
              <div className="flex items-center gap-4">
                {upvotePost && username && (
                  <button
                    className={`flex items-center gap-2 text-sm ${
                      hasUpvoted ? "text-pink-600" : "text-gray-500 hover:text-pink-500"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening the post
                      upvotePost(post.id);
                    }}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{post.upvotes}</span>
                  </button>
                )}
                
                {/* Reply count */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MessageCircle className="w-4 h-4" />
                  <span>{replyCount}</span>
                </div>
              </div>

              {/* Hover glow border */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-pink-300"
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
