const express = require('express');
const mongoose = require('mongoose');
const { Hermodr, HermodrRoutes} = require('./hermodr-browser');

const app = express();

mongoose.connect('mongodb+srv://hermodr:testhermodr@cluster0-10pgo.gcp.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.json());
app.use(HermodrRoutes)

Hermodr.log("Index.js", "server status ONLINE on port: 3333")
Hermodr.debug("Index.js", "server status ONLINE on port: 3333")
Hermodr.warn("Index.js", "server status ONLINE on port: 3333")
Hermodr.error("Index.js", "server status ONLINE on port: 3333")
Hermodr.db("Não interessa.js", "server status ONLINE on port: 3333")


app.listen(3333)
//console.log(process.argv);
console.log('\x1b[42m\x1b[37m%s\x1b[0m%s\x1b[33m%s\x1b[0m', ' LOG ', '  INDEX.JS  ', `${new Date().toISOString()}`, 'SERVER ON')