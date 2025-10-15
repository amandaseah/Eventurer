import { MessageSquare, ThumbsUp } from "lucide-react";

interface Post {
  id: string;
  text: string;
  image?: string;
  createdAt: number;
  username: string;
  upvotes: number;
}

interface PostListProps {
  eventId: number;
  posts: Post[];
  onUpvote: (id: string) => void;
}

export default function PostList({ posts, onUpvote }: PostListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageSquare className="w-8 h-8 mx-auto mb-2" />
        <p>No comments yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <div
          key={post.id}
          className="bg-white rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-purple-600">
              {post.username}
            </span>
            <span className="text-gray-400 text-sm">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>

          <p className="text-gray-800 whitespace-pre-wrap mb-4">{post.text}</p>

          {post.image && (
            <img
              src={post.image}
              alt="Post"
              className="rounded-xl mb-4 max-h-64 object-cover w-full"
            />
          )}

          <button
            onClick={() => onUpvote(post.id)}
            className="flex items-center gap-1 text-purple-500 hover:text-purple-700 transition-colors"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{post.upvotes}</span>
          </button>
        </div>
      ))}
    </div>
  );
}