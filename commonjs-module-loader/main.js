const miniRequire = require("./loader");

console.log("=== Test 1: Load counter ===");

const first = miniRequire("./counter", __dirname);

console.log(first);

console.log("\n=== Test 2: Load counter again ===");

const second = miniRequire("./counter", __dirname);

console.log(second);

console.log("\n=== Test 3: Cache ===");

console.log("Same object:", first === second);

console.log("\n=== Test 4: Directory / index.js ===");

const utils = miniRequire("./utils", __dirname);

console.log(utils);