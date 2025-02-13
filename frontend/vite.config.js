// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'


// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),
//   ],
// })



import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {

    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        // You can optionally use a rewrite function if needed:
        // rewrite: (path) => path.replace(/^\/api/, '/api'),
      },

      // proxy: {
      //   '/api': 'http://localhost:8000', // Change this to your backend URL
      // },


      // '/api': {
      //   target: 'http://localhost:8000',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ''), // Removes the '/api' prefix
      // },

    },
  },
},);

