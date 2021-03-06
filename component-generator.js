const fs = require("fs");
const path = require("path");
const env = require("dotenv").config().parsed;

class PrepareProject {
  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
    // Specify the event hook to attach to
    compiler.hooks.afterEmit.tap("PrepareProject", (compilation) => {
      // delete dist folder
      let dist = path.resolve(process.cwd(), "dist");
      if (fs.existsSync(dist)){
        fs.rmSync(dist, { recursive: true});
      }
      // create group folder
      fs.mkdirSync(
        path.resolve(compiler.context, env.PATH, env.GROUP_ID),
        { recursive: true }
      );
      let files = fs.readdirSync(process.cwd());
      files.forEach((file) => {
        if (file.match(/\.env\..*/)){
          let componentENV = require("dotenv").config({path: path.resolve(process.cwd(), file)}).parsed;
          this.generateComponent(compiler, env, componentENV);
        }
      })
      this.generateDependencies(compiler, env);
      this.copyCompiledDependencies(compiler, env);
    });
  }
  generateComponent = (compiler, env, componentENV) => {
    let basePath = path.resolve(compiler.context, env.PATH, env.GROUP_ID);
    // create base folder
    fs.mkdirSync(basePath,{ recursive: true});
    // create component folder
    fs.mkdirSync(path.resolve(basePath, componentENV.COMPONENT_NAME),{ recursive: true});
    // generate blade
    fs.writeFileSync(
      path.resolve( basePath, componentENV.COMPONENT_NAME, `${componentENV.UUID}.blade.php`),
      this.prepareBlade(compiler, componentENV)
    )
    // generate php
    fs.writeFileSync(
      path.resolve( basePath, componentENV.COMPONENT_NAME, `${componentENV.UUID}.php`),
      this.preparePHP(compiler, env, componentENV)
    );
  }
  generateDependencies = (compiler, env) => {
    let basePath = path.resolve(compiler.context, env.PATH, env.GROUP_ID);
    // create base folder
    fs.mkdirSync(basePath,{ recursive: true});
    // generate tsx
    fs.writeFileSync(
      path.resolve( basePath, `${env.GROUP_ID}.tsx`),
      this.prepareTSX(compiler)
    );
    // copy scss
    fs.copyFileSync(
      path.resolve(compiler.context, "src/index.scss"),
      path.resolve(basePath, `${env.GROUP_ID}.scss`)
    );
  }
  copyCompiledDependencies = (compiler, env) => {
    let basePath = path.resolve(compiler.context, env.PATH, env.GROUP_ID);
    // create base folder
    fs.mkdirSync(basePath,{ recursive: true});
    // copy js
    fs.copyFileSync(
      path.resolve(compiler.context, "public_html/main.js"),
      path.resolve( basePath, `${env.GROUP_ID}.js`),
    )
    // copy css
    fs.copyFileSync(
      path.resolve(compiler.context, "public_html/main.css"),
      path.resolve( basePath, `${env.GROUP_ID}.css`),
    )
  }
  preparePHP = (compiler, env, componentENV) => {
    let variablesRegex = new RegExp("protected array \\$variables[^;]*.");
    let inputTypesRegex = new RegExp("protected array \\$input_types[^;]*.");
    let renderRegex = new RegExp("(public function render.*\{)(.*?)(\})", "s");
    let useRegex = new RegExp("\\nuse .*;", "g");
    let phpContent = fs.readFileSync(path.resolve(__dirname, "template/component.php"), "utf8");
    let renderContent = fs.readFileSync(path.resolve(process.cwd(), "render-method.php"), "utf8");
    let controllerContent = fs.readFileSync(path.resolve(process.cwd(), `src/${componentENV.COMPONENT_NAME}/${componentENV.COMPONENT_NAME}.php`), "utf8");
    let variables = controllerContent.match(variablesRegex)[0];
    let inputTypes = controllerContent.match(inputTypesRegex)[0];

    phpContent = phpContent.replace(/process\.env\.UUID/gmu, componentENV.UUID);
    phpContent = phpContent.replace(/process\.env\.GROUP_ID/gmu, env.GROUP_ID);
    phpContent = phpContent.replace(/process\.env\.COMPONENT_NAME/gmu, componentENV.COMPONENT_NAME);
    phpContent = phpContent.replace(/process\.env\.COMPONENT_DESCRIPTION/gmu, componentENV.COMPONENT_DESCRIPTION);
    phpContent = phpContent.replace(variablesRegex, variables);
    phpContent = phpContent.replace(inputTypesRegex, inputTypes);
    phpContent = phpContent.replace(renderRegex, `$1${renderContent.match(renderRegex)[2]}$3`);
    let uses = renderContent.match(useRegex);
    if (uses && uses.length > 0){
      phpContent = phpContent.replace(/(namespace.*)/, `$1\n${renderContent.match(useRegex).join("")}`);
    }
    return phpContent;
  };
  prepareTSX = (compiler) => {
    let tsxContent = fs.readFileSync(
      path.resolve(compiler.context, "src/index.tsx"),
      "utf8"
    );
    tsxContent = tsxContent.replace(/import "\.\/index\.scss";(?:\r\n|\r|\n)/ui, "");
    return tsxContent;
  };
  prepareBlade = (compiler, componentENV) => {
    let bladeContent = fs.readFileSync(
      path.resolve(compiler.context, `src/${componentENV.COMPONENT_NAME}/index.blade.php`),
      "utf8"
    )
    bladeContent = bladeContent.replace(/^<link.*>(?:\r\n|\r|\n)/ui, "");
    bladeContent = bladeContent.replace(/<script.*$/ui, "");
    return bladeContent;
  };
}

module.exports = PrepareProject;
