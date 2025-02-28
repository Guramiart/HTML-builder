const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');
const { stdout } = require('node:process');

const FILE_PATH = path.join(__dirname, 'secret-folder');

fs.readdir(FILE_PATH, {withFileTypes: true}, (err, files) => {
    if(err) throw err;
    for(let file of files) {
        if(file.isFile()) {
            fs.stat(path.join(FILE_PATH, file.name), (err, stats) => {
                if(err) throw err;
                let fileName = path.basename(file.name).split('.').slice(0, -1).join('.');
                let fileExt = path.extname(file.name).slice(1);
                let size = (stats.size / 1024).toFixed(3);
                stdout.write(`${fileName} - ${fileExt} - ${size}kb${os.EOL}`);
            }); 
        }
    }
 });