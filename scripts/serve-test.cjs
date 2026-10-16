// Local static server with the same SPA fallback used on Vercel.
const http = require("node:http"),
  fs = require("node:fs"),
  path = require("node:path");
const root = path.resolve("dist");
http
  .createServer((req, res) => {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    let file = path.resolve(root, "." + pathname);
    if (!file.startsWith(root + path.sep) && file !== root) {
      res.writeHead(403);
      return res.end();
    }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory())
      file = path.join(root, "index.html");
    const types = {
      ".html": "text/html",
      ".js": "application/javascript",
      ".css": "text/css",
      ".png": "image/png",
      ".svg": "image/svg+xml",
      ".json": "application/json",
    };
    res.setHeader(
      "Content-Type",
      types[path.extname(file)] || "application/octet-stream",
    );
    fs.createReadStream(file).pipe(res);
  })
  .listen(4173, "0.0.0.0", () =>
    console.log("PracticePal test server: http://localhost:4173"),
  );
