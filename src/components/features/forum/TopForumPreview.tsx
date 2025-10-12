// src/features/forum/TopForumPreview.tsx
import { motion } from "motion/react";
import { Button } from "../../ui/button";
import { ThumbsUp } from "lucide-react";

type Post = { id: number; username: string; timestamp: string; comment: string; upvotes: number };

export default function TopForumPreview({
  posts,
  onViewAll,
}: {
  posts: Post[];
  onViewAll: () => void;
}) {
  if (!posts?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-3xl p-8 shadow-md mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl">Top Forum Posts</h2>
        <Button variant="outline" onClick={onViewAll} className="rounded-full">
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {/* ⬇ paste the .map(post => ...) you cut, but remove motion wrappers if duplicated */}
        {posts.slice(0, 3).map((post) => (
          <motion.div key={post.id} whileHover={{ x: 4 }} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-start justify-between mb-2">
              <p className="font-medium text-sm">{post.username}</p>
              <span className="text-xs text-gray-500">{post.timestamp}</span>
            </div>
            <p className="text-gray-700 mb-3">{post.comment}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ThumbsUp className="w-4 h-4" />
              <span>{post.upvotes} upvotes</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}