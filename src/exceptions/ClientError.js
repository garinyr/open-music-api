/**
 * ClientError
 */
class ClientError extends Error {
  /**
   * @param {*} message
   * @param {*} statusCode
   */
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}

module.exports = ClientError;
