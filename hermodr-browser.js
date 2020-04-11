/*
 *
 *   Hermodr Logger
 *
 *
 *   Console Helpers: 
 *                       -   http://voidcanvas.com/make-console-log-output-colorful-and-stylish-in-browser-node/
 *                       -   https://imasters.com.br/desenvolvimento/como-criar-um-console-colorido-usando-nodejs
 *
 *   Comando para CMD
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
const hasMongoDB = (mongoose) ? true : false;


// MongoDB Configs
const logSchema = new mongoose.Schema({

    level: String,
    marker: String,
    date: String,
    message: []
});

const Log = mongoose.model('Log', logSchema);

// Hermodr
let definitions = {

    colors: {
        black: "black",
        orange: 'orange',
        red: 'red',
        green: 'green',
        yellow: 'yellow',
        blue: 'blue',
        cyan: 'cyan',
        white: 'white',
    }
}

let setttings = {
    LOG: {
        levelBgc: definitions.colors.green,
        levelColor: definitions.colors.white,
        date: definitions.colors.yellow,
        message: definitions.colors.white
    },
    DEBUG: {
        levelBgc: definitions.colors.yellow,
        levelColor: definitions.colors.red,
        date: definitions.colors.orange,
        message: definitions.colors.white
    },
    WARN: {
        levelBgc: definitions.colors.orange,
        levelColor: definitions.colors.white,
        date: definitions.colors.yellow,
        message: definitions.colors.white
    },
    ERROR: {
        levelBgc: definitions.colors.red,
        levelColor: definitions.colors.white,
        date: definitions.colors.yellow,
        message: definitions.colors.white
    }
}

function insertDatabase(level, marker, date, message) {

    if (!hasMongoDB) return;

    var object = {
        level: level,
        marker: marker,
        date: date,
        message: message
    };

    Log.create(object);
}

function makeLog(level, marker, date, message) {

    let levelBgc = setttings[level]['levelBgc'];
    let levelColor = setttings[level]['levelColor'];
    let dateColor = setttings[level]['date'];
    let messageColor = setttings[level]['message'];

    console.log(`%c ${level} %c    ${marker}  %c  ${date}    %c${message}`, `background: ${levelBgc}; color: ${levelColor}`, `color: white`, `color: ${dateColor}`, `color: ${messageColor}`);

    insertDatabase(level, marker, date, message);

}

let Hermodr = {};

Hermodr.log = function (marker, ...message) {

    let date = new Date().toISOString();

    makeLog("LOG", marker, date, message);
}

Hermodr.debug = function (marker, ...message) {

    let date = new Date().toISOString();

    makeLog("DEBUG", marker, date, message);
}

Hermodr.warn = function (marker, ...message) {

    let date = new Date().toISOString();

    makeLog("WARN", marker, date, message);
}

Hermodr.error = function (marker, ...message) {

    let date = new Date().toISOString();

    makeLog("ERROR", marker, date, message);
}

Hermodr.db = function (level, marker, ...message) {

    let date = new Date().toISOString();

    insertDatabase(level, marker, date, message);
}


// Routes to retrieve logs
routes.get('/logs', async (req, res) => {

    const search = req.query;
    const searchables = ['level','date', 'marker'];

    console.log(search)
    
    for(var i in search){
        
        if(!searchables.includes(i)){
            delete search[i]
        }
    }
    
    console.log(search)

    const logs = await Log.find(search).sort({date: -1}).limit(5)
    
    return res.json(logs);
});

module.exports = {
    Hermodr: Hermodr,
    HermodrRoutes: routes
};