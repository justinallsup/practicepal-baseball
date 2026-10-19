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
      ".jpg": "image/jpeg",
      ".ttf": "font/ttf",
      ".mp4": "video/mp4",
      ".vtt": "text/vtt",
    };
    res.setHeader(
      "Content-Type",
      types[path.extname(file)] || "application/octet-stream",
    );
    const size = fs.statSync(file).size;
    res.setHeader("Accept-Ranges", "bytes");
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]);
      const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
      if (start > end || start >= size) {
        res.writeHead(416, { "Content-Range": `bytes */${size}` });
        return res.end();
      }
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Content-Length": end - start + 1,
      });
      fs.createReadStream(file, { start, end }).pipe(res);
    } else {
      res.setHeader("Content-Length", size);
      fs.createReadStream(file).pipe(res);
    }
  })
  .listen(4173, "0.0.0.0", () =>
    console.log("PracticePal test server: http://localhost:4173"),
  );
