import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
    nodePolyfills({
      // Enable polyfills for Node.js modules required by Midnight Network packages
      // Excluding 'stream' to avoid compatibility issues
      include: ['crypto', 'buffer', 'process', 'util'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    global: 'globalThis',
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/proof-server': {
        target: 'http://localhost:6300',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proof-server/, ''),
      },
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  optimizeDeps: {
    // Exclude Midnight packages from pre-bundling to avoid browser compatibility issues
    exclude: [
      '@midnight-ntwrk/compact-runtime',
      '@midnight-ntwrk/wallet',
      '@midnight-ntwrk/wallet-api',
      '@midnight-ntwrk/zswap',
      '@midnight-ntwrk/midnight-js-network-id',
      '@midnight-ntwrk/wallet-sdk-hd'
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'esnext',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  },
})
