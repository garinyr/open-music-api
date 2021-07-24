const ClientError = require('./ClientError');

/**
 * NotFoundError
 */
class NotFoundError extends ClientError {
  /**
   * @param {*} message
   */
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
