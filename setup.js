const readline = require("readline");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
// remove dist directory
let dist = path.resolve(__dirname, "dist");
if (fs.existsSync(dist)) {
  fs.rm(dist, { recursive: true });
}
rl.question("Component type: ", (type) => {
  let uuid = "c" + uuidv4().replace(/-/gimu, "");
  // create src folder
  fs.mkdirSync(path.resolve(__dirname, "src"), { recursive: true });
  // generate env
  try {
    fs.writeFileSync(
      path.resolve(__dirname, ".env"),
      `GROUP_ID=${uuid}
COMPONENT_TYPE=${type}
PATH=dist/final/components`,
      "utf8"
    );
  } catch (err) {
    throw err;
  }
  // generate scss
  try {
    fs.writeFileSync(
      path.resolve(__dirname, "src/index.scss"),
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
      path.resolve(__dirname, "src/index.tsx"),
      `import "./index.scss";
// Write your code here
console.log("Hello World!");
// Write your code here`,
      "utf8"
    );
  } catch (err) {
    throw err;
  }
  rl.close();
});
rl.on("close", function () {
  console.log('\nRun "npm run make-component" to create new components');
  process.exit(0);
});
