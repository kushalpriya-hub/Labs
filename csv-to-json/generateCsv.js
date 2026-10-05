const fs = require("node:fs");

const sizeMB = Number(process.argv[2]);

if (!sizeMB) {
  console.log("Please provide size in MB.");
  console.log("Example: node generateCsv.js 50");
  process.exit(1);
}

const targetBytes = sizeMB * 1024 * 1024;

const stream = fs.createWriteStream(`input-${sizeMB}MB.csv`);

stream.write("id,name,price\n");

let id = 1;
let written = 0;

function writeData() {
  while (written < targetBytes) {
    const row = `${id},Product-${id},${(id % 1000) + 100}\n`;

    const canContinue = stream.write(row);

    written += Buffer.byteLength(row);
    id++;

    if (!canContinue) {
      stream.once("drain", writeData);
      return;
    }
  }

  stream.end();
}

stream.on("finish", () => {
  console.log(`${sizeMB} MB CSV created successfully.`);
});

writeData();