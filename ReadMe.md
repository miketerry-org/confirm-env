# confirm-env

The `confirm-env` package provides a simple and flexible way to confirm the validity of environment variables in Node.js applications. It allows for setting, checking, and validating environment variables with various chained methods.

This library is useful for ensuring that required environment variables are properly configured and meet specific criteria before your application runs.

## Installation

You can install the package from npm:

```bash
npm install confirm-env

Usage

const confirm = require("confirm-env");

// Example usage:
confirm("MY_ENV_VAR")
  .is("expected_value")
  .hasLength(5, 10)
  .isDefined();


##confirm Function

The main function in the package is confirm(name, defaultValue). It takes an environment variable name as its first argument and an optional default value as the second argument. It returns a set of chained methods that allow you to check various conditions for the environment variable.

Parameters:
name (string): The name of the environment variable to confirm.
defaultValue (string | undefined): An optional default value to use if the environment variable is not set.
Returns:
Object: A chainable object that provides various methods to confirm the validity of the environment variable.

##Chained Methods and Properties

The returned object provides the following methods for checking and validating environment variables. You can chain multiple methods together to perform complex checks.

###1. .not
This method negates the subsequent condition (for logical NOT).

Usage:

confirm("MY_ENV_VAR").not.is("unexpected_value");

###2. .is(compare)
Checks if the environment variable is equal to the provided value.

Parameters:

compare (any): The value to compare the environment variable to.

Usage:

confirm("MY_ENV_VAR").is("expected_value");

###3. .isDefined()
Checks if the environment variable is defined (i.e., it is not undefined).

Usage:

confirm("MY_ENV_VAR").isDefined();

###4. .isEQ(compare)
Checks if the environment variable is equal to the provided value (same as .is()).

Parameters:

compare (any): The value to compare the environment variable to.

Usage:

confirm("MY_ENV_VAR").isEQ("expected_value");

###5. .isGT(compare)
Checks if the environment variable is greater than the provided value.

Parameters:

compare (number): The value to compare the environment variable to.

Usage:

confirm("MY_ENV_VAR").isGT(10);

###6. .isGE(compare)
Checks if the environment variable is greater than or equal to the provided value.

Parameters:

compare (number): The value to compare the environment variable to.

Usage:

confirm("MY_ENV_VAR").isGE(10);

###7. .isLT(compare)
Checks if the environment variable is less than the provided value.

Parameters:

compare (number): The value to compare the environment variable to.

Usage:

confirm("MY_ENV_VAR").isLT(100);

###8. .isLE(compare)
Checks if the environment variable is less than or equal to the provided value.

Parameters:

compare (number): The value to compare the environment variable to.

Usage:

confirm("MY_ENV_VAR").isLE(100);

###9. .hasLength(min, max)
Checks if the length of the environment variable's value is within the specified range.

Parameters:

min (number): The minimum length.
max (number): The maximum length.

Usage:

confirm("MY_ENV_VAR").hasLength(5, 10);

###10. .contains(substring)
Checks if the environment variable's value contains a specific substring.

Parameters:

substring (string): The substring to check for.

Usage:

confirm("MY_ENV_VAR").contains("part_of_value");

###11. .matches(regex)
Checks if the environment variable's value matches a regular expression.

Parameters:

regex (string): The regular expression to match.

Usage:

confirm("MY_ENV_VAR").matches("^[A-Z]{3}$");

###12. .isIn(values)
Checks if the environment variable's value is included in a provided array of values.

Parameters:

values (Array): An array of possible valid values.

Usage:

confirm("MY_ENV_VAR").isIn(["value1", "value2", "value3"]);

###13. .isPath(force = true)
Checks if the environment variable's value is a valid filesystem path. Optionally, it can create the directory if it doesn't exist.

Parameters:

force (boolean, default: true): If true, creates the directory if it doesn't exist. If false, will throw an error if the path doesn't exist.

Usage:

confirm("MY_ENV_VAR").isPath();

##Example

Here's a full example of using the package to confirm multiple conditions for an environment variable:

const confirm = require("confirm-env");

confirm("DATABASE_URL")
  .isDefined()
  .contains("mongodb")
  .is("mongodb://localhost:27017")
  .hasLength(10, 100);

   this example, the following checks are performed on the DATABASE_URL environment variable:

It must be defined.
It must contain the substring "mongodb".
It must be equal to "mongodb://localhost:27017".
Its length must be between 10 and 100 characters.

##License

This package is licensed under the MIT License.
```
