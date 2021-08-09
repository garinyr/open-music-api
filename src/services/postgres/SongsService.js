const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const {mapDBToModel} = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * SongsService
 */
class SongsService {
  /**
   * constructor
   * @param {*} cacheService
   */
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  /**
   * @param {string} title
   * @param {int} year
   * @param {string} performer
   * @param {string} genre
   * @param {int} duration
   * @return {*} result
   */
  async addSong({title, year, performer, genre, duration}) {
    const id = `song-${nanoid(16)}`;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const query = {
      text: 'INSERT INTO' +
      ' songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [
        id,
        title,
        year,
        performer,
        genre,
        duration,
        insertedAt,
        updatedAt,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Music gagal ditambahkan');
    }

    await this._cacheService.delete('songs:all-songs');
    return result.rows[0].id;
  }

  /**
   * @return {*} result
   */
  async getSongs() {
    try {
      const result = await this._cacheService.get('songs:all-songs');
      if (result) {
        return json.parse(result);
      }
    } catch (error) {
      const query = {
        text: 'SELECT id, title, performer FROM songs',
      };

      const result = await this._pool.query(query);

      await
      this._cacheService.set('songs:all-songs', JSON.stringify(result.rows));
      return result.rows.map(mapDBToModel);
    }
  }

  /**
   * @param {*} id
   * @return {*} result
   */
  async getSongById(id) {
    try {
      const result = await this._cacheService.get(`songs:${id}`);
      if (result) {
        return json.parse(result);
      }
    } catch (error) {
      const query = {
        text: 'SELECT * FROM songs WHERE id = $1',
        values: [id],
      };
      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new NotFoundError('Music tidak ditemukan');
      }

      await
      this._cacheService.set(`songs:${id}`,
          JSON.stringify(result.rows.map(mapDBToModel)[0]));
      return result.rows.map(mapDBToModel)[0];
    }
  }

  /**
   * @param {string} id
   * @param {string} title
   * @param {int} year
   * @param {string} performer
   * @param {string} genre
   * @param {int} duration
   */
  async editSongById(id, {title, year, performer, genre, duration}) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2,performer = $3,' +
      'genre = $4, duration = $5, "updatedAt" = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, updatedAt, id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui music. Id tidak ditemukan');
    }
    await this._cacheService.delete(`songs:${id}`);
    await this._cacheService.delete('songs:all-songs');
  }

  /**
   * @param {*} id
   */
  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Music gagal dihapus. Id tidak ditemukan');
    }
    await this._cacheService.delete(`songs:${id}`);
    await this._cacheService.delete('songs:all-songs');
  }
}

module.exports = SongsService;
