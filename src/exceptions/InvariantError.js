const ClientError = require('./ClientError');

/**
 * InvariantError
 */
class InvariantError extends ClientError {
  /**
   * @param {*} message
   */
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}

module.exports = InvariantError;
