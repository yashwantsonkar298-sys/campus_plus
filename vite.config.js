import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { createRegistrationHandler } from './server/registrations.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // loadEnv stays in this Node config: never expose provider secrets via VITE_*.
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }
  return {
    plugins: [react(), {
      name: 'registration-api',
      configureServer(server) {
        server.middlewares.use(createRegistrationHandler({ env }))
      },
      configurePreviewServer(server) {
        server.middlewares.use(createRegistrationHandler({ env }))
      },
    }],
  }
})
