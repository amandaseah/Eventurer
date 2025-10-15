// src/components/forum/api.ts
const API_BASE = "http://localhost:5000/api/comments";

export async function getComments(eventId: number) {
  const res = await fetch(`${API_BASE}/${eventId}`);
  return res.json();
}

export async function addComment(eventId: number, userName: string, commentText: string) {
  const res = await fetch(`${API_BASE}/${eventId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_name: userName, comment_text: commentText })
  });
  return res.json();
}

export async function upvoteComment(commentId: number) {
  const res = await fetch(`${API_BASE}/${commentId}/upvote`, { method: "PUT" });
  return res.json();
}