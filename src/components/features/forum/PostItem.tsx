import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { ThumbsUp, Reply, Image as ImageIcon, X } from "lucide-react";

interface ReplyType {
  id: string;
  text: string;
  image?: string;
  createdAt: number;
  username: string;
  replies: ReplyType[];
  upvotes: number;
  upvotedBy?: string[];
}

interface PostType {
  id: string;
  text: string;
  image?: string;
  username: string;
  createdAt: number;
  upvotes: number;
  upvotedBy?: string[];
  replies: ReplyType[];
}

interface PostItemProps {
  post: PostType;
  username: string;
  depth?: number;
  onUpvote: (id: string) => void;
  onSubmitReply: (text: string, image?: string, replyToId?: string) => void;
}

export default function PostItem({ post, username, depth = 0, onUpvote, onSubmitReply }: PostItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyImage, setReplyImage] = useState<string | null>(null);
  const replyFileRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onloadend = () => setReplyImage(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleReply = () => {
    if (!replyText.trim() && !replyImage) return;

    // Pass replyText, image, and optionally parentReplyId
    onSubmitReply(replyText, replyImage || undefined, depth > 0 ? post.id : undefined);

    setReplyText("");
    setReplyImage(null);
    setIsReplying(false);
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
          <span className="text-gray-400 text-sm">{new Date(post.createdAt).toLocaleString()}</span>
        </div>

        <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.text}</p>

        {/* Display image if present */}
        {post.image && (
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
            onClick={() => onUpvote(post.id)}
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

            {/* Image preview */}
            {replyImage && (
              <div className="relative mb-3 rounded-2xl overflow-hidden">
                <img 
                  src={replyImage} 
                  alt="Reply preview" 
                  className="w-full h-full object-cover rounded-2xl" 
                />
                <button
                  onClick={() => setReplyImage(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <input
                ref={replyFileRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button 
                onClick={() => replyFileRef.current?.click()} 
                variant="outline" 
                size="sm"
                className="rounded-full"
              >
                <ImageIcon className="w-4 h-4 mr-1" />
                Image
              </Button>
              <Button
                onClick={handleReply}
                disabled={!replyText.trim() && !replyImage}
                className="rounded-xl bg-pink-400 hover:bg-pink-500 hover:shadow-lg font-semibold"
                size="sm"
              >
                Post Reply
              </Button>
              <Button 
                onClick={() => {
                  setIsReplying(false);
                  setReplyText("");
                  setReplyImage(null);
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
            post={reply}
            username={username}
            depth={depth + 1}
            onUpvote={onUpvote}
            onSubmitReply={onSubmitReply}
          />
        ))}
      </motion.div>
    </div>
  );
}