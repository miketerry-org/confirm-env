<br/>

# **checkenv**

<br/>

## Package to verify environment variables

<br/>

**checkenv** is a zero dependency package which exports the **check(name)** function which is used to verify environment variables meet all requirements. The **check** function accepts the name of the environment variable you want to verify. This function returns a number of nested comparison functions which can be chained together to ensure the named environment variable meets all requirements. If any of the comparison functions fail an error will be thrown with an appropriate error message. It is recommended you use a try/catch block when using the **check** function. Your application can then recover from the error or if necessary it can halt the execution of the program.

<br/>

### Comparisons which accept no parameters

<br/>

- **not** &rarr; Negates the next comparison function.

<br/>

### Comparisons which accept no parameters

<br/>

### Comparisons which accept two parameters

<br/>
<br/>

### Comparisons which will validate and optionally alter the environment variable

<br/>

- **toBeFile(expand)** &rarr; Environment variable is optionally expanded to full filename and always verified to exist.
- **toBePath(expand, autoCreate)** &rarr; Environment variable is optionally expanded to full pathname and optionally created

<br/>

### Code Block

```

// import the check function
const check = require("checkenv");

try {
// ensure node environment variable is one of the allowed values
check("NODE_ENV").toBeIn(["DEBUG", "DEV", "PROD", "TEST"]);

// ensure server port is defined and between 1000 and 60000
check("SERVER_PORT").toBeGreaterThanOrEqual(1000).toBeLessThanOrEqual(60000);

// ensure database connection string is defined
check("DB_URL").toBeDefined();

// ensure the public folder exists and expand too fully qualified path
check("PUBLIC_PATH").toBePath(true, false);

// ensure views path is defined
check("VIEWS_PATH").toBePath(true, false);

// ensure log path defined and create it if necessary
check("LOG_PATH").toBePath(true, true);

} catch(err) {
    // log error message to console
    console.error(err.message);

    // not safe to continue program execution so halt program
    process.exit(1);
}

```

<br/>

### NODE_ENV and the **check** function

<br/>

Often developers will need separate values for development, debugging, testing and production. One common environment variable needing this support is the URL for a database connnection string. Imagine the need for a separate database to be used when developing, another when debugging, another when using automated testing andstill another when in production. This requires threee environment variables be defined on the local machine and one on the remote production machine:

<br/>

Local development machine environment variables:

<br/>

- **DB_URL_DEV** &rarr; URL for local development database.
- **DB_URL_DEBUG** &rarr; URL for local debug database.
- **DB_URL_TEST** &rarr; URL for local testing database.
- **SERVER_PORT** &rarr; HTTP port for local server development.

<br/>

Remote production machine environment variables:

<br/>

- **DB_URL** &rarr; URL for production database.
- **SERVER_PORT** &rarr; HTTP port for remote production server.

<br/>

when the **check function is called it first checks to see if the environment variable specified by the "name" parameter exists. If it does exist then the **check\*\* function proceeds normally. However, if the "name" environment variable does not exist and the NODE_ENV variable does exist, then an underscore character and the value of the NODE_ENV variable are appended to the "name" parameter. If a variable with this new name exists then the environment variable with the new name will be renamed to the original name. Ffor exammple, if name equals "DB_URL" and "NODE_ENV" equals "DEV", the "DB_URL_DEV" environment variable will be renamed to "DB_URL". If neither name exists then an error is thrown with an appropriate message.

<br/>

There are several NPM packages like [**dotenv**](https://github.com/motdotla/dotenv#readme), which allow you to define a file containing all local development environment variables. If you use one of these packages you must initialize the package before calling the check function. By using an .env file to declare development environment variables and using the production server admin console to define production values, goals two and three of the [12 Factor Methodology](https://12factor.net) are achieved.

##Comparisons

- data type comparisons
- value comparisons
- string comparisons
- special comparisons

x- not
x -is(value)
x- is LT(value)
x- isLE(value)
x-isGT(value)
x- isGE(value)- isBetween(minValue, maxValue)
x- isBetween

- isBoolean
- isEmail
- isURL
- isDate
- isTime
- isAlpha
- isAlphaNumeric

x- isLength(minLength, maxLength)

- isHex
- isUUID
- isIP
- isLowercase
- isUppercase
- isNotEmpty
- isInteger
- isFloat
- isNumber
- isDefined
- isUndefined
  x- isSubstr(substr)
  x- isMatch(regEx)
  x- isIn(array)
- isFile(filename)
- isPath(dirname)

x- not
