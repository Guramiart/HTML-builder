const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');

const ENCODE = 'utf-8';

const DEST_PATH = path.join(__dirname, 'project-dist');

const TEMPLATE_PATH = path.join(__dirname, 'template.html');
const COMPONENT_PATH = path.join(__dirname, 'components');
const PAGE_PATH = path.join(DEST_PATH, 'index.html');

const ASSET_PATH = path.join(__dirname, 'assets');
const DEST_ASSET_PATH = path.join(DEST_PATH, 'assets');

const STYLE_PATH = path.join(__dirname, 'styles');
const DEST_STYLE_PATH = path.join(DEST_PATH, 'style.css');

createDirectory(DEST_PATH).then(refreshAndBuild(DEST_PATH));

async function refreshAndBuild(clearPath) {
    fs.readdir(clearPath, {withFileTypes: true}, async (err, files) => {
        if(err) { throw err; }
        for(let file of files) {
            await fs.promises.rm(path.join(clearPath, file.name), { recursive: true }, { force: true });
        }
        build();
    });
}

function build() {
    buildTemplate();
    buildAssets(ASSET_PATH, DEST_ASSET_PATH);
    mergeStyles(STYLE_PATH, DEST_STYLE_PATH);
}

async function createDirectory(path) {
    await fs.promises.mkdir(path, {recursive: true});
}

async function buildTemplate() {
    let tempData = await fs.promises.readFile(TEMPLATE_PATH, ENCODE).then((data) => data);
    fs.readdir(COMPONENT_PATH, {withFileTypes: true}, async (err, components) => {
        if(err) { throw err; }
        for(let component of components) {
            let name = path.basename(component.name).split('.').slice(0, -1);
            if(tempData.includes(`{{${name}}}`)) {
                await fs.promises.readFile(path.join(COMPONENT_PATH, path.basename(component.name)), ENCODE).then((data) => {
                    tempData = tempData.replace(`{{${name}}}`, data);
                });
            }
        }
        fs.writeFile(PAGE_PATH, tempData, err => { if(err) { throw err; } });
    });
}

async function buildAssets(src, dest) {
    fs.readdir(src, {withFileTypes: true}, async (err, files) => {
        if(err) { throw err; }
        for(let file of files) {
            if(file.isDirectory()) {
                let directoryPath = path.join(dest, path.basename(file.name));
                await createDirectory(directoryPath);
                buildAssets(path.join(src, path.basename(file.name)), directoryPath);
            } else if(file.isFile()) {
                fs.copyFile(path.join(src, file.name), path.join(dest, file.name), err => { if(err) throw err; });
            }
        }
    });
}

async function mergeStyles(src, dest) {
    let dataArr = [];
    fs.readdir(src, {withFileTypes: true}, (err, files) => {
        if(err) { throw err; }
        for(let file of files) {
            if(file.isFile() && path.extname(file.name) === '.css') {
                dataArr.push(fs.promises.readFile(path.join(src, file.name), ENCODE));
            }
        }
        Promise.all(dataArr).then(data => {
            fs.promises.writeFile(dest, data.join(`${os.EOL}`));
        });
    });
}