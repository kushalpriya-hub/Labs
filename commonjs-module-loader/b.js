console.log("b.js started");

exports.name = "Module B";

const a = require("./a");

console.log("From A:", a.name);

exports.aName = a.name;