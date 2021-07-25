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
 */
  constructor() {
    this._pool = new Pool();
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

    return result.rows[0].id;
  }

  /**
   * @param {string} owner
   * @return {string} response
   */
  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.owner = $1`,
      values: [owner],
    };
    const result = await this._pool.query(query);

    return result.rows;
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
    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. '+
       'Id tidak ditemukan');
    }
  }

  /**
   * @param {*} playlistId
   * @param {*} songId
   * @return {*} result
   */
  async addPlaylistsong({playlistId, songId}) {
    const id = `playlist-song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }

    return result.rows[0].id;
  }

  /**
   * @param {string} playlistId
   * @return {string} response
   */
  async getPlaylistSongs(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlistsongs
      LEFT JOIN songs ON songs.id = playlistsongs.song_id
      WHERE playlistsongs.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    // error
    if (!result.rows.length) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }

    return result.rows;
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

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus dari playlist, '+
      'Id tidak ditemukan');
    }
  }

  /**
   * @param {*} playlistsId
   * @param {*} owner
   */
  async verifyPlaylistOwner(playlistsId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistsId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}
module.exports = PlaylistsService;
