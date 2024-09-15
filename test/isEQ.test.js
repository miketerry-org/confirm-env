// tests for the "isEQ" cconfirm( omparison function

// load all required packages
const { describe, it } = require("node:test");
const confirm = require("../index.js");

// load testing environment variables
require("./_load-env");

// define all tests for the  isEQ comparison
describe('test "isEQ.', () => {
  it("should have the server port as 4000", () => {
    confirm("SERVER_PORT").isEQ(4000);
  });

  it("should not have the server port as 4001", () => {
    confirm("SERVER_PORT").not.isEQ(4001);
  });
});
