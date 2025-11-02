import { useRef, useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { Image as ImageIcon, Send, X } from "lucide-react";

interface NewPostFormProps {
  // pass a Blob for images to allow binary storage in IndexedDB
  onAddPost: (comment: string, image?: Blob) => void;
}

export default function NewPostForm({ onAddPost }: NewPostFormProps) {
  const [text, setText] = useState("");
  // preview URL for display
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // binary blob to store/forward to storage layer
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      // cleanup any object URL when component unmounts
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // resize/compress file to reduce storage usage before saving
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // revoke previous preview if present
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    setImageBlob(null);

    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        // max dimension to keep under reasonable size (adjust as needed)
        const MAX_DIM = 1024;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          const ratio = width / height;
          if (ratio > 1) {
            width = MAX_DIM;
            height = Math.round(MAX_DIM / ratio);
          } else {
            height = MAX_DIM;
            width = Math.round(MAX_DIM * ratio);
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          // fallback: keep original file as blob
          setImageBlob(f);
          setImagePreview(URL.createObjectURL(f));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        // quality 0.8 JPEG reduces size; you can tune this
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              // fallback to original file
              setImageBlob(f);
              setImagePreview(URL.createObjectURL(f));
              return;
            }
            setImageBlob(blob);
            setImagePreview(URL.createObjectURL(blob));
          },
          "image/jpeg",
          0.8
        );
      };
      img.onerror = () => {
        // on error, fallback to original file preview/blob
        setImageBlob(f);
        setImagePreview(URL.createObjectURL(f));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(f);
  };

  const handleSubmit = () => {
    if (!text.trim() && !imageBlob) return;
    try {
      onAddPost(text, imageBlob || undefined);
      setText("");
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      setImageBlob(null);
    } catch (err: any) {
      // If storage layer throws QuotaExceeded, catch it there; you can also surface it here
      console.error("Failed to add post:", err);
      // Optionally show a toast or fallback UI here
    }
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

      {imagePreview && (
        <div className="relative mb-3 sm:mb-4 rounded-xl sm:rounded-2xl overflow-hidden">
          <img
            src={imagePreview}
            alt="Upload preview"
            className="w-full h-full sm:max-h-64 object-contain rounded-xl sm:rounded-2xl bg-gray-50"
          />
          <button
            onClick={() => {
              if (imagePreview) URL.revokeObjectURL(imagePreview);
              setImagePreview(null);
              setImageBlob(null);
            }}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 mt-3">
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
          className="rounded-full text-sm sm:text-base py-2 sm:py-2.5 w-full sm:w-1/2"
        >
          <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Add Image
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!text.trim() && !imageBlob}
          className="rounded-xl bg-pink-400 hover:bg-pink-500 hover:shadow-lg text-sm sm:text-base py-2 sm:py-2.5 w-full sm:w-1/2 font-semibold"
        >
          <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Post Comment
        </Button>
      </div>
    </div>
  );
}
