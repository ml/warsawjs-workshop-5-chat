class ChatServer {
  constructor({ io, authenticator }) {
    this._io = io;
    this._authenticator = authenticator;
  }

  init() {
    const io = this._io,
          authenticator = this._authenticator;

    io.on('connection', function(socket) {
      const clientData = { login: null, password: null };

      socket.on('message', function({ body })  {
        if (clientData.login)
          io.sockets.emit('message', { body: body, from: clientData.login });
      }).
      on('login', function({ login, password }) {
        authenticator.validate(login,  password).then(function validationFinished(result) {
          if (result) {
            clientData.login = login;
          }

          socket.emit('login', { result: result });
        }).catch(function validationError(error) {
          socket.emit('login', { result: false, error: error });
        });

      }).
      on('register', function({ login, password }) {
        console.log("Registration %s %s", login,  password);

        authenticator.register(login, password).then(function(result) {
          if (result) {
            socket.emit('register', {result: result });
          } else {
            socket.emit('register', { result: result, error: "Login taken" });
          }
        })
      });
    });
  }
}

module.exports = ChatServer;