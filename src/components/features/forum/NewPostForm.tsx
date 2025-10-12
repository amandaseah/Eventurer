{/* this is used for the textarea post */}
import { useRef, useState } from "react";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { Image as ImageIcon, Send, X } from "lucide-react";

export default function NewPostForm({
  onAddPost,
}: {
  onAddPost: (payload: { comment: string; image?: string | null }) => void;
}) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmit = () => {
    if (!text.trim() && !image) return;
    onAddPost({ comment: text, image });
    setText("");
    setImage(null);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md mb-8">
      <h3 className="text-xl mb-4">Add Your Comment</h3>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your thoughts, ask questions, or connect with other attendees..."
        className="rounded-2xl min-h-[100px] mb-4"
      />

      {image && (
        <div className="relative mb-4 rounded-2xl overflow-hidden">
          <img src={image} alt="Upload preview" className="w-full max-h-64 object-cover rounded-2xl" />
          <button
            onClick={() => setImage(null)}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        <Button onClick={() => fileRef.current?.click()} variant="outline" className="rounded-full">
          <ImageIcon className="w-4 h-4 mr-2" />
          Add Image
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!text.trim() && !image}
          className="rounded-full bg-gradient-to-r from-purple-400 to-pink-300 hover:shadow-lg"
        >
          <Send className="w-4 h-4 mr-2" />
          Post Comment
        </Button>
      </div>
    </div>
  );
}