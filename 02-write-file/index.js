const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const filePath = path.join(__dirname, 'text.txt');
const stream = fs.createWriteStream(filePath, {encoding: 'utf-8'})
    .on('open', () => console.log('It’s nice to meet you! Enter your text please:'));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.on("line", function(input) {
    if (input.match(/exit/)) {rl.close();}
    else {stream.write(`${input}${os.EOL}`);}
});

rl.on("close", () => console.log('Have a good day!'));