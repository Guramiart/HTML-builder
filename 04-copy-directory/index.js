const fs = require('node:fs');
const path = require('node:path');

const srcPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');

fs.mkdir(destPath, {recursive: true}, (err) => {
    if(err) throw err;
    console.log('Directory has been successfully created!');
});

fs.readdir(destPath, {withFileTypes: true}, (err, files) => {
    if(err) {throw err;}
    for(let file of files) {
        fs.unlink(path.join(destPath, file.name), (err) => {if(err) throw err});
    }
});

fs.readdir(srcPath, {withFileTypes: true}, (err, files) => {
    if(err) {throw err;}
    for(let file of files) {
        if(file.isFile()) {
            fs.copyFile(path.join(srcPath, file.name), path.join(destPath, file.name), (err) => {if(err) throw err});
        }
    }
    console.log('Files has been successfully copied!');
});