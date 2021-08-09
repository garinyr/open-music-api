const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

/**
 * PlaylistsService
 */
class PlaylistsService {
  /**
 * constructor
 * @param {string} collaborationService
 * @param {string} cacheService
 */
  constructor(collaborationService, cacheService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
    this._cacheService = cacheService;
  }

  /**
   * @param {string} name
   * @param {string} owner
   * @return {string} response
  */
  async addPlaylist({name, owner}) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    this._cacheService.delete(`playlists:${owner}`);

    return result.rows[0].id;
  }

  /**
   * @param {string} owner
   * @return {string} response
   */
  async getPlaylists(owner) {
    try {
      const result = await this._cacheService.get(`playlists:${owner}`);
      if (result) {
        console.log(result);
        return JSON.parse(result);
      }
    } catch (error) {
      const query = {
        text: `
        SELECT playlists.id, playlists.name, users.username FROM playlists
        LEFT JOIN users ON users.id = playlists.owner
        LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
        WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
        values: [owner],
      };
      const result = await this._pool.query(query);

      await
      this._cacheService.set(`playlists:${owner}`,
          JSON.stringify(result.rows));

      return result.rows;
    }
  }

  /**
   * @param {string} id
   * @param {string} credentialId
   */
  async deletePlaylistById(id, credentialId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1' +
      'AND owner = $2 RETURNING id',
      values: [id, credentialId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus. '+
       'Id tidak ditemukan');
    }


    this._cacheService.delete(`playlists:${credentialId}`);
  }

  /**
   * @param {*} playlistId
   * @param {*} songId
   * @return {*} result
   */
  async addPlaylistsong({playlistId, songId}) {
    console.log('addPlaylistsong');
    const id = `playlist-song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    console.log(query);

    const result = await this._pool.query(query);
    console.log(result);

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }

    this._cacheService.delete(`playlistSongs:${playlistId}`);
    return result.rows[0].id;
  }

  /**
   * @param {string} playlistId
   * @return {string} response
   */
  async getPlaylistSongs(playlistId) {
    try {
      const result =
      await this._cacheService.get(`playlistSongs:${playlistId}`);

      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT songs.id, songs.title, songs.performer FROM playlistsongs
        LEFT JOIN songs ON songs.id = playlistsongs.song_id
        WHERE playlistsongs.playlist_id = $1`,
        values: [playlistId],
      };
      const result = await this._pool.query(query);

      // error
      if (!result.rowCount) {
        throw new
        AuthorizationError('Anda tidak berhak mengakses resource ini');
      }
      await this._cacheService.set(`playlistSongs:${playlistId}`,
          JSON.stringify(result.rows));
      return result.rows;
    }
  }

  /**
   * @param {*} playlistId
   * @param {*} songId
   */
  async deletePlaylistSongs(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE ' +
      'playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal dihapus dari playlist, '+
      'Id tidak ditemukan');
    }
    this._cacheService.delete(`playlistSongs:${playlistId}`);
  }

  /**
   * @param {*} playlistId
   * @param {*} owner
   */
  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  /**
   * @param {*} playlistId
   * @param {*} userId
   */
  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await
        this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}
module.exports = PlaylistsService;
