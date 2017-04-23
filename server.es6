const yaml = require('js-yaml'),
      fs = require('fs'),
      path = require('path'),
      dbPath = path.join(__dirname, "./var/users.db"),
      config = yaml.safeLoad(fs.readFileSync(path.join(__dirname,  'config', 'server.yml'), 'utf-8')),
      io = require('socket.io')(config.port),
      authenticator = require('./lib/Authenticator.es6'),
      ChatServer = require('./lib/ChatServer.es6'),
      server = new ChatServer({ io, authenticator: new authenticator({ path: dbPath }) });

server.init();







