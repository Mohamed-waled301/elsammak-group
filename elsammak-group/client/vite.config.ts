import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')

function readDevApiPort(): number {
  const fromEnv = Number(process.env.VITE_DEV_API_PORT)
  if (Number.isFinite(fromEnv) && fromEnv > 0) return fromEnv
  try {
    const s = fs.readFileSync(path.join(repoRoot, '.dev-api-port'), 'utf8').trim()
    const n = Number(s)
    if (Number.isFinite(n) && n > 0) return n
  } catch {
    /* file not written yet */
  }
  return 5000
}

/** Local Express in dev; production preview can set VITE_API_URL. */
function resolveDevProxyTarget(env: Record<string, string>): string {
  const explicit = (env.VITE_API_URL || '').trim()
  if (explicit) return explicit.replace(/\/$/, '')
  const port = readDevApiPort()
  return `http://127.0.0.1:${port}`
}

/**
 * Merge repo root + client/.env so VITE_* works from either place (npm workspaces / monorepo).
 * Order: root first, then client — client values override root for the same key.
 */
function mergedEnv(mode: string) {
  const rootDir = path.resolve(__dirname, '..')
  const clientDir = __dirname
  return { ...loadEnv(mode, rootDir, ''), ...loadEnv(mode, clientDir, '') }
}

export default defineConfig(({ mode }) => {
  const env = mergedEnv(mode)
  const apiTarget = mode === 'development' ? resolveDevProxyTarget(env) : (env.VITE_API_URL || '').trim().replace(/\/$/, '') || 'http://127.0.0.1:5000'
  const viteEnvDefine = Object.fromEntries(
    Object.entries(env)
      .filter(([key]) => key.startsWith('VITE_'))
      .map(([key, val]) => [`import.meta.env.${key}`, JSON.stringify(val ?? '')])
  ) as Record<string, string>

  return {
    resolve: {
      alias: {
        '@project-data': path.resolve(__dirname, '../data'),
      },
    },
    /** Root-relative assets — required for Vercel / React Router (avoid `./` breaking deep routes). */
    base: '/',
    /** Injects merged VITE_* so the bundle matches root + client/.env (client wins). */
    define: viteEnvDefine,
    envDir: __dirname,
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      host: '0.0.0.0',
      strictPort: false,
      fs: {
        allow: [path.resolve(__dirname, '..')],
      },
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
