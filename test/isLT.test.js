// tests for the "isLT" comparison function

// load all required packages
const { describe, it } = require("node:test");
const confirm = require("../index.js");

// load testing environment variables
require("./_load-env");

// define all tests for the  isLT comparison
describe('test "isLT.', () => {
  it("should have the server port less than 5000", () => {
    confirm("SERVER_PORT").isLT(5000);
  });

  it("should not have the server port less than 3000", () => {
    confirm("SERVER_PORT").not.isLT(3001);
  });
});
