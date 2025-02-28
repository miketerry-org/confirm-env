/**
 * @file Implements function to confirm validity of environment variables
 * @module confirm-environment
 * @license MIT
 */

"use strict";

// Load all necessary packages
const fs = require("fs");
const path = require("path");

/**
 * Terminate the application with a fatal error message.
 *
 * @param {string} message - The error message to display before termination.
 * @returns {void}
 */
function fatal(message) {
  console.info(message);
  console.info();
  console.info("Terminating application!");
  process.exit(1);
}

/**
 * Get the value of an environment variable, with an optional default value.
 *
 * @param {string} name - The name of the environment variable.
 * @param {string|undefined} [defaultValue] - The default value to use if the variable is not defined.
 * @returns {string} The value of the environment variable.
 * @throws Will throw an error if the environment variable is undefined and no default is provided.
 */
function getValue(name, defaultValue = undefined) {
  // ensure the name parameter is passed
  if (!name || name === "") {
    fatal(`The "name" parameter is required!`);
  }

  // convert name to uppercase
  name = name.toUpperCase();

  // get value from process environment variable array
  let value = process.env[name];

  // if value is undefined and NODE_ENV is defined
  if (!value && process.env["NODE_ENV"]) {
    // create new name using name and NODE_ENV value
    let newName = name + "_" + process.env["NODE_ENV"].toUpperCase();

    // get value from process environment variable array
    value = process.env[newName];

    // if variable with newName is defined
    if (value) {
      // assign newName value to name value
      process.env[name] = value;

      // delete the newName variable
      delete process.env[newName];
    }
  }

  // if environment variable is still undefined
  if (!value || value === "") {
    // if default value provided
    if (defaultValue) {
      value = defaultValue;
      process.env[name] = value;
    } else {
      fatal(`The "${name} environment variable is undefined!`);
    }
  }

  // return the value
  return value;
}

/**
 * Converts an array of values to a string representation for logging.
 *
 * @param {Array} values - The array of values to convert.
 * @returns {string} A string representation of the array.
 */
function arrayToText(values) {
  let formattedArray = values.map((item) => " " + JSON.stringify(item));
  formattedArray[0] = JSON.stringify(values[0]);
  return `[${formattedArray}]`;
}

/**
 * Converts a comma-separated string to an array.
 *
 * @param {string} text - The comma-separated string to convert.
 * @returns {Array} An array of values from the string.
 */
function textToArray(text) {
  return text.trim().split(",");
}

/**
 * Check if the value is a number.
 *
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is a number, false otherwise.
 */
function validNumber(value) {
  return typeof value === "number" && !isNaN(value);
}

/**
 * Check if the value is an integer.
 *
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is an integer, false otherwise.
 */
function validInteger(value) {
  return typeof value === "number" && Number.isInteger(value);
}

/**
 * Check if the value is a valid floating point number.
 *
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is a floating point number, false otherwise.
 */
function validFloat(value) {
  return typeof value === "number" && !Number.isInteger(value);
}

/**
 * Check if the value is defined (not undefined).
 *
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is defined, false otherwise.
 */
function validDefined(value) {
  return typeof value !== "undefined";
}

/**
 * Check if the value is undefined.
 *
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is undefined, false otherwise.
 */
function validUndefined(value) {
  return typeof value === "undefined";
}

/**
 * Confirm the validity of an environment variable with various conditions.
 *
 * @param {string} name - The name of the environment variable to confirm.
 * @param {string|undefined} [defaultValue] - The default value to use if the variable is not defined.
 * @returns {Object} The chainable confirmation methods.
 */
