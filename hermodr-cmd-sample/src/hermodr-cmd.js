/*
 *
 *   Hermodr Logger
 *
 *
 *   Console Helpers: 
 *                       -   http://voidcanvas.com/make-console-log-output-colorful-and-stylish-in-browser-node/
 *                       -   https://imasters.com.br/desenvolvimento/como-criar-um-console-colorido-usando-nodejs
 *
 *   Commands for CMD
 *                       -   console.log('\x1b[42m\x1b[37m%s\x1b[0m%s\x1b[33m%s\x1b[0m', ' LOG ', '  INDEX.JS  ', '  date  ', 'SERVER ON')
 *                       -   https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
 * 
 */


// IMPORTS
const mongoose = require('mongoose');
const {
    Router
} = require('express');

//Configs
const routes = Router();


// MongoDB Configs
const logSchema = new mongoose.Schema({

    level: String,
    marker: String,
    date: String,
    message: []
});

const Log = mongoose.model('Log', logSchema);

// Hermodr Configs
let setttings = {
    LOG: '\x1b[42m\x1b[37m%s\x1b[0m%s\x1b[33m%s\x1b[0m',
    DEBUG: '\x1b[43m\x1b[31m%s\x1b[0m%s\x1b[33m%s\x1b[0m',
    WARN: '\x1b[45m%s\x1b[0m%s\x1b[33m%s\x1b[0m',
    ERROR: '\x1b[41m%s\x1b[0m%s\x1b[33m%s\x1b[0m',
};

function formattedDateTime(date) {

    var day, month, year, hour, minutes, seconds;

    var dateReturn = "";

    day = date.getDate().toString();
    month = (date.getMonth() + 1).toString();
    year = date.getFullYear();

    hour = date.getHours().toString();
    minutes = date.getMinutes().toString();
    seconds = date.getSeconds().toString();

    month = month.length == 1 ? "0" + month : month;
    day = day.length == 1 ? "0" + day : day;

    hour = hour.length == 1 ? "0" + hour : hour;
    minutes = minutes.length == 1 ? "0" + minutes : minutes;
    seconds = seconds.length == 1 ? "0" + seconds : seconds;

    dateReturn = year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;

    return dateReturn;
}

function insertDatabase(level, marker, date, message) {

    var object = {
        level: level,
        marker: marker,
        date: date,
        message: message
    };

    Log.create(object);
}

function makeLog(level, marker, message) {

    const style = setttings[level];
    const date = formattedDateTime(new Date());

    console.log(`${style}`, ` ${level} `, ` ${marker} `, ` ${date} `, ` ${message} `);

    insertDatabase(level, marker, date, message);

};

let Hermodr = {};

Hermodr.log = function (marker, ...message) {

    let date = formattedDateTime(new Date());
    let level = "LOG";

    makeLog(level, marker, date, message);

    insertDatabase(level, marker, date, message);
};

Hermodr.debug = function (marker, ...message) {

    let date = formattedDateTime(new Date());
    let level = "DEBUG";

    makeLog(level, marker, date, message);

    insertDatabase(level, marker, date, message);
};

Hermodr.warn = function (marker, ...message) {

    let date = formattedDateTime(new Date());
    let level = "WARN";

    makeLog(level, marker, date, message);

    insertDatabase(level, marker, date, message);
};

Hermodr.error = function (marker, ...message) {

    let date = formattedDateTime(new Date());
    let level = "ERROR";

    makeLog(level, marker, date, message);

    insertDatabase(level, marker, date, message);
};

Hermodr.db = function (level, marker, ...message) {

    let date = formattedDateTime(new Date());

    insertDatabase(level, marker, date, message);
};


// Routes to retrieve logs
routes.get('/logs', async (req, res) => {

    const search = req.query;
    const searchables = ['level', 'date', 'marker'];

    for (var i in search) {

        if (!searchables.includes(i)) {
            delete search[i];
        }
    }

    const logs = await Log.find(search).sort({
        date: -1
    }).limit(15);

    return res.json(logs);
});

module.exports = {
    Hermodr: Hermodr,
    HermodrRoutes: routes
};