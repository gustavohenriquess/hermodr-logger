const restify = require('restify');
const server = restify.createServer();

//Server config
server.use(restify.plugins.queryParser());

const {
  Hermodr,
  HermodrRoutes
} = require('./hermodr-cmd');

try {
  const mongoose = require('mongoose');

  mongoose.connect('YOUR_STRING_CONNECTION_HERE', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
} catch (e) {
  Hermodr.error("index.js | LINE 20", "Não foi possivel efetuar a conexão com o DB");
}

server.get('/logs', HermodrRoutes);

server.listen(3000, () => {
  Hermodr.log("Index.js", "server status ONLINE on port: 3000");
  Hermodr.debug("Index.js", "server status ONLINE on port: 3000");
  Hermodr.warn("Index.js", "server status ONLINE on port: 3000");
  Hermodr.error("Index.js", "server status ONLINE on port: 3000");
  Hermodr.db("DBLOG", 'Index.js', "server status ONLINE on port: 3000");
});
