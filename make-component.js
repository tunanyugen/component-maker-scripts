const readline = require('readline');
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const env = require("dotenv").config().parsed;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// asking questions
rl.question("Component name: ", (name) => {
    rl.question("Description: ", (description) => {
        let uuid = "c" + uuidv4().replace(/-/gmui, "");
        // create component folder
        fs.mkdirSync(path.resolve(__dirname, `src/${name}`));
        createENV(name, uuid, description);
        createBlade(name, uuid);
        rl.close();
    })
})

rl.on('close', function () {
  console.log('\nNew component created!');
  process.exit(0);
});

function createENV(name, uuid, description){
    try{
        let env = path.resolve(__dirname, `.env.${name}`);
        // create env
        fs.writeFileSync(
            env,
`UUID=${uuid}
COMPONENT_NAME=${name}
COMPONENT_DESCRIPTION=${description}`,
            "utf8");
    } catch (err){
        throw err;
    }
}
function createBlade(name, uuid){
    try{
        let blade = path.resolve(__dirname, `src/${name}/index.blade.php`);
        // create blade
        fs.writeFileSync(blade,
`<link rel="stylesheet" href="/main.css">
<div class="${env.GROUP_ID}" id="${uuid}">
    <!-- Write your code here -->
    <h1>{{$greetings}}</h1>
    <!-- Write your code here -->
</div>
<script src="/main.js"></script>`, "utf8");
    } catch (err){
        throw err;
    }
}