const bcrypt = require('bcrypt'),
      ITERATIONS = 12;

class Authenticator {
  constructor({ path }) {
    this._db = require('then-levelup')(require('level')(path));
  }

  validate(login, password) {
    return this._db.get(login).then(function(passwordHash) {
      console.log("Get %s", login);

      return bcrypt.compare(password, passwordHash).then(function(passwordMatches) {
        console.log("Password matches %s", passwordMatches);
        // Resolve with a boolean sayin whether the password was OK, not a Promise
        return passwordMatches;
      });
    }, function(error) { return false });
  }

  register(login, password) {
    const db = this._db;

    return bcrypt.hash(password, ITERATIONS).then(function(passwordHash) {
      return db.put(login, passwordHash);
    });
  }
};


module.exports = Authenticator;
