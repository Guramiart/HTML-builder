const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');

const SRC_PATH = path.join(__dirname, 'styles');
const DEST_PATH = path.join(__dirname, 'project-dist/bundle.css');

let arr = [];

fs.readdir(SRC_PATH, {withFileTypes: true}, (err, files) => {
    if(err) { throw err; }
    for(let file of files) {
        if(file.isFile() && path.extname(file.name) === '.css') {
            arr.push(fs.promises.readFile(path.join(SRC_PATH, file.name), 'utf-8'));
        }
    }
    Promise.all(arr).then(data => {
        fs.promises.writeFile(DEST_PATH, data.join(`${os.EOL}`));
    });
});