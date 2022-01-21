#!/usr/bin/env node
const process = require('process');
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
        fs.mkdirSync(path.resolve(process.cwd(), `src/${name}`));
        createENV(name, uuid, description);
        createBlade(name, uuid, description);
        createComponent(name, uuid, description);
        rl.close();
    })
})

rl.on('close', function () {
  console.log('\nNew component created!');
  process.exit(0);
});

function createENV(name, uuid, description){
    try{
        let env = path.resolve(process.cwd(), `.env.${name}`);
        // create env
        let content = fs.readFileSync(path.resolve(__dirname, "template/component.php"), "utf8");
        content = content.replace(/process\.env\.UUID/gmu, uuid);
        content = content.replace(/process\.env\.COMPONENT_NAME/gmu, name);
        content = content.replace(/process\.env\.COMPONENT_DESCRIPTION/gmu, description);
        fs.writeFileSync(env, content, "utf8");
    } catch (err){
        throw err;
    }
}
function createBlade(name, uuid, description){
    try{
        let blade = path.resolve(process.cwd(), `src/${name}/index.blade.php`);
        // create blade
        let content = fs.readFileSync(path.resolve(__dirname, "template/index.blade.php"), "utf8");
        content = content.replace(/process\.env\.GROUP_ID/gmu, env.GROUP_ID);
        content = content.replace(/process\.env\.UUID/gmu, env.uuid);
        fs.writeFileSync(blade, content, "utf8");
    } catch (err){
        throw err;
    }
}
function createComponent(name, uuid, description){
    try{
        let component = path.resolve(process.cwd(), `src/${name}/index.blade.php`);
        // create component
        let content = fs.readFileSync(path.resolve(__dirname, "template/component.php"), "utf8");
        content = content.replace(/process\.env\.UUID/gmu, uuid);
        content = content.replace(/process\.env\.GROUP_ID/gmu, env.GROUP_ID);
        content = content.replace(/process\.env\.COMPONENT_NAME/gmu, name);
        content = content.replace(/process\.env\.COMPONENT_DESCRIPTION/gmu, description);
        fs.writeFileSync(component, content, "utf8");
    } catch (err){
        throw err;
    }
}