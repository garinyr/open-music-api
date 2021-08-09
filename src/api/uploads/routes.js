const routes = (handler) => [
  {
    method: 'POST',
    path: '/upload/pictures',
    handler: handler.postUploadImageHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 500000, // 500kb
      },
    },
  },
  {
    method: 'GET',
    path: '/upload/pictures/{filename}',
    handler: handler.getUploadImageHandler,
  },
];

module.exports = routes;
