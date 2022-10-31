const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');

const srcPath = path.join(__dirname, 'styles');
const destPath = path.join(__dirname, 'project-dist/bundle.css');

let arr = [];

fs.readdir(srcPath, {withFileTypes: true}, (err, files) => {
    if(err) { throw err; }
    for(let file of files) {
        if(file.isFile() && path.extname(file.name) === '.css') {
            arr.push(fs.promises.readFile(path.join(srcPath, file.name), 'utf-8'));
        }
    }
    Promise.all(arr).then(data => {
        fs.promises.writeFile(destPath, data.join(`${os.EOL}`));
    });
});