1  export type Comment = {
2    id: string;
3    author: string;
4    text: string;
5    createdAt: string; // ISO
6  };
7
8  export type Post = {
9    id: string;
10   title: string;
11   author: string;
12   body: string;
13   createdAt: string; // ISO
14   comments: Comment[];
15 };
