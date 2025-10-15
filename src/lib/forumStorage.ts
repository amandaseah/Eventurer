1  import { Post, Comment } from '../models/post';
2
3  const LS_KEY = 'eventurer_forum_posts_v1';
4
5  function readAll(): Post[] {
6    try {
7      const raw = localStorage.getItem(LS_KEY);
8      if (!raw) return [];
9      const parsed = JSON.parse(raw) as Post[];
10     // basic validation fallback
11     if (!Array.isArray(parsed)) return [];
12     return parsed;
13   } catch (e) {
14     console.error('forumStorage read error', e);
15     return [];
16   }
17 }
18
19 function writeAll(posts: Post[]) {
20   localStorage.setItem(LS_KEY, JSON.stringify(posts));
21 }
22
23 export function getPosts(): Post[] {
24   return readAll().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
25 }
26
27 export function getPost(id: string): Post | undefined {
28   return readAll().find(p => p.id === id);
29 }
30
31 export function addPost(post: Post) {
32   const posts = readAll();
33   posts.push(post);
34   writeAll(posts);
35 }
36
37 export function updatePost(updated: Post) {
38   const posts = readAll();
39   const idx = posts.findIndex(p => p.id === updated.id);
40   if (idx === -1) return false;
41   posts[idx] = updated;
42   writeAll(posts);
43   return true;
44 }
45
46 export function deletePost(id: string) {
47   let posts = readAll();
48   posts = posts.filter(p => p.id !== id);
49   writeAll(posts);
50 }
51
52 export function addComment(postId: string, comment: Comment) {
53   const posts = readAll();
54   const idx = posts.findIndex(p => p.id === postId);
55   if (idx === -1) return false;
56   posts[idx].comments.push(comment);
57   writeAll(posts);
58   return true;
59 }
