const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
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
   * @param {string} username
   * @return {string} response
  */
  async addPlaylist({name, username}) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, username],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * @param {string} username
   * @return {string} response
   */
  async getPlaylists(username) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
      LEFT JOIN users ON users.id = playlists.username
      WHERE playlists.username = $1`,
      values: [username],
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
      'AND username = $2  RETURNING id',
      values: [id, credentialId],
    };

    const result = await this._pool.query(query);
    console.log(result);
    if (!result.rows.length) {
      throw new AuthorizationError('Playlist gagal dihapus.'+
       'Id tidak ditemukan');
    }
  }
}
module.exports = PlaylistsService;
