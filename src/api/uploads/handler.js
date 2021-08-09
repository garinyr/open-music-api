const path = require('path');

/**
 * UploadsHandler
 */
class UploadsHandler {
  /**
   * constructor
   * @param {*} service
   * @param {*} validator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler =
    this.postUploadImageHandler.bind(this);

    this.getUploadImageHandler =
    this.getUploadImageHandler.bind(this);
  }

  /**
   * @param {*} request
   * @param {*} h
   * @return {*}
   */
  async postUploadImageHandler(request, h) {
    const {data} = request.payload;
    this._validator.validateImageHeaders(data.hapi.headers);

    const filename = await this._service.writeFile(data, data.hapi);

    const response = h.response({
      status: 'success',
      data: {
        pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/pictures/${filename}`,
      },
    });
    response.code(201);
    return response;
  }

  /**
   * @param {*} request
   * @param {*} h
   * @return {*}
   */
  async getUploadImageHandler(request, h) {
    const {filename} = request.params;
    const filepath =
    path.resolve(__dirname, '../../uploads/file/pictures', filename);
    return h.file(filepath);
  }
}

module.exports = UploadsHandler;
