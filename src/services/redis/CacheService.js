const redis = require('redis');

/**
 * CacheService
 */
class CacheService {
  /**
   * constructor
   */
  constructor() {
    this._client = redis.createClient({
      host: process.env.REDIS_SERVER,
    });

    this._client.on('error', (error) => {
      throw error;
    });
  }

  /**
   * @param {*} key
   * @param {*} value
   * @param {*} expirationInSecond
   * @return {*}
   */
  set(key, value, expirationInSecond = 3600) {
    return new Promise((resolve, reject) => {
      this._client.set(key, value, 'EX', expirationInSecond, (error, ok) => {
        if (error) {
          return reject(error);
        }

        return resolve(ok);
      });
    });
  }

  /**
   * @param {*} key
   * @return {*}
   */
  get(key) {
    return new Promise((resolve, reject) => {
      this._client.get(key, (error, reply) => {
        if (error) {
          return reject(error);
        }

        if (reply === null) {
          return reject(new Error('Nilai tidak ditemukan'));
        }

        return resolve(reply.toString());
      });
    });
  }

  /**
   * @param {*} key
   * @return {*}
   */
  delete(key) {
    return new Promise((resolve, reject) => {
      this._client.del(key, (error, count) => {
        if (error) {
          return reject(error);
        }

        return resolve(count);
      });
    });
  }
}

module.exports = CacheService;
