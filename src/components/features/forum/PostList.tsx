{/* this is used for building threads*/}

import { motion } from "motion/react";
import { ForumPost } from "./types";
import PostItem from "./PostItem";

export default function PostList({
  posts,
  upvotedPosts,
  onUpvote,
  onSubmitReply,
}: {
  posts: ForumPost[];
  upvotedPosts: number[];
  onUpvote: (postId: number) => void;
  onSubmitReply: (payload: { parentId: number; comment: string; image?: string | null }) => void;
}) {
  // sort by upvotes (desc)
  const sorted = [...posts].sort((a, b) => b.upvotes - a.upvotes);

  // split to top-level and replies
  const topLevel = sorted.filter((p) => !p.replyTo);
  const getReplies = (id: number) => sorted.filter((p) => p.replyTo === id);

  return (
    <>
      <h2 className="text-2xl mb-4">Discussion ({sorted.length})</h2>
      {topLevel.map((p, idx) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <PostItem
            post={p}
            upvotedPosts={upvotedPosts}
            onUpvote={onUpvote}
            onSubmitReply={onSubmitReply}
            replies={getReplies(p.id)}
          />
        </motion.div>
      ))}

      {sorted.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-3xl"
        >
          <p className="text-xl text-gray-500 mb-2">No comments yet</p>
          <p className="text-gray-400">Be the first to start the discussion!</p>
        </motion.div>
      )}
    </>
  );
}