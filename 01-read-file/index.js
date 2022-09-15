const fs = require('node:fs');
const path = require('node:path');

const filePath = path.join(__dirname, 'text.txt');
let stream = new fs.ReadStream(filePath, {encoding: 'utf-8'});

stream.on('readable', function(){
    let data = stream.read();
    if(data) { 
        console.log(data); 
    }
});