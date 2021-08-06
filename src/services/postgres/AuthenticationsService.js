const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

/**
 * AuthenticationsService
*/
class AuthenticationsService {
  /**
    * constructor
  */
  constructor() {
    this._pool = new Pool();
  }

  /**
    * addRefreshToken
    * @param {string} token old token
  */
  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await this._pool.query(query);
  }

  /**
    * verifyRefreshToken
    * @param {string} token token
  */
  async verifyRefreshToken(token) {
    console.log('verifyRefreshToken >>> '+ token);
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);
    console.log(result);
    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  /**
    * deleteRefreshToken
    * @param {string} token token
  */
  async deleteRefreshToken(token) {
    await this.verifyRefreshToken(token);

    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };
    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
