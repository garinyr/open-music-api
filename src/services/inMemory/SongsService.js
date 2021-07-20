const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._songs = [];
  }

  addSong({ title, year, performer, genre, duration }) {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const tahun = parseInt(year);
    const durasi = parseInt(duration);

    const newSong = {
      id,
      title,
      year: tahun,
      performer,
      genre,
      duration: durasi,
      insertedAt,
      updatedAt,
    };

    this._songs.push(newSong);

    const isSuccess = this._songs.filter((song) => song.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Music gagal ditambahkan');
    }

    return id;
  }

  getSongs() {
    for (const [key, value] of Object.entries(this._songs)) {
      const song = [
        {
          id: value.id,
          title: value.title,
          performer: value.performer,
        },
      ];
      return song;
    }
  }

  getSongById(id) {
    const song = this._songs.filter((n) => n.id === id)[0];
    if (!song) {
      throw new NotFoundError('Music tidak ditemukan');
    }
    return song;
  }

  editSongById(id, { title, year, performer, genre, duration }) {
    const index = this._songs.findIndex((song) => song.id === id);

    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui music. Id tidak ditemukan');
    }

    const updatedAt = new Date().toISOString();
    const tahun = parseInt(year);
    const durasi = parseInt(duration);

    this._songs[index] = {
      ...this._songs[index],
      title,
      year: tahun,
      performer,
      genre,
      duration: durasi,
      updatedAt,
    };
  }

  deleteSongById(id) {
    const index = this._songs.findIndex((song) => song.id === id);
    if (index === -1) {
      throw new NotFoundError('Music gagal dihapus. Id tidak ditemukan');
    }
    this._songs.splice(index, 1);
  }
}

module.exports = SongsService;
