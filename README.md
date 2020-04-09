# Hermodr Logger

Hermodr, the messenger of the Norse gods, came to help you make your records easier to understand and a little more colorful.

The Hermodr log was created to log on to the console and to a database at the same time.

## Getting Started

### Dependencies and technologies used

#### Technologies

#### Dependencies

#### Dev Dependences

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
