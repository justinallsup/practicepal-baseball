#!/usr/bin/env node
// Post-process Expo web export to fix import.meta compatibility
const fs = require('fs')
const path = require('path')

const distDir = path.join(process.cwd(), 'dist')
const indexPath = path.join(distDir, 'index.html')

if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html not found at', indexPath)
  process.exit(1)
}

let html = fs.readFileSync(indexPath, 'utf8')

// Add type="module" to script tags so import.meta works in Safari
html = html.replace(/<script src="([^"]+)" defer>/g, '<script type="module" src="$1">')

// Inject import.meta.env polyfill
const polyfill = `<script>
  try { import.meta } catch(e) {
    Object.defineProperty(window, '__importMeta__', { value: { env: { MODE: 'production' } } });
  }
</script>`
html = html.replace('</head>', polyfill + '\n</head>')

fs.writeFileSync(indexPath, html)
console.log('✅ Post-processed dist/index.html')
console.log('   Added type="module" to script tags')
