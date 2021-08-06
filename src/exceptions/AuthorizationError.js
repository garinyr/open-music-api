const ClientError = require('./ClientError');

/**
 * AuthorizationError
 */
class AuthorizationError extends ClientError {
  /**
  * @param {string} message
  */
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

module.exports = AuthorizationError;
