import fs from "node:fs";
import path from "node:path";

// The site is fully static: just copy the source files into dist/.
// No bundler, no dependencies, no path rewriting.
const root = process.cwd();
const out = path.join(root, "dist");

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const f of fs.readdirSync(root).filter((n) => n.endsWith(".html"))) {
  fs.copyFileSync(path.join(root, f), path.join(out, f));
}
for (const dir of ["src", "assets"]) {
  fs.cpSync(path.join(root, dir), path.join(out, dir), { recursive: true });
}

console.log("Built static site into dist/");
