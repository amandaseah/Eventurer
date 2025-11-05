import { useRef, useState } from "react";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { Image as ImageIcon, Send, X } from "lucide-react";

interface NewPostFormProps {
  onAddPost: (comment: string, image?: string) => void;
}

export default function NewPostForm({ onAddPost }: NewPostFormProps) {
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
    // Call the hook function with parameters
    onAddPost(text, image || undefined);
    setText("");
    setImage(null);
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md mb-6 sm:mb-8">
      <h3 className="text-base sm:text-xl mb-3 sm:mb-4 font-semibold">Add Your Comment</h3>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your thoughts, ask questions, or connect with other attendees..."
        className="rounded-xl sm:rounded-2xl min-h-[80px] sm:min-h-[100px] mb-3 sm:mb-4 text-sm sm:text-base"
      />

      {image && (
      <div className="relative mb-3 sm:mb-4 rounded-xl sm:rounded-2xl overflow-hidden">
          <img 
            src={image} 
            alt="Upload preview" 
<<<<<<< HEAD
            className="w-full h-full object-cover rounded-2xl" 
=======
            className="w-full h-full sm:max-h-64 object-contain rounded-xl sm:rounded-2xl bg-gray-50" 
>>>>>>> dev
          />
          <button
            onClick={() => setImage(null)}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 mt-3 w-full">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        <Button
          onClick={() => fileRef.current?.click()}
          variant="outline"
          className="rounded-full text-sm sm:text-base py-2 sm:py-2.5 w-full sm:flex-1"
        >
          <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Add Image
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!text.trim() && !image}
          className="rounded-xl bg-pink-400 hover:bg-pink-500 hover:shadow-lg text-sm sm:text-base py-2 sm:py-2.5 w-full sm:flex-1 font-semibold"
        >
          <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Post Comment
        </Button>
      </div>
    </div>
  );
}