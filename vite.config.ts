import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import compression from 'vite-plugin-compression'
import {terser} from 'rollup-plugin-terser';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [ElementPlusResolver()]
        }),
        compression({
            algorithm: 'gzip',
            ext: '.gz',
        })
    ],
    server: {
        host: '0.0.0.0'
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import"@/assets/scss/index.scss";'
            }
        }
    },
    build: {
        chunkSizeWarningLimit: 2000, // Adjusted chunk size limit for warning
        rollupOptions: {
            output: {
                manualChunks: {
                    gsap: ['gsap'],
                    pinia: ['pinia'],
                    vueRouter: ['vue-router'],
                    lottieWeb: ['lottie-web'],
                    axios: ['axios'],
                }
            }
        },
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
            format: {
                comments: false,
            },
        },
    }
})
