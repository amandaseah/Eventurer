{/* this is used for the quick text bar */}

import { useState } from "react";
import { Button } from "../../ui/button";

export default function Composer({ onPost }: { onPost: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <div className="bg-white rounded-3xl p-4 shadow-md mb-4">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border rounded-2xl p-3"
        placeholder="Write a quick update..."
      />
      <div className="text-right mt-2">
        <Button
          onClick={() => { if (text.trim()) { onPost(text); setText(""); } }}
          className="rounded-xl"
        >
          Post
        </Button>
      </div>
    </div>
  );
}