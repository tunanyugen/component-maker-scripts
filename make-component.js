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
    // validate name
    if (!name.match(/^[a-zA-Z][a-zA-Z0-9]*$/)){
        console.log(`Wrong name format!`);
        console.log(`Name regular expression: ^[a-zA-Z][a-zA-Z0-9]*$`);
        console.log(`Example: HomeSlider, homeSlider, homeSlider01, home01Slider`);
        return rl.close();
    }
    rl.question("Description: ", (description) => {
        // Capitalize first letter of name
        name = name.charAt(0).toUpperCase() + name.slice(1);
        // Generate valid uuid
        let uuid = "c" + uuidv4().replace(/-/gmui, "");
        // create component folder
        fs.mkdirSync(path.resolve(process.cwd(), `src/${name}`), { recursive: true});
        createENV(name, uuid, description);
        createBlade(name, uuid, description);
        createController(name, uuid, description);
        addApi(name, uuid, description);
        addRoute(name, uuid, description);
        rl.close();
    })
})

rl.on('close', function () {
  console.log('\nFinished');
  process.exit(0);
});

function createENV(name, uuid, description){
    try{
        let finalPath = path.resolve(process.cwd(), `.env.${name}`);
        if (fs.existsSync(finalPath)){ return }
        // create env
        let content = fs.readFileSync(path.resolve(__dirname, "template/.env"), "utf8");
        content = content.replace(/process\.env\.UUID/gmu, uuid);
        content = content.replace(/process\.env\.COMPONENT_NAME/gmu, name);
        content = content.replace(/process\.env\.COMPONENT_DESCRIPTION/gmu, description);
        fs.writeFileSync(finalPath, content, "utf8");
    } catch (err){
        throw err;
    }
}
function createBlade(name, uuid, description){
    try{
        let finalPath = path.resolve(process.cwd(), `src/${name}/index.blade.php`);
        if (fs.existsSync(finalPath)){ return }
        // create blade
        let content = fs.readFileSync(path.resolve(__dirname, "template/index.blade.php"), "utf8");
        content = content.replace(/process\.env\.GROUP_ID/gmu, env.GROUP_ID);
        content = content.replace(/process\.env\.UUID/gmu, env.uuid);
        fs.writeFileSync(finalPath, content, "utf8");
    } catch (err){
        throw err;
    }
}
function createController(name, uuid, description){
    try{
        let finalPath = path.resolve(process.cwd(), `src/${name}/${name}.php`);
        if (fs.existsSync(finalPath)){ return }
        // create component
        let content = fs.readFileSync(path.resolve(__dirname, "template/controller.php"), "utf8");
        content = content.replace(/process\.env\.UUID/gmu, uuid);
        content = content.replace(/process\.env\.GROUP_ID/gmu, env.GROUP_ID);
        content = content.replace(/process\.env\.COMPONENT_NAME/gmu, name);
        content = content.replace(/process\.env\.COMPONENT_DESCRIPTION/gmu, description);
        fs.writeFileSync(finalPath, content, "utf8");
    } catch (err){
        throw err;
    }
}
function addApi(name, uuid, description){
    try{
        let finalPath = path.resolve(process.cwd(), "routes/web.php");
        let webContent = fs.readFileSync(finalPath, "utf8");
        if (webContent.match(`"Src\\${name}\\${name}@api"`)){ return }
        let apiRegex = new RegExp("(\\$apis ? = \\[[^\\]]*)");
        webContent = webContent.replace(apiRegex, `$1\t"${name.toLowerCase()}" => "Src\\\\${name}\\\\${name}@api",\n\t\t`)
        fs.writeFileSync(finalPath, webContent, "utf8");
    } catch(err){
        throw err;
    }
}
function addRoute(name, uuid, description){
    try{
        let finalPath = path.resolve(process.cwd(), "routes/web.php");
        let webContent = fs.readFileSync(finalPath, "utf8");
        if (webContent.match(`"Src\\${name}\\${name}@index"`)){ return }
        let routesRegex = new RegExp("(\\$routes ? = \\[[^\\]]*)");
        webContent = webContent.replace(routesRegex, `$1\t"${name.toLowerCase()}" => "Src\\\\${name}\\\\${name}@index",\n\t`)
        fs.writeFileSync(finalPath, webContent, "utf8");
    } catch(err){
        throw err;
    }
}