const url = 'http://localhost:3000',
      util = require('util'),
      io = require('socket.io-client')(url),
      EOL = require('os').EOL,
      readline = require('readline'),
      credentials = {
        login: null,
        password: null
      },
      state = { connected: false },
      rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      }),
      authenticate = function() {
        if (state.connected && credentials.login)
          io.emit('login', credentials)
      },
      commands = {
        login(login, password) {
          credentials.login = login;
          credentials,password = password;
          authenticate();
        },
        register(login, password) {
          credentials.login = login;
          credentials.password = password;

          io.emit('register', credentials);
        },
        process(command) {
          const args = command.split(" ");
          this[args.shift()].apply(undefined, args);
        },
      },
      writeLine = function(line, ...args) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(util.format(line, ...args) + EOL);

        rl.prompt(true);
      };

rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  // console.log(line);

  if (line[0] === "/") {
    commands.process(line.slice(1))
  } else {
    io.emit('message', {body: line});
    rl.prompt();
  }
});

io.on('message', function({ body, from }) {
  writeLine('%s: %s', from, body);
}).
on('login', function({ result }) {
  if (result === true) {
    rl.setPrompt(credentials.login + ": ");
    writeLine('Login success');
  } else {
    writeLine('Login failed');
  }
}).
on('connect', function() {
  state.connected = true;
  authenticate();
}).
on('disconnected', function() {
  state.connected = false;
}).
on('register', function(result) {
  writeLine(result ? 'Registered' : 'Registration failed');
});

