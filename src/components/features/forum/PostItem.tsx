import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { ThumbsUp, Reply } from "lucide-react";
import { Post, Reply as ReplyType } from "../../../lib/forumService";
import { Timestamp } from "firebase/firestore";

interface PostItemProps {
  post: Post;
  username: string;
  depth?: number;
  rootPostId?: string; // ID of the main post (for nested replies)
  onUpvote: (postId: string, replyId?: string) => void;
  onSubmitReply: (postId: string, text: string, image?: string, parentReplyId?: string) => void;
}

export default function PostItem({ post, username, depth = 0, rootPostId, onUpvote, onSubmitReply }: PostItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = () => {
    if (!replyText.trim()) return;

    // Use rootPostId if available (for nested replies), otherwise use current post ID
    const targetPostId = rootPostId || post.id;
    // If this is a nested reply (depth > 0), pass current post ID as parentReplyId
    const parentReplyId = depth > 0 ? post.id : undefined;
    
    onSubmitReply(targetPostId, replyText, undefined, parentReplyId);

    setReplyText("");
    setIsReplying(false);
  };

  const handleUpvote = () => {
    if (depth > 0) {
      // This is a reply, pass both post ID and reply ID
      const targetPostId = rootPostId || post.id;
      onUpvote(targetPostId, post.id);
    } else {
      // This is a main post
      onUpvote(post.id);
    }
  };

  return (
    <div className={depth > 0 ? "ml-8 mt-3" : ""}>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`bg-white rounded-3xl p-6 shadow-md ${depth > 0 ? "bg-pink-50" : ""}`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-pink-500">{post.username}</span>
          <span className="text-gray-400 text-sm">{post.createdAt?.toDate?.()?.toLocaleString() || 'Just now'}</span>
        </div>

        <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.text}</p>

        {/* Display image if present and this is a main post (not a reply) */}
        {post.image && depth === 0 && (
          <>
            <div className="mb-4 flex justify-center">
              <img 
                src={post.image} 
                alt="Post attachment" 
                className="rounded-2xl h-96"
              />
            </div>
          </>
        )}

        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1 transition-colors ${
              post.upvotedBy?.includes(username) ? "text-pink-600" : "text-gray-500 hover:text-pink-500"
            }`}
          >
            <ThumbsUp className={`${post.upvotedBy?.includes(username) ? "fill-pink-400" : ""} w-4 h-4`} />
            <span>{post.upvotes}</span>
          </button>

          <button
            onClick={() => setIsReplying(prev => !prev)}
            className="flex items-center gap-1 text-gray-500 hover:text-pink-500 transition-colors"
          >
            <Reply className="w-4 h-4" />
            <span>Reply</span>
          </button>
        </div>

        {isReplying && (
          <div className="mt-4 bg-pink-50 p-4 rounded-2xl">
            <Textarea
              placeholder="Write a reply..."
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              className="mb-3 rounded-2xl bg-white"
            />

            <div className="flex gap-2">
              <Button
                onClick={handleReply}
                disabled={!replyText.trim()}
                className="rounded-xl bg-pink-400 hover:bg-pink-500 hover:shadow-lg font-semibold"
                size="sm"
              >
                Post Reply
              </Button>
              <Button 
                onClick={() => {
                  setIsReplying(false);
                  setReplyText("");
                }}
                variant="outline" 
                size="sm"
                className="rounded-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Nested replies */}
        {post.replies.map(reply => (
          <PostItem
            key={reply.id}
            post={{...reply, eventId: post.eventId} as Post}
            username={username}
            depth={depth + 1}
            rootPostId={rootPostId || post.id}
            onUpvote={onUpvote}
            onSubmitReply={onSubmitReply}
          />
        ))}
      </motion.div>
    </div>
  );
}