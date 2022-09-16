const fs = require('node:fs');
const path = require('node:path');

const filePath = path.join(__dirname, 'secret-folder');

fs.readdir(filePath, {withFileTypes: true}, (err, files) => {
    if(err) throw err;
    for(let file of files) {
        if(file.isFile()) {
            fs.stat(path.join(filePath, file.name), (err, stats) => {
                if(err) throw err;
                let fileName = path.basename(file.name).split('.').slice(0, -1).join('.');
                let fileExt = path.extname(file.name).slice(1);
                let size = (stats.size / 1024).toFixed(3);
                console.log(`${fileName} - ${fileExt} - ${size}kb`);
            }); 
        }
    }
 });