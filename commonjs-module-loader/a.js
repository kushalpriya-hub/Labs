console.log("a.js started");

exports.name = "Module A";

const b = require("./b");

console.log("From B:", b.name);

exports.bName = b.name;