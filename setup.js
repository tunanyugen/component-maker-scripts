#!/usr/bin/env node

const process = require("process");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// remove dist directory
let dist = path.resolve(process.cwd(), "dist");
if (fs.existsSync(dist)) {
  fs.rm(dist, { recursive: true });
}
let uuid = "c" + uuidv4().replace(/-/gimu, "");
// create src folder
fs.mkdirSync(path.resolve(process.cwd(), "src"), { recursive: true });
// generate env
try {
  fs.writeFileSync(
    path.resolve(process.cwd(), ".env"),
    `GROUP_ID=${uuid}
PATH=dist/final/components`,
    "utf8"
  );
} catch (err) {
  throw err;
}
// generate scss
try {
  let content = fs.readFileSync(path.resolve(__dirname, "template/index.scss"), "utf8");
  content = content.replace(/process\.env\.GROUP_ID/gmu, uuid);
  fs.writeFileSync(path.resolve(process.cwd(), "src/index.scss"), content, "utf8");
} catch (err) {
  throw err;
}
// generate tsx
try {
  let content = fs.readFileSync(path.resolve(__dirname, "template/index.tsx"), "utf8");
  fs.writeFileSync(path.resolve(process.cwd(), "src/index.tsx"), content, "utf8");
} catch (err) {
  throw err;
}
// generate render method
try {
  fs.writeFileSync(path.resolve(process.cwd(), "render-method.php"), "", "utf8");
} catch (err) {
  throw err;
}
console.log('\nRun "npm run make-component" to create new components');
