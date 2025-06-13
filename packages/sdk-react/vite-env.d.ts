/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv & {
    MODE: 'development' | 'production' | 'test'
    VITE_APP_ENV?: string
  };
} 