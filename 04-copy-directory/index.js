const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');
const { stdout } = require('node:process');

const srcPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');

copyFile();

function createDirectory() {
    return new Promise(resolve => {
        fs.mkdir(destPath, {recursive: true}, (err) => {
            if(err) throw err;
            resolve(`Directory has been successfully created!${os.EOL}`);
        });
    });
}

async function copyFile() {
    let cd = await createDirectory();
    stdout.write(cd);
    fs.readdir(destPath, {withFileTypes: true}, (err, files) => {
        if(err) {throw err;}
        for(let file of files) {
            fs.unlink(path.join(destPath, file.name), (err) => {if(err) throw err});
        }

        fs.readdir(srcPath, {withFileTypes: true}, (err, files) => {
            if(err) {throw err;}
            for(let file of files) {
                if(file.isFile()) {
                    fs.copyFile(path.join(srcPath, file.name), path.join(destPath, file.name), (err) => {if(err) throw err});
                }
            }
            stdout.write(`Files has been successfully copied!${os.EOL}`);
        });
    });
}