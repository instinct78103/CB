import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  // add ip address to etc/hosts (e.g. 172.99.0.2 driveredtogo.com) to open driveredtogo.com:3000 in the browser
  server:{
  //   allowedHosts: ['driveredtogo.com']
    proxy: {
      '/wp-json': {
        target: 'http://tdc_nginx',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/js/index.js`,
        chunkFileNames: `assets/js/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  esbuild: { legalComments: 'none' },
})
