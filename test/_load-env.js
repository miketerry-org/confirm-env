// _load-env.js:

// load all required modules
const path = require("path");
const dotenv = require("dotenv");

// load all environment variables used when testing
const filename = path.resolve("./test/_test.env");
console.log(`filename: ${filename}`);
dotenv.config({ path: filename });

// export empty module
module.exports = {};
