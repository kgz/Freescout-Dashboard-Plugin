import eslintPlugin from '@nabla/vite-plugin-eslint'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, loadEnv } from 'vite'
import checker from 'vite-plugin-checker'

const outputConfig = {
    entryFileNames: 'xero_invoice_export.min.js',
    chunkFileNames: '[name]-[hash].js',
    assetFileNames: 'xero_invoice_export.min.[ext]',
}
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;



// https://vitejs.dev/config/
export default ({ mode }) => {
    const env = loadEnv(mode, process.cwd())
    const outputs = [env.VITE_OUTPUT_DIR]

    return defineConfig({
        
        plugins: [
            react(),
            eslintPlugin({}),
            checker({
                typescript: true,
                eslint: {
                    lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
                },
            }),
            visualizer({
                filename: './.stats/treemap.html',
                template: 'treemap',
                sourcemap: true
            }),
            visualizer({
                filename: './.stats/sunburst.html',
                template: 'sunburst',
                sourcemap: true
            }),
            visualizer({
                filename: './.stats/network.html',
                template: 'network',
                sourcemap: true
            }),
            visualizer({
                filename: './.stats/raw-data.json',
                template: 'raw-data',
                sourcemap: true
            }),
            visualizer({
                filename: './.stats/list.yml',
                template: 'list',
                sourcemap: true
            })
        ],
        build: {
            rollupOptions: {
                external: ['moment-timezone'],
                input: {
                    main: env.VITE_ENTRYPOINT,
                },
                output: outputs.map(output => ({
                    ...outputConfig,
                    dir: output
                }))
            },
            outDir: 'dist',
            sourcemap: true,
            emptyOutDir: true,
        },
        server: {
            host: env.VITE_HOST,
            https: false,
            port: Number(env.VITE_PORT),
        },
        resolve: {
            alias: [
                { find: '@s', replacement: path.resolve(__dirname, 'src/@styles') },
                { find: '@t', replacement: path.resolve(__dirname, 'src/@types') },
                { find: '@a', replacement: path.resolve(__dirname, 'src/@assets') },
                // { "./dist/cpexcel.js": "" }

            ]
        }
    }
    )

}