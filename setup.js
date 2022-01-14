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
  fs.writeFileSync(
    path.resolve(process.cwd(), "src/index.scss"),
    `.${uuid}{
    // Write your code here
    h1 {
        width: max-content;
        background: linear-gradient(90deg, rgba(237,102,102,1) 0%, rgba(161,164,94,1) 33%, rgba(136,123,141,1) 56%, rgba(192,87,102,1) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    // Write your code here
}`,
    "utf8"
  );
} catch (err) {
  throw err;
}
// generate tsx
try {
  fs.writeFileSync(
    path.resolve(process.cwd(), "src/index.tsx"),
    `import "./index.scss";
// Write your code here
console.log("Hello World!");
// Write your code here`,
    "utf8"
  );
} catch (err) {
  throw err;
}
console.log('\nRun "npm run make-component" to create new components');
