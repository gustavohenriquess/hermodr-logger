# Hermodr Logger

Hermodr, the messenger of the Norse gods, has come to help you make your logs easier to understand and a little more colorful.

The Hermodr log was created to make logs on to the console and to a database at the same time.

Two ways were developed to create your logs, backend and frontend, respectively called hermodr-logger.

### Improvements

- Save logs to file
- Create multi-database compatibility (Prisma)
- resolve close database connection

### Hermordr-logger

It logs into the colored CMD and also transmits it to a mongoDB database.

## Technologies

- Typescript
- nodeJS
- MongoDB

## How to use

Run this command to install the hermodr-logger npm

```
  npm i hermodr-logger
```

import the file as below

```
  import Hermodr from "hermodr-logger";
```

how to use

```
  Hermodr.log('message')
  Hermodr.warn('message')
  Hermodr.debug('message')

  //Functions can take multiple arguments
  Hermodr.error('message', 'multi message')
```

existing configurations

```
  Hermodr.config({
  stack: false,
  database: {
    database: false,
    database_name: "mongodb",
    database_uri: process.env.MONGO_URI,
  },
})
```

Configs

- Stack:
  - default false
  - Stack is always displayed when .error() or .debug() is used
- Database:
  - if database.database is true you also need to set database_name and database_uri
  - the database name can be one of: "mongodb"

## Image

![Hermodr-cmd](Images/cmd.png)
