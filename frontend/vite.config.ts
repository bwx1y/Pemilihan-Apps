import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    server: {
        proxy: {
            "/api/v1": {
                target: "http://localhost:5000/api",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/v1/, "")
            },
            '/image': {
                target: 'http://localhost:5000',
                rewrite: (path) => path.replace(/^\/image/, '/api/Candidate') + '/Photo',
                changeOrigin: true,
            },
        }
    }
})
