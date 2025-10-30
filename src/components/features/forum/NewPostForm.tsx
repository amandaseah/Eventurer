import { useRef, useState } from "react";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { Image as ImageIcon, Send, X } from "lucide-react";

interface NewPostFormProps {
  onAddPost: (comment: string, image?: string) => void;
}

// Utility function to resize image while maintaining aspect ratio
const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          
          if (width > height) {
            width = maxWidth;
            height = width / aspectRatio;
          } else {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
        }
        
        // Convert to base64 with good quality
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function NewPostForm({ onAddPost }: NewPostFormProps) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    
    try {
      // Resize image to max 800x800px while maintaining aspect ratio
      const resizedImage = await resizeImage(f, 800, 800);
      setImage(resizedImage);
    } catch (error) {
      console.error('Error resizing image:', error);
      // Fallback to original behavior if resize fails
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(f);
    }
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
            className="w-full max-h-48 sm:max-h-64 object-contain rounded-xl sm:rounded-2xl bg-gray-50"
          />
          <button
            onClick={() => setImage(null)}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}

      <div className="flex justify-end items-center flex-wrap gap-3 mt-3">
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
          className="rounded-full text-sm sm:text-base py-2 sm:py-2.5 sm:w-auto"
        >
          <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Add Image
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!text.trim() && !image}
          className="rounded-xl bg-purple-600 hover:bg-purple-700 hover:shadow-lg text-sm sm:text-base py-2 sm:py-2.5 w-full sm:w-auto font-semibold"
        >
          <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Post Comment
        </Button>
      </div>
    </div>
  );
}