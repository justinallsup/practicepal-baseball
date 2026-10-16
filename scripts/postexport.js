#!/usr/bin/env node
// Post-process Expo web export for Vercel compatibility
const fs = require("fs");
const path = require("path");

const distDir = path.join(process.cwd(), "dist");
const indexPath = path.join(distDir, "index.html");

if (!fs.existsSync(indexPath)) {
  console.error("dist/index.html not found at", indexPath);
  process.exit(1);
}

let html = fs.readFileSync(indexPath, "utf8");

// Remove type="module" from script tags — the Expo/Metro bundle is CommonJS,
// not an ES module. Loading it as type="module" causes scope/strict-mode issues.
html = html.replace(/<script type="module" src=/g, "<script src=");

// Remove any import.meta usage from non-module scripts — import.meta is a
// syntax error in classic scripts and will crash Chrome/Firefox.
// Replace with a safe no-op polyfill instead.
html = html.replace(
  /<script>\s*try\s*\{[^}]*import\.meta[^}]*\}[^<]*<\/script>/gs,
  "<script>\n    // No-op: Metro bundle does not use import.meta\n  </script>",
);

// Ensure __importMeta__ is defined safely (without using import.meta syntax)
if (!html.includes("__importMeta__")) {
  const polyfill = `<script>
    // Safe polyfill — does not use import.meta syntax
    if (typeof window !== 'undefined' && !window.__importMeta__) {
      Object.defineProperty(window, '__importMeta__', { value: { env: { MODE: 'production' } } });
    }
  </script>`;
  html = html.replace("</head>", polyfill + "\n</head>");
}

// Public metadata without player data. No analytics or payment script is injected.
html = html.replace(
  /<title>.*?<\/title>/,
  "<title>PracticePal Baseball | Build a better practice habit</title>",
);
html = html.replace(
  "</head>",
  `<meta name="description" content="Build a baseball practice routine together. Guided drills, practice timers, personal progress, and parent-approved rewards. Free to use." />
<meta name="theme-color" content="#102F29" />
<meta property="og:title" content="PracticePal Baseball — Small sessions. Big habits." />
<meta property="og:description" content="A clear practice plan, real progress, and family rewards. Start free with no account or card." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://baseballpracticepal.com" />
<link rel="preload" href="/fonts/BarlowCondensed-Bold.ttf" as="font" type="font/ttf" crossorigin />
<link rel="preload" href="/fonts/Manrope.ttf" as="font" type="font/ttf" crossorigin />
<style>@font-face{font-family:BarlowCondensed;src:url('/fonts/BarlowCondensed-Bold.ttf') format('truetype');font-weight:700 900;font-display:swap}@font-face{font-family:Manrope;src:url('/fonts/Manrope.ttf') format('truetype');font-weight:200 800;font-display:swap}body{background:#F4F3ED}*:focus-visible{outline:3px solid #B88D32;outline-offset:3px}@media(max-width:600px){[data-testid="batting-photo"]>div{background-position:78% center!important}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;animation-duration:0.01ms!important;transition-duration:0.01ms!important}}</style>
</head>`,
);
fs.writeFileSync(indexPath, html);
console.log("✅ Post-processed dist/index.html");
console.log('   Removed type="module" (Metro bundle is CommonJS)');
console.log("   Removed import.meta usage from classic scripts");
