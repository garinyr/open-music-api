/**
 * ExportsHandler
 */
class ExportsHandler {
  /**
   * @param {*} service
   * @param {*} playlistsService,
   * @param {*} validator
   */
  constructor(service,
      playlistsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postExportPlaylistsHandler =
    this.postExportPlaylistsHandler.bind(this);
  }

  /**
   * @param {*} request
   * @param {*} h
   * @return {*}
   */
  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);


    const {id: userId} = request.auth.credentials;
    const {playlistId} = request.params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

    const message = {
      userId,
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await
    this._service.sendMessage('export:playlists', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