function confirm(name, defaultValue = undefined) {
  // get the value
  let value = getValue(name, defaultValue);

  // set the not operator variable to false
  let _NOT_ = false;

  // assume comparison will fail
  let valid = false;

  // define all the supported chained methods
  const methods = {
    /**
     * Flip the not operator state for negating conditions.
     *
     * @returns {Object} The chainable confirmation methods.
     */
    get not() {
      _NOT_ = !_NOT_;
      return methods;
    },

    /**
     * Perform equality comparison with the environment variable.
     *
     * @param {*} compare - The value to compare the environment variable with.
     * @returns {Object} The chainable confirmation methods.
     */
    is: (compare) => {
      valid = value == compare;
      if (_NOT_) valid = !valid;
      if (!_NOT_ && !valid) {
        fatal(`"${name}" is ${value} and must be equal to ${compare}`);
      } else if (_NOT_ && !valid) {
        fatal(`"${name}" is ${value} and must not be equal to ${compare}`);
      }
      _NOT_ = false;
      return methods;
    },

    /**
     * Check if the environment variable is defined.
     *
     * @returns {Object} The chainable confirmation methods.
     */
    isDefined: () => {
      valid = value !== undefined;
      if (_NOT_) valid = !valid;
      if (!_NOT_ && !valid) {
        fatal(`"${name}" must be defined`);
      } else if (_NOT_ && !valid) {
        fatal(`"${name}" must not be defined`);
      }
      _NOT_ = false;
      return methods;
    },

    /**
     * Perform equality comparison with the environment variable.
     *
     * @param {*} compare - The value to compare the environment variable with.
     * @returns {Object} The chainable confirmation methods.
     */
    isEQ: (compare) => {
      valid = value == compare;
      if (_NOT_) valid = !valid;
      if (!_NOT_ && !valid) {
        fatal(`"${name}" is ${value} and must be equal to ${compare}`);
      } else if (_NOT_ && !valid) {
        fatal(`"${name}" is ${value} and must not be equal to ${compare}`);
      }
      _NOT_ = false;
      return methods;
    },

    /**
     * Perform a "greater than" comparison.
     *
     * @param {number} compare - The value to compare the environment variable with.
     * @returns {Object} The chainable confirmation methods.
     */
    isGT: (compare) => {
      valid = value > compare;
      if (_NOT_) valid = !valid;
      if (!_NOT_ && !valid) {
        fatal(`"${name}" is ${value} and must be greater than ${compare}`);
      } else if (_NOT_ && !valid) {
        fatal(
          `"${name}" is ${value} and must be less than or equal ${compare}`
        );
      }
      _NOT_ = false;
      return methods;
    },

    /**
     * Perform a "greater than or equal" comparison.
     *
     * @param {number} compare - The value to compare the environment variable with.
     * @returns {Object} The chainable confirmation methods.
     */
    isGE: (compare) => {
      valid = value >= compare;
      if (_NOT_) valid = !valid;
      if (!_NOT_ && !valid) {
        fatal(
          `"${name}" is ${value} and must be greater than or equal to ${compare}`
        );
      } else if (_NOT_ && !valid) {
        fatal(`"${name}" is ${value} and must be less than ${compare}`);
      }
      _NOT_ = false;
      return methods;
    },

    /**
     * Perform a "less than" comparison.
     *
     * @param {number} compare - The value to compare the environment variable with.
     * @returns {Object} The chainable confirmation methods.
     */
    isLT: (compare) => {
      valid = value < compare;
      if (_NOT_) valid = !valid;
      if (!_NOT_ && !valid) {
        fatal(`"${name}" is ${value} and must be less than ${compare}`);
      } else if (_NOT_ && !valid) {
        fatal(
          `"${name}" is ${value} and must be greater than or equal ${compare}`
        );
      }
      _NOT_ = false;
      return methods;
    },

    /**
     * Perform a "less than or equal" comparison.
     *
     * @param {number} compare - The value to compare the environment variable with.
     * @returns {Object} The chainable confirmation methods.
     */
    isLE: (compare) => {
      valid = value <= compare;
      if (_NOT_) valid = !valid;
      if (!_NOT_ && !valid) {
        fatal(
          `"${name}" is ${value} and must be less than or equal to ${compare}`
        );
      } else if (_NOT_ && !valid) {
        fatal(`"${name}" is ${value} and must be greater than ${compare}`);
      }
      _NOT_ = false;
      return methods;
    },

    /**
     * Test the length of the environment variable.
     *
     * @param {number} min - The minimum length.
     * @param {number} max - The maximum length.
     * @returns {Object} The chainable confirmation methods.
     */
    hasLength: (min, max) => {
      valid = value.length >= min && value.length <= max;
      if (_NOT_) valid = !valid;
      if (!_NOT_ && !valid) {
        fatal(
          `"${name}" is ${value.length} long and must be between ${min} and ${max} long`
        );
      } else if (_NOT_ && !valid) {
        fatal(
          `"${name}" is ${value.length} long and must not be between ${min} and ${max} long`
        );
      }
      _NOT_ = false;
      return methods;
    },

    /**
     * Test if the value contains a given substring.
     *
     * @param {string} substring - The substring to search for.
     * @returns {Object} The chainable confirmation methods.
     */
    contains: (substring) => {
      valid = value.includes(substring);
      if (_NOT_) valid = !valid;
      if (!_NOT_ && !valid) {
        fatal(`"${name}" is "${value} "and must contain "${substring}"`);
      } else if (_NOT_ && !valid) {
        fatal(`"${name}" is "${value}" and must not contain "${substring}`);
      }
      _NOT_ = false;
      return methods;
    },

    /**
     * Test if the value matches a regular expression.
     *
     * @param {string} match - The regular expression pattern.
     * @returns {Object} The chainable confirmation methods.
     */
    matches: (match) => {
      valid = new RegExp(match).test(value);
      if (_NOT_) valid = !valid;
      if (!_NOT_ && !valid) {
        fatal(
          `"${name}" is "${value} "and does not match the regular expression "${match}"`
        );
      } else if (_NOT_ && !valid) {
        fatal(
          `"${name}" is "${value}" and must not matched the regular expression "${match}`
        );
      }
      _NOT_ = false;
      return methods;
    },

    /**
     * Test if the value is in a provided array.
     *
     * @param {Array} values - The array of valid values.
     * @returns {Object} The chainable confirmation methods.
     */
    isIn: (values) => {
      valid = values.includes(value);
      if (_NOT_) valid = !valid;
      if (!_NOT_ && !valid) {
        fatal(
          `"${name}" is "${value} " and must be in the array ${arrayToText(
            values
          )}`
        );
      } else if (_NOT_ && !valid) {
        fatal(`"${name}" is "${value}" and must not be in the array ${values}`);
      }
      _NOT_ = false;
      return methods;
    },

    /**
     * Confirm if the value is a valid path (and optionally create it).
     *
     * @param {boolean} [force=true] - If true, create the path if it doesn't exist.
     * @returns {Object} The chainable confirmation methods.
     */
    isPath: (force = true) => {
      // expand the path to full value
      value = path.resolve(value);

      // now update path in environment variable
      process.env[name] = value;

      // if path does not exist and force is true then ensure the path is created
      if (!fs.existsSync(value)) {
        if (force) {
          fs.mkdirSync(value);
        } else {
          fatal(`"${name}" is "${value}" but it does not exist!`);
        }
      }

      _NOT_ = false;
      return methods;
    },
  };

  // allow method chaining
  return methods;
}

// export the confirm environment variable function
module.exports = confirm;
