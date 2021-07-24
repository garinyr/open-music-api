const ClientError = require('./ClientError');
/**
* AuthenticationError
*/
class AuthenticationError extends ClientError {
/**
*@param {string} message error message.
*/
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

module.exports = AuthenticationError;
