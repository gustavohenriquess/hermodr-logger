const express = require('express');
const mongoose = require('mongoose');
const { Hermodr, HermodrRoutes} = require('./hermodr-cmd');

const app = express();

mongoose.connect('YOUR_CONNECTION_STRING', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.json());
app.use(HermodrRoutes)

Hermodr.log("Index.js", "server status ONLINE on port: 3333")
Hermodr.debug("Index.js", "server status ONLINE on port: 3333")
Hermodr.warn("Index.js", "server status ONLINE on port: 3333")
Hermodr.error("Index.js", "server status ONLINE on port: 3333")
Hermodr.db("DBLOG", 'Index.js', "server status ONLINE on port: 3333")


app.listen(3333)
//console.log(process.argv);
