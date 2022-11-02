const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');
const { stdout } = require('node:process');

const destPath = path.join(__dirname, 'project-dist');
const samplePath = path.join(__dirname, 'template.html');
const pagePath = path.join(destPath, 'index.html');
const componentsPath = path.join(__dirname, 'components');
const srcStylesPath = path.join(__dirname, 'styles');
const srcAssetPath = path.join(__dirname, 'assets');
const mergeStylePath = path.join(destPath, 'style.css');
const destAssetPath = path.join(destPath, 'assets');

build();

async function build() {
    await createDirectory(destPath);
    await createDirectory(destAssetPath);
    buildTemplate(samplePath, componentsPath, pagePath);
    copyAssets(srcAssetPath, destAssetPath);
    mergeStyles(srcStylesPath, mergeStylePath);
}

function createDirectory(path) {
    return new Promise(resolve => {
        fs.mkdir(path, {recursive: true}, (err) => {
            if(err) throw err;
            resolve(`Succes`);
        });
    });
}

function buildTemplate(srcPath, component, destPath) {
    
}

function mergeStyles(srcPath, destPath) {
    let dataArr = [];
    fs.readdir(srcPath, {withFileTypes: true}, (err, files) => {
        if(err) { throw err; }
        for(let file of files) {
            if(file.isFile() && path.extname(file.name) === '.css') {
                dataArr.push(fs.promises.readFile(path.join(srcPath, file.name), 'utf-8'));
            }
        }
        Promise.all(dataArr).then(data => {
            fs.promises.writeFile(destPath, data.join(`${os.EOL}`));
        });
    });
}

function clearFolder(delPath) {
    return new Promise(resolve => {
        fs.readdir(delPath, {withFileTypes: true}, (err, files) => {
            if(err) { throw err; }
            for(let file of files) {
                if(file.isDirectory()) {
                    clearFolder(path.join(delPath, file.name));
                } else {
                    fs.unlink(path.join(delPath, file.name), (err) => { if(err) throw err; });
                }
            }
            resolve("Succes");
        });
    });
}

async function copyAssets(srcPath, destPath) {
    await clearFolder(destPath).then(() => {
        fs.readdir(srcPath, {withFileTypes: true}, async (err, files) => {
            if(err) {throw err;}
            for(let file of files) {
                if(file.isDirectory()) {
                    let dirPath = path.join(destAssetPath, path.basename(file.name));
                    await createDirectory(dirPath);
                    copyAssets(path.join(srcPath, path.basename(file.name)), dirPath);
                } else if(file.isFile()) {
                    fs.copyFile(path.join(srcPath, file.name), path.join(destPath, file.name), (err) => {if(err) throw err});
                }
            }
        });
    });
}