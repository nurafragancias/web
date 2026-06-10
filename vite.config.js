import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Plugin that adds API middleware for persistent catalog storage
function catalogApiPlugin() {
  const catalogPath = path.resolve(__dirname, 'data/catalog.json')
  const imagesDir = path.resolve(__dirname, 'public/images/products')

  return {
    name: 'catalog-api',
    configureServer(server) {
      // Helper to read body from request
      const readBody = (req) => new Promise((resolve, reject) => {
        const chunks = []
        req.on('data', chunk => chunks.push(chunk))
        req.on('end', () => resolve(Buffer.concat(chunks)))
        req.on('error', reject)
      })

      server.middlewares.use(async (req, res, next) => {
        // GET /api/catalog — read catalog from disk
        if (req.method === 'GET' && req.url === '/api/catalog') {
          try {
            const data = fs.readFileSync(catalogPath, 'utf8')
            res.setHeader('Content-Type', 'application/json')
            res.end(data)
          } catch (e) {
            res.statusCode = 404
            res.end(JSON.stringify({ error: 'Catalog file not found' }))
          }
          return
        }

        // POST /api/catalog — save catalog to disk
        if (req.method === 'POST' && req.url === '/api/catalog') {
          try {
            const body = await readBody(req)
            const products = JSON.parse(body.toString())
            fs.writeFileSync(catalogPath, JSON.stringify(products, null, 2), 'utf8')
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true, count: products.length }))
          } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: e.message }))
          }
          return
        }

        // POST /api/upload-image — save uploaded image to public/images/products/
        if (req.method === 'POST' && req.url === '/api/upload-image') {
          try {
            const body = await readBody(req)
            const { filename, data: base64Data } = JSON.parse(body.toString())

            // Sanitize filename
            const safeName = filename.replace(/[^a-zA-Z0-9._()-\s]/g, '').trim()
            if (!safeName) throw new Error('Invalid filename')

            // Decode base64 and save
            const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, '')
            const buffer = Buffer.from(base64Content, 'base64')

            const filePath = path.join(imagesDir, safeName)
            fs.writeFileSync(filePath, buffer)

            // Return the public URL path
            const urlPath = `/images/products/${encodeURIComponent(safeName)}`
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true, path: urlPath }))
          } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: e.message }))
          }
          return
        }

        // DELETE /api/image — delete image file from disk
        if (req.method === 'DELETE' && req.url?.startsWith('/api/image?')) {
          try {
            const url = new URL(req.url, 'http://localhost')
            const imagePath = url.searchParams.get('path')
            if (!imagePath) throw new Error('Missing path parameter')

            // Only allow deleting from images/products
            const decodedPath = decodeURIComponent(imagePath).replace(/^\//, '')
            const fullPath = path.resolve(__dirname, 'public', decodedPath)

            if (!fullPath.startsWith(imagesDir)) {
              throw new Error('Cannot delete files outside images/products')
            }

            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath)
            }

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: e.message }))
          }
          return
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), catalogApiPlugin()],
})
