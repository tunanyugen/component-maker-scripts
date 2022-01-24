#!/usr/bin/env node
const process = require('process');
const args = require('minimist')(process.argv.slice(2))
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const env = require("dotenv").config().parsed;

let name = getArgument("name");;
let description = getArgument("description");

// validate name
if (!name.match(/^[a-zA-Z][a-zA-Z0-9]*$/)){
    console.log(`Wrong name format!`);
    console.log(`Name regular expression: ^[a-zA-Z][a-zA-Z0-9]*$`);
    console.log(`Example: HomeSlider, homeSlider, homeSlider01, home01Slider`);
    throw "ERROR!";
}

// Capitalize first letter of name
name = name.charAt(0).toUpperCase() + name.slice(1);
// Generate valid uuid
let uuid = "c" + uuidv4().replace(/-/gmui, "");
// get current uuid if component exists
let envPath = path.resolve(process.cwd(), `.env.${name}`);
if (fs.existsSync(envPath)){
    uuid = fs.readFileSync(envPath, "utf8").match(/UUID=(.*)/)[1];
}
// create component folder
fs.mkdirSync(path.resolve(process.cwd(), `src/${name}`), { recursive: true});
createENV(name, uuid, description);
createBlade(name, uuid, description);
createController(name, uuid, description);
addApi(name, uuid, description);
addRoute(name, uuid, description);

console.log("FINISHED");

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
        content = content.replace(/process\.env\.UUID/gmu, uuid);
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
        let routesRegex = new RegExp("(\\$routes ? = \\[[^\\]]*)");
        webContent = webContent.replace(routesRegex, `$1\t"${name.toLowerCase()}" => "Src\\\\${name}\\\\${name}@index",\n\t`)
        fs.writeFileSync(finalPath, webContent, "utf8");
    } catch(err){
        throw err;
    }
}

function getArgument(name){
    if (args[name] == null || args[name] == undefined){ throw `Missing variable ${name}`}
    return args[name];
}