# Hermodr Logger

Hermodr, the messenger of the Norse gods, came to help you make your records easier to understand and a little more colorful.

I'had 

The Hermodr log was created to log on to the console and to a database at the same time.

Foi desenvolvidos 2 formas para criar seus logs, backend e frontend, chamadas respectivamentes de hermodr-cmd e hermodr-browser.

### Hermordr-cmd
It logs into the colored CMD and also transmits it to a mongoBD database, it has an API to retrieve data from the database.

### Dependencies and technologies used

#### Technologies
- nodeJS
- MongoDB

#### Dependencies
- express: ^4.17.1
- mongoose:^5.9.7

## Configure the Database
Hermodr uses mongoDB and MVC architecture by default, so considering this information and imagining that hermodr.js is inside the "SRC" folder and your bank connection is on the next path './models/connection.js

## How to use

download the hermodr.js file and import it into your files.

``
import hermodr from 'YOUR_PATH';
``

to log into the console and the database use log types like the one below.

``
hermodr.info (MARKER, CONTEUDO);
``

log types:
- log
- debug
- error
- warn

to log only to the database

``
hermodr.db (MARKER, CONTENT);
``
