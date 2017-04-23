class DummyAuthenticator {
  constructor({ users }) {
    this._userPasswords = new Map();
    Object.keys(users).forEach(function(login) {
      this._userPasswords.set(login,  users[login]);
    }, this);
  }

  validate(login, password) {
    if (this._userPasswords.has(login) && this._userPasswords.get(login) === password) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  }
};


module.exports = DummyAuthenticator;