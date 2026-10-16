const config = require("../app.json").expo;
const fs = require("node:fs");
for (const file of [
  config.icon,
  config.splash.image,
  config.android.adaptiveIcon.foregroundImage,
])
  if (!fs.existsSync(file)) throw new Error("Missing asset: " + file);
if (!config.ios.bundleIdentifier || !config.android.package)
  throw new Error("Missing native identifiers");
console.log(
  "Native identifiers and assets present. Store submission disabled; developer accounts, EAS registration, signed builds, and device testing are still required.",
);
