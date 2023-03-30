import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [ElementPlusResolver()]
        }),
        viteCompression({
            verbose: true,
            disable: false,
            algorithm: 'gzip',
            ext: '.gz'
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
        target: 'es2015',
        // brotliSize: false,
        chunkSizeWarningLimit: 500,
        rollupOptions: {
            input: 'src/main.ts',
            output: {
                manualChunks: {
                    // 将 lodash 单独拆分为一个块
                    // lodash: ['lodash'],
                    // 将 Vue 相关的代码拆分为一个块
                    vue: ['vue', 'vue-router', '@vueuse/core'],
                },
            }
        }
    }
})
