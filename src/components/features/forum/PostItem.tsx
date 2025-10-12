import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { ForumPost } from "./types";
import { ThumbsUp, Reply, Image as ImageIcon, X } from "lucide-react";

export default function PostItem({
  post,
  depth = 0,
  upvotedPosts,
  onUpvote,
  onSubmitReply,
  replies,
}: {
  post: ForumPost;
  depth?: number;
  upvotedPosts: number[];
  onUpvote: (postId: number) => void;
  onSubmitReply: (payload: { parentId: number; comment: string; image?: string | null }) => void;
  replies: ForumPost[];
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyImage, setReplyImage] = useState<string | null>(null);
  const replyFileRef = useRef<HTMLInputElement>(null);

  const handleReplyImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onloadend = () => setReplyImage(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmitReply = () => {
    if (!replyText.trim() && !replyImage) return;
    onSubmitReply({ parentId: post.id, comment: replyText, image: replyImage || undefined });
    setReplyText("");
    setReplyImage(null);
    setIsReplying(false);
  };

  return (
    <div className={depth > 0 ? "ml-8 mt-3" : ""}>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`bg-white rounded-3xl p-6 shadow-md ${depth > 0 ? "bg-purple-50" : ""}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`${depth > 0 ? "w-8 h-8 text-sm" : "w-10 h-10"} rounded-full bg-gradient-to-br from-purple-400 to-pink-300 flex items-center justify-center text-white`}>
              {post.username.charAt(0)}
            </div>
            <div>
              <p className={`font-medium ${depth > 0 ? "text-sm" : ""}`}>{post.username}</p>
              <p className="text-xs text-gray-500">{post.timestamp}</p>
            </div>
          </div>
        </div>

        <p className={`text-gray-700 mb-4 leading-relaxed ${depth > 0 ? "text-sm" : ""}`}>{post.comment}</p>

        {post.image && (
          <div className="mb-4 rounded-2xl overflow-hidden">
            <img src={post.image} alt="Post attachment" className={`w-full object-cover ${depth > 0 ? "max-h-48" : "max-h-96"}`} />
          </div>
        )}

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onUpvote(post.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${depth > 0 ? "text-sm" : ""} ${
              upvotedPosts.includes(post.id)
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-600 hover:bg-purple-50"
            }`}
          >
            <ThumbsUp
              className={depth > 0 ? "w-3 h-3" : "w-4 h-4"}
              fill={upvotedPosts.includes(post.id) ? "currentColor" : "none"}
            />
            <span>{post.upvotes} upvotes</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsReplying(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all ${depth > 0 ? "text-sm" : ""}`}
          >
            <Reply className={depth > 0 ? "w-3 h-3" : "w-4 h-4"} />
            <span>Reply</span>
          </motion.button>
        </div>

        {isReplying && (
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
                ref={replyFileRef}
                type="file"
                accept="image/*"
                onChange={handleReplyImageSelect}
                className="hidden"
              />
              <Button onClick={() => replyFileRef.current?.click()} variant="outline" size="sm" className="rounded-full">
                <ImageIcon className="w-3 h-3 mr-1" />
                Image
              </Button>
              <Button onClick={handleSubmitReply} disabled={!replyText.trim() && !replyImage} size="sm" className="rounded-full bg-blue-500 hover:bg-blue-600">
                Reply
              </Button>
              <Button onClick={() => setIsReplying(false)} variant="ghost" size="sm" className="rounded-full">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* render nested replies */}
      {replies.length > 0 && (
        <div className={depth > 0 ? "border-l-2 border-purple-200 pl-4 mt-3" : "mt-4 space-y-3"}>
          {replies.map((r) => (
            <PostItem
              key={r.id}
              post={r}
              depth={depth + 1}
              upvotedPosts={upvotedPosts}
              onUpvote={onUpvote}
              onSubmitReply={onSubmitReply}
              replies={[]}
            />
          ))}
        </div>
      )}
    </div>
  );
}