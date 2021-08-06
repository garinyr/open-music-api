const ClientError = require('../../exceptions/ClientError');

/**
 * SongsHandler
 */
class SongsHandler {
  /**
   * @param {string} service
   * @param {string} validator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  /**
   * @param {string} request
   * @param {string} h
   * @return {string} response
   */
  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {title, year, performer, genre, duration} = request.payload;

    const songId = await this._service.addSong({
      title,
      year,
      performer,
      genre,
      duration,
    });

    const response = h.response({
      status: 'success',
      message: 'Music berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  /**
   * @return {string} response
   */
  async getSongsHandler() {
    const songs = await this._service.getSongs();
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  /**
   * @param {string} request
   * @param {string} h
   * @return {string} response
   */
  async getSongByIdHandler(request, h) {
    const id = request.params['songId'];
    const song = await this._service.getSongById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  /**
   * @param {string} request
   * @param {string} h
   * @return {string} response
   */
  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {title, year, performer, genre, duration} = request.payload;
    const id = request.params['songId'];

    await this._service.editSongById(id, {
      title,
      year,
      performer,
      genre,
      duration,
    });

    return {
      status: 'success',
      message: 'Music berhasil diperbarui',
    };
  }

  /**
   * @param {string} request
   * @param {string} h
   * @return {string} response
   */
  async deleteSongByIdHandler(request, h) {
    const id = request.params['songId'];
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Music berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
