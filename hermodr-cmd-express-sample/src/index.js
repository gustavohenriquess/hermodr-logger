const express = require('express');
const { Hermodr, HermodrRoutes} = require('./hermodr-cmd-express');

const app = express();

try {
    const mongoose = require('mongoose');
  
    mongoose.connect('mongodb+srv://hermodr:hermodr123@cluster0.10pgo.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (e) {
    Hermodr.error("index.js | LINE 14", "Não foi possivel efetuar a conexão com o DB");
  }

app.use(express.json());
app.use(HermodrRoutes);

Hermodr.log("Index.js", "server status ONLINE on port: 3333");
Hermodr.debug("Index.js", "server status ONLINE on port: 3333");
Hermodr.warn("Index.js", "server status ONLINE on port: 3333");
Hermodr.error("Index.js", "server status ONLINE on port: 3333");
Hermodr.db("DBLOG", 'Index.js', "server status ONLINE on port: 3333");


app.listen(3333)
//console.log(process.argv);
