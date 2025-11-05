import PostItem from "./PostItem";

interface PostListProps {
  eventId: number;
  posts: any[];
  username: string;
  onUpvote: (postId: string) => void;
  onAddReply: (postId: string, text: string, image?: string, parentReplyId?: string) => void;
}

export default function PostList({ posts, username, onUpvote, onAddReply }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          username={username}
          onUpvote={onUpvote}
          onSubmitReply={(postId, text, image, parentReplyId) =>
            onAddReply(postId, text, image, parentReplyId)
          }
        />
      ))}
    </div>
  );
}