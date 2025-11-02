const DB_NAME = 'eventurerDB';
const DB_VERSION = 1;

interface Post {
  id: string;
  eventId: number;
  text: string;
  imageId?: string; // Reference to image store
  username: string;
  timestamp: number;
  upvotes: string[];
  replies?: Post[];
}

class EventurerDB {
  private db: IDBDatabase | null = null;

  async init() {
    try {
      this.db = await new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          // Posts store
          if (!db.objectStoreNames.contains('posts')) {
            const postStore = db.createObjectStore('posts', { keyPath: 'id' });
            postStore.createIndex('eventId', 'eventId', { unique: false });
          }

          // Binary image store
          if (!db.objectStoreNames.contains('images')) {
            db.createObjectStore('images', { keyPath: 'id' });
          }
        };
      });
      return true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      return false;
    }
  }

  async addPost(post: Post, image?: Blob): Promise<boolean> {
    if (!this.db) return false;

    try {
      // Check available space if there's an image
      if (image) {
        const quota = await navigator.storage?.estimate();
        if (quota && quota.usage && quota.quota) {
          const available = quota.quota - quota.usage;
          if (image.size > available) {
            throw new Error('Storage quota exceeded');
          }
        }
      }

      const tx = this.db.transaction(['posts', 'images'], 'readwrite');
      
      // Store image separately if present
      if (image) {
        const imageId = `img_${Date.now()}`;
        await new Promise((resolve, reject) => {
          const imageStore = tx.objectStore('images');
          const imageRequest = imageStore.add({ id: imageId, data: image });
          imageRequest.onsuccess = () => resolve(true);
          imageRequest.onerror = () => reject(imageRequest.error);
        });
        post.imageId = imageId;
      }

      // Store post
      await new Promise((resolve, reject) => {
        const postStore = tx.objectStore('posts');
        const postRequest = postStore.add(post);
        postRequest.onsuccess = () => resolve(true);
        postRequest.onerror = () => reject(postRequest.error);
      });

      return true;
    } catch (error) {
      console.error('Failed to add post:', error);
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        // Handle quota exceeded - maybe trigger cleanup
        await this.cleanupOldData();
      }
      return false;
    }
  }

  async getPostsByEvent(eventId: number): Promise<Post[]> {
    if (!this.db) return [];

    try {
      const tx = this.db.transaction(['posts', 'images'], 'readonly');
      const postStore = tx.objectStore('posts');
      const eventIndex = postStore.index('eventId');

      const posts = await new Promise<Post[]>((resolve, reject) => {
        const request = eventIndex.getAll(eventId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      // Load images for posts
      const postsWithImages = await Promise.all(
        posts.map(async (post) => {
          if (post.imageId) {
            const imageBlob = await this.getImage(post.imageId);
            return { ...post, image: imageBlob };
          }
          return post;
        })
      );

      return postsWithImages;
    } catch (error) {
      console.error('Failed to get posts:', error);
      return [];
    }
  }

  async getPostById(id: string): Promise<Post | null> {
    if (!this.db) return null;
    try {
      const tx = this.db.transaction('posts', 'readonly');
      const store = tx.objectStore('posts');
      return await new Promise<Post | null>((resolve, reject) => {
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch (error) {
      console.error('Failed to get post by id:', error);
      return null;
    }
  }

  async updatePost(id: string, patch: Partial<Post>): Promise<boolean> {
    if (!this.db) return false;
    try {
      const tx = this.db.transaction(['posts', 'images'], 'readwrite');
      const postStore = tx.objectStore('posts');

      const post = await new Promise<Post | null>((resolve, reject) => {
        const req = postStore.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
      if (!post) return false;

      const updated = { ...post, ...patch };
      await new Promise<void>((resolve, reject) => {
        const putReq = postStore.put(updated);
        putReq.onsuccess = () => resolve();
        putReq.onerror = () => reject(putReq.error);
      });
      return true;
    } catch (error) {
      console.error('Failed to update post:', error);
      return false;
    }
  }

  async addReply(postId: string, reply: Post, image?: Blob): Promise<boolean> {
    if (!this.db) return false;
    try {
      const tx = this.db.transaction(['posts', 'images'], 'readwrite');
      const postStore = tx.objectStore('posts');
      const imageStore = tx.objectStore('images');

      // store image if present
      if (image) {
        const imageId = `img_${Date.now()}`;
        await new Promise((resolve, reject) => {
          const req = imageStore.add({ id: imageId, data: image });
          req.onsuccess = () => resolve(true);
          req.onerror = () => reject(req.error);
        });
        reply.imageId = imageId;
      }

      const post = await new Promise<Post | null>((resolve, reject) => {
        const req = postStore.get(postId);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
      if (!post) return false;

      const replies = [...(post.replies || []), reply];
      post.replies = replies;

      await new Promise<void>((resolve, reject) => {
        const putReq = postStore.put(post);
        putReq.onsuccess = () => resolve();
        putReq.onerror = () => reject(putReq.error);
      });
      return true;
    } catch (error) {
      console.error('Failed to add reply:', error);
      return false;
    }
  }

  private async getImage(imageId: string): Promise<Blob | null> {
    if (!this.db) return null;

    try {
      const tx = this.db.transaction('images', 'readonly');
      const imageStore = tx.objectStore('images');
      
      return new Promise((resolve, reject) => {
        const request = imageStore.get(imageId);
        request.onsuccess = () => resolve(request.result?.data || null);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get image:', error);
      return null;
    }
  }

  private async cleanupOldData() {
    if (!this.db) return;

    try {
      const tx = this.db.transaction(['posts', 'images'], 'readwrite');
      const postStore = tx.objectStore('posts');
      const imageStore = tx.objectStore('images');

      // Delete posts older than 30 days
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const posts = await new Promise<Post[]>((resolve, reject) => {
        const request = postStore.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      const oldPosts = posts.filter(post => post.timestamp < thirtyDaysAgo);
      
      // Delete old posts and their images
      for (const post of oldPosts) {
        postStore.delete(post.id);
        if (post.imageId) {
          imageStore.delete(post.imageId);
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old data:', error);
    }
  }
}

export const db = new EventurerDB();