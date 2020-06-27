# Tasks Manager
This repository contains a sample project of a Task Manager API.

## Getting started
```bash
# install dependencies
npm install

# create .env file from example (don't forget to edit it)
cp .env.example .env

# build project
npm run build

# run project
npm start
```

## Technologies
| Name                 | Description                                                                   |
| -------------------- | ----------------------------------------------------------------------------- |
| NodeJS               | JavaScript runtime environment that executes JS code outside a web browser    |
| Express              | Web application framework for Node.js                                         |
| TypeORM              | ORM for TypeScript and JavaScript that supports SQL                           |
| Lodash               | JS library which provides utility functions for common programming tasks      |
| Jest                 | Testing library for JavaScript                                                |
| TypeScript           | JavaScript compiler/type checker that boosts JavaScript productivity          |

## Running
List of all the available scripts:

| NPM Script           | Description                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| `serve`              | Runs node on `dist/index.js` which is the app entry point                                         |
| `start`              | Does the same as 'npm run serve'. Can be invoked without the `run` param                          |
| `watch`              | Runs app with nodemon so the process restarts if it crashes or a file changes                     |
| `build`              | Compiles all source `.ts` files to `.js` files in the `dist` folder                               |
| `watch-build`        | Same as `build` but continuously watches `.ts` files and re-compiles when needed                  |

## Versioning
We use [SemVer](http://semver.org/) for versioning.
