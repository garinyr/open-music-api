const ClientError = require('../../exceptions/ClientError');


/**
 * AuthenticationsHandler
 */
class AuthenticationsHandler {
  /**
   * @param {*} authenticationsService
   * @param {*} usersService
   * @param {*} tokenManager
   * @param {*} validator
   */
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler =
    this.deleteAuthenticationHandler.bind(this);
  }

  /**
   * @param {string} request
   * @param {string} h
   * @return {string} response
   */
  async postAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload);

    const {username, password} = request.payload;
    const id =
      await this._usersService.verifyUserCredential(username, password);

    const accessToken = this._tokenManager.generateAccessToken({id});
    const refreshToken = this._tokenManager.generateRefreshToken({id});

    await this._authenticationsService.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  /**
   * @param {string} request
   * @param {string} h
   * @return {string} response
   */
  async putAuthenticationHandler(request, h) {
    this._validator.validatePutAuthenticationPayload(request.payload);
    const refreshToken = request.payload.refreshToken;
    console.log('refreshToken >>> '+refreshToken);

    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const {id} = this._tokenManager.verifyRefreshToken(refreshToken);
    console.log('id >>>'+id);

    const accessToken = this._tokenManager.generateAccessToken({id});
    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken,
      },
    };
  }

  /**
   * @param {string} request
   * @param {string} h
   * @return {string} response
   */
  async deleteAuthenticationHandler(request, h) {
    this._validator.validateDeleteAuthenticationPayload(request.payload);

    const {refreshToken} = request.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    };
  }
}

module.exports = AuthenticationsHandler;
