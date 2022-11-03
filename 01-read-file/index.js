const fs = require('node:fs');
const path = require('node:path');
const { stdout } = require('node:process');

const FILE_PATH = path.join(__dirname, 'text.txt');
let stream = fs.createReadStream(FILE_PATH, {encoding: 'utf-8'});

stream.on('readable', () => {
    let data = stream.read();
    if(data) stdout.write(data); 
});