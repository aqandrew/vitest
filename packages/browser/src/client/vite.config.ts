import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import { defineConfig } from 'vite'
import { resolve } from 'pathe'
import fg from 'fast-glob'

export default defineConfig({
  server: {
    watch: { ignored: ['**/**'] },
  },
  build: {
    minify: false,
    outDir: '../../dist/client',
    emptyOutDir: false,
    assetsDir: '__vitest_browser__',
    rollupOptions: {
      input: {
        'main': resolve(__dirname, 'index.html'),
        'page-tester': resolve(__dirname, 'tester.html'),
      },
    },
  },
  plugins: [
    {
      name: 'copy-ui-plugin',
      /* eslint-disable no-console */
      closeBundle: async () => {
        const root = resolve(fileURLToPath(import.meta.url), '../../../../../packages')

        const ui = resolve(root, 'ui/dist/client')
        const browser = resolve(root, 'browser/dist/client/__vitest__/')

        const timeout = setTimeout(() => console.log('[copy-ui-plugin] Waiting for UI to be built...'), 1000)
        await waitFor(() => fs.existsSync(ui))
        clearTimeout(timeout)

        const files = fg.sync('**/*', { cwd: ui })

        if (fs.existsSync(browser))
          fs.rmSync(browser, { recursive: true })

        fs.mkdirSync(browser, { recursive: true })
        fs.mkdirSync(resolve(browser, 'assets'))

        files.forEach((f) => {
          fs.copyFileSync(resolve(ui, f), resolve(browser, f))
        })

        console.log('[copy-ui-plugin] UI copied')
      },
    },
  ],
})

async function waitFor(method: () => boolean, retries = 100): Promise<void> {
  if (method())
    return

  if (retries === 0)
    throw new Error('Timeout in waitFor')

  await new Promise(resolve => setTimeout(resolve, 500))

  return waitFor(method, retries - 1)
}
