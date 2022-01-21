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
  let finalPath = path.resolve(process.cwd(), ".env");
  let content = `GROUP_ID=${uuid}
  PATH=dist/final/components`;
  if (!fs.existsSync(finalPath)){
    fs.writeFileSync(finalPath, content, "utf8");
  }
} catch (err) {
  throw err;
}
// generate scss
try {
  let content = fs.readFileSync(path.resolve(__dirname, "template/index.scss"), "utf8");
  content = content.replace(/process\.env\.GROUP_ID/gmu, uuid);
  let finalPath = path.resolve(process.cwd(), "src/index.scss");
  if (!fs.existsSync(finalPath)){
    fs.writeFileSync(finalPath, content, "utf8");
  }
} catch (err) {
  throw err;
}
// generate tsx
try {
  let content = fs.readFileSync(path.resolve(__dirname, "template/index.tsx"), "utf8");
  let finalPath = path.resolve(process.cwd(), "src/index.tsx");
  if (!fs.existsSync(finalPath)){
    fs.writeFileSync(finalPath, content, "utf8");
  }
} catch (err) {
  throw err;
}
// generate render method
try {
  let finalPath = path.resolve(process.cwd(), "render-method.php");
  if (!fs.existsSync(finalPath)){
    fs.writeFileSync(finalPath, "", "utf8");
  }
} catch (err) {
  throw err;
}
console.log('\nRun "npm run make-component" to create new components');
