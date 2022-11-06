const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');
const { stdout } = require('node:process');

const SRC_PATH = path.join(__dirname, 'files');
const DEST_PATH = path.join(__dirname, 'files-copy');

copyFile();

function createDirectory() {
    return new Promise(resolve => {
        fs.mkdir(DEST_PATH, {recursive: true}, (err) => {
            if(err) throw err;
            resolve(`Directory has been successfully created!${os.EOL}`);
        });
    });
}

async function copyFile() {
    let cd = await createDirectory();
    stdout.write(cd);
    fs.readdir(DEST_PATH, {withFileTypes: true}, (err, files) => {
        if(err) {throw err;}
        for(let file of files) {
            fs.unlink(path.join(DEST_PATH, file.name), (err) => {if(err) throw err});
        }

        fs.readdir(SRC_PATH, {withFileTypes: true}, (err, files) => {
            if(err) {throw err;}
            for(let file of files) {
                if(file.isFile()) {
                    fs.copyFile(path.join(SRC_PATH, file.name), path.join(DEST_PATH, file.name), (err) => {if(err) throw err});
                }
            }
            stdout.write(`Files has been successfully copied!${os.EOL}`);
        });
    });
}