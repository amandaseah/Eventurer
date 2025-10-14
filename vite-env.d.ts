/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GOOGLE_MAPS_API_KEY: string;
    // add other env vars here if needed, e.g.
    // readonly VITE_BACKEND_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }