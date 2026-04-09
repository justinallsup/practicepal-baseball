#!/usr/bin/env node
// Post-process Expo web export for Vercel compatibility
const fs = require('fs')
const path = require('path')

const distDir = path.join(process.cwd(), 'dist')
const indexPath = path.join(distDir, 'index.html')

if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html not found at', indexPath)
  process.exit(1)
}

let html = fs.readFileSync(indexPath, 'utf8')

// Remove type="module" from script tags — the Expo/Metro bundle is CommonJS,
// not an ES module. Loading it as type="module" causes scope/strict-mode issues.
html = html.replace(/<script type="module" src=/g, '<script src=')

// Remove any import.meta usage from non-module scripts — import.meta is a
// syntax error in classic scripts and will crash Chrome/Firefox.
// Replace with a safe no-op polyfill instead.
html = html.replace(
  /<script>\s*try\s*\{[^}]*import\.meta[^}]*\}[^<]*<\/script>/gs,
  '<script>\n    // No-op: Metro bundle does not use import.meta\n  </script>'
)

// Ensure __importMeta__ is defined safely (without using import.meta syntax)
if (!html.includes('__importMeta__')) {
  const polyfill = `<script>
    // Safe polyfill — does not use import.meta syntax
    if (typeof window !== 'undefined' && !window.__importMeta__) {
      Object.defineProperty(window, '__importMeta__', { value: { env: { MODE: 'production' } } });
    }
  </script>`
  html = html.replace('</head>', polyfill + '\n</head>')
}

fs.writeFileSync(indexPath, html)
console.log('✅ Post-processed dist/index.html')
console.log('   Removed type="module" (Metro bundle is CommonJS)')
console.log('   Removed import.meta usage from classic scripts')
