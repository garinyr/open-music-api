
/**
 * PlaylistsHandler
 */
class PlaylistsHandler {
  /**
   * @param {string} service
   * @param {string} validator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.addPlaylistSongHandler = this.addPlaylistSongHandler.bind(this);
    this.getPlaylistSongHandler = this.getPlaylistSongHandler.bind(this);
    this.deletePlaylistSongHandler =
     this.deletePlaylistSongHandler.bind(this);
  }

  /**
   * @param {string} request
   * @param {string} h
   * @return {string} response
   */
  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const {name} = request.payload;
    const {id: credentialId} = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({name,
      owner: credentialId});

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
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
  async getPlaylistsHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  /**
   * @param {string} request
   * @param {string} h
   * @return {string} response
   */
  async deletePlaylistByIdHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const id = request.params['playlistId'];
    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistById(id, credentialId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }


  /**
   * @param {string} request
   * @param {string} h
   * @return {string} response
   */
  async addPlaylistSongHandler(request, h) {
    const {playlistId} = request.params;
    const {songId} = request.payload;
    const {id: credentialId} = request.auth.credentials;
    this._validator.validatePlaylistSongPayload(request.payload);

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.addPlaylistsong({playlistId, songId});

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  /**
   * @param {string} request
   * @param {string} h
   * @return {string} response
   */
  async getPlaylistSongHandler(request, h) {
    const {playlistId} = request.params;
    const {id: credentialId} = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const songs = await this._service.getPlaylistSongs(playlistId);
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
  async deletePlaylistSongHandler(request, h) {
    const {playlistId} = request.params;
    const {songId} = request.payload;
    const {id: credentialId} = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deletePlaylistSongs(playlistId, songId);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistsHandler;
