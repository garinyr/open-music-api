const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, {service, validator, validatorPlaylistSong}) => {
    const playlistsHandler =
    new PlaylistsHandler(service, validator, validatorPlaylistSong);
    server.route(routes(playlistsHandler));
  },
};
