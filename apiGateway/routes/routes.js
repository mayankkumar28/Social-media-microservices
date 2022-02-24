const { fixRequestBody } = require("http-proxy-middleware");

const ROUTES = [
  {
    url: "/user/login",
    auth: false,
    proxy: {
      target: process.env.USER_SERVICE_URL,
      changeOrigin: true,
      onProxyReq: fixRequestBody,
    },
  },
  {
    url: "/user/register",
    auth: false,
    proxy: {
      target: process.env.USER_SERVICE_URL,
      changeOrigin: true,
      onProxyReq: fixRequestBody,
    },
  },
  {
    url: "/user/update",
    auth: true,
    proxy: {
      target: process.env.USER_SERVICE_URL,
      changeOrigin: true,
      onProxyReq: fixRequestBody,
    },
  },
  {
    url: "/user/delete/:id",
    auth: true,
    proxy: {
      target: process.env.USER_SERVICE_URL,
      changeOrigin: true,
      onProxyReq: fixRequestBody,
    },
  },
  {
    url: "/user/find/:id",
    auth: "admin",
    proxy: {
      target: process.env.USER_SERVICE_URL,
      changeOrigin: true,
      onProxyReq: fixRequestBody,
    },
  },
  {
    url: "/user/test/:filename",
    auth: false,
    proxy: {
      target: process.env.USER_SERVICE_URL,
      changeOrigin: true,
      onProxyReq: fixRequestBody,
    },
  },
  {
    url: "/content/post",
    auth: true,
    proxy: {
      target: process.env.CONTENT_SERVICE_URL,
      changeOrigin: true,
      onProxyReq: fixRequestBody,
    },
  },
  {
    url: "/content/mostRead",
    auth: false,
    proxy: {
      target: process.env.CONTENT_SERVICE_URL,
      changeOrigin: true,
      onProxyReq: fixRequestBody,
    },
  },
  {
    url: "/content/mostLiked",
    auth: false,
    proxy: {
      target: process.env.CONTENT_SERVICE_URL,
      changeOrigin: true,
      onProxyReq: fixRequestBody,
    },
  },
  {
    url: "/content/test/:filename",
    auth: false,
    proxy: {
      target: process.env.CONTENT_SERVICE_URL,
      changeOrigin: true,
      onProxyReq: fixRequestBody,
    },
  },
  {
    url: "/content/update/:id",
    auth: true,
    proxy: {
      target: process.env.CONTENT_SERVICE_URL,
      changeOrigin: true,
      onProxyReq: fixRequestBody,
    },
  },
  {
    url: "/content/delete/:id",
    auth: true,
    proxy: {
      target: process.env.CONTENT_SERVICE_URL,
      changeOrigin: true,
      onProxyReq: fixRequestBody,
    },
  },
  {
    url: "/content/recent",
    auth: false,
    proxy: {
      target: process.env.CONTENT_SERVICE_URL,
      changeOrigin: true,
      onProxyReq: fixRequestBody,
    },
  },
  {
    url: "/content/findByAuthor/:userId",
    auth: false,
    proxy: {
      target: process.env.CONTENT_SERVICE_URL,
      changeOrigin: true,
      onProxyReq: fixRequestBody,
    },
  },
  {
    url: "/interaction/read/:id",
    auth: true,
    proxy: {
      target: process.env.USER_INTERACTIONSERVICE_URL,
      changeOrigin: true,
      onProxyReq: fixRequestBody,
    },
  },
  {
    url: "/interaction/like/:id",
    auth: true,
    proxy: {
      target: process.env.USER_INTERACTIONSERVICE_URL,
      changeOrigin: true,
      onProxyReq: fixRequestBody,
    },
  },
];

exports.ROUTES = ROUTES;
