// index.js: Implements function to confirm validity of environment variables

// define function to throw error
function fatal(message) {
  throw new Error(message);
}

// get the value for the specified environment variable
function getValue(name) {
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
  if (!value) {
    fatal(`The "${name}" environment variable is undefined!`);
  }

  // return the value
  return value;
}

// define the arrayToText function
function arrayToText(values) {
  let formattedArray = values.map((item) => " " + JSON.stringify(item));
  formattedArray[0] = JSON.stringify(values[0]);
  return `[${formattedArray}]`;
}

// convert text to array
function textToArray(text) {
  return text.trim().split(",");
}

// returns true if the value is a number
function validNumber(value) {
  return typeof value === "number" && !isNaN(value);
}

// returns true if the number is an integer
function validInteger(value) {
  return typeof value === "number" && Number.isInteger(value);
}

// return true if value is valid floating point number
function validFloat(value) {
  return typeof value === "number" && !Number.isInteger(value);
}

// function to return true if value is defined
function validDefined(value) {
  return typeof value !== "undefined";
}

// function to return true if value is undefined
function validUndefined(value) {
  return typeof value === "undefined";
}

// define the confirm super function
function confirm(name) {
  // get the value
  let value = getValue(name);

  // set the not operater variable to false
  let _NOT_ = false;

  // assume comparison will fail
  let valid = false;

  // define all the supported chained methods
  const methods = {
    // flip the not operater state
    get not() {
      _NOT_ = !_NOT_;
      return methods;
    },

    // perform equality comparison
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

    // perform is defined
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

    // perform equality comparison
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

    // perform greater than comparison
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

    // perform greater than or equal comparison
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

    // perform less than comparison
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

    // less than or equal to comparison
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

    // test the length of environment variable
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

    // test to see if value contains substring
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

    // test to see if value matches regular expression
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

    // test to see if value is in array of values
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
  };

  // allow method chaining
  return methods;
}

// export the confirm environment variable function
module.exports = confirm;
