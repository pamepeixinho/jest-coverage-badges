# Jest Coverage Badges

> Create a group of coverage badge

[![License][license-image]][license-url]
[![npm](https://img.shields.io/npm/dw/jest-coverage-badges.svg)](https://www.npmjs.com/package/jest-coverage-badges)

[license-url]: https://opensource.org/licenses/MIT
[license-image]: https://img.shields.io/npm/l/make-coverage-badge.svg

Creates a group of code coverage badges like the following:

![Coverage badge gree][coverage-badge-green] ![Coverage badge gree][coverage-badge-yellow] ![Coverage badge gree][coverage-badge-red]

[coverage-badge-green]: https://img.shields.io/badge/Coverage-100%25-brightgreen.svg
[coverage-badge-yellow]: https://img.shields.io/badge/Coverage-100%25-yellow.svg
[coverage-badge-red]: https://img.shields.io/badge/Coverage-100%25-red.svg

Currently just reads from Istanbul's JSON summary reporter and downloads a badge from https://shields.io/ for each jest coverage type (`statement`, `branch`, `functions`, `lines`). Like this:

![Coverage lines](https://img.shields.io/badge/Coverage:lines-100-green.svg)
![Coverage functions](https://img.shields.io/badge/Coverage:functions-100-green.svg)
![Coverage branches](https://img.shields.io/badge/Coverage:branches-100-green.svg)
![Coverage statements](https://img.shields.io/badge/Coverage:statements-100-green.svg)


*This package is an extension of [make-coverage-badge], but this one creates all the types of coverage.*

[make-coverage-badge]:https://www.npmjs.com/package/make-coverage-badge


## Usage

1. Install jest-coverage-badges in your project or global

      *Project* (in your project folder):

      ```npm install --save jest-coverage-badges```

      *Global*:

      ```npm install --global jest-coverage-badges```


2. Configure Jest (in `package.json`):

      _(optional: "text" and "lcov")_

    ```json
    "jest": {
      "coverageReporters": [
        "json-summary", 
        "text",
        "lcov"
      ]
    }
    ```

    If you installed in your project, you can create a script to run it, for example:


    ```json
    "scripts": {
      "test:coverage": "npm test -- --coverage",
      "test:badges": "npm run test:coverage  && jest-coverage-badges"
    }
    ```


2. Run `npm test -- --coverage`

3. Run `jest-coverage-badges` (or just run: `npm run test:badges`)

    Resulting in badges:
    - `./coverage/badge-statements.svg`
    - `./coverage/badge-lines.svg`
    - `./coverage/badge-functions.svg`
    - `./coverage/badge-branches.svg`

#### CLI Options
  * **input** [default: ./coverage/coverage-summary.json] - the file (and its path) of the summary json that contains the coverage data     
  * **output** [default: ./coverage] - the path to the directory where the svg files will be placed after download. If path doesn't exist it will be created.

**Example**:    
  ```$ jest-coverage-badges input "./cov" output "./badges"```     


After this you can add into Github readme (for example) :smiley:

## Why use this package?

We have great companies like coveralls and codecov, but it's paid for private repositories. If this package we can add badges in our readme by creating the badges (this can be run at your build, upload to a store and consume in the readme or the website).


## Author of adaptation of (make-coverage-badge)

© 2018 **[Main Author of Adaptations]** Pamela Peixinho <git@pamepeixinho.com> (https://pamepeixinho.github.io)
