const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const { stdout } = require('node:process');

const FILE_PATH = path.join(__dirname, 'text.txt');

const stream = fs.createWriteStream(FILE_PATH, {encoding: 'utf-8'})
    .on('open', () => stdout.write(`It's nice to meet you! Enter your text please:${os.EOL}`));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.on("line", function(input) {
    if (input.match(/exit/)) {rl.close();}
    else {stream.write(`${input}${os.EOL}`);}
});

rl.on("close", () => stdout.write(`Have a good day!`));