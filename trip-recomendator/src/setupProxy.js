const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://gemini.googleapis.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/v1/completions', // Asegúrate de que esta ruta sea correcta
      },
    })
  );
};

