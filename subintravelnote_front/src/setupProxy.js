const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://api.openweathermap.org",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "", // /api 경로를 제거합니다
      },
    })
  );
};
