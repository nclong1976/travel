const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const imgRefs = [...html.matchAll(/images\/[^"'\\s]+/g)].map(m => m[0]);
const unique = [...new Set(imgRefs)];
const missing = unique.filter(r => !fs.existsSync(r));
console.log("Missing images:", missing.length);
missing.forEach(x => console.log(x));
